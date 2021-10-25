import { AppSettings } from './../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../core/theme/styleVariables.model';
import { StyleConstants } from './../../../core/theme/styleConstants.model';
import { MessagingService } from './../../../services/messaging/messaging.service';
import { ApiUrl } from './../../../core/apiUrl';
import { HttpService } from './../../../services/http/http.service';
import { UtilityService } from './../../../services/utility/utility.service';
import { AppHandler } from './../../../shared/models/appHandler.model';
import { UserService } from './../../../services/user/user.service';
import { GlobalVariable } from './../../../core/global';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TooltipLabel, SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  @Output() closeModal = new EventEmitter<boolean>();
  @Output() openForgot = new EventEmitter<boolean>();
  @Output() onIncompleteProfile = new EventEmitter<any>();
  @Output() socialLogin = new EventEmitter<any>();
  @Input() is_tnc_checked: boolean = false;

  loginType: 'email' | 'phone' = 'email';
  siteName: string = '';
  loginForm: FormGroup;
  submitted: boolean = false;
  emailPattern: RegExp;
  handler: AppHandler;
  primaryButton: StyleConstants;
  style: StyleVariables;
  styleSubscription: Subscription;
  settings: AppSettings;
  image_paths: string = '';
  passwordType: string = 'password';

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  countryISO: CountryISO | string = CountryISO.UnitedStates;
  preferredCountries: Array<any> | Array<any> = [];

  isLoading: boolean = false;

  otpView: boolean;
  otpForm: FormGroup;
  otpSubmitted: boolean;
  counter = 180;
  interval = 1000;
  count: number;
  userCreatedId: string;
  countryCodeString: string = '';
  countryCodeFlag: string = '';

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private user: UserService,
    private util: UtilityService,
    private http: HttpService,
    private message: MessagingService,
    private router: Router) {

    this.siteName = GlobalVariable.SITE_NAME;
    this.style = new StyleVariables();
    this.primaryButton = new StyleConstants();
  }

  ngOnInit() {
    this.styleSubscription = this.util.getStyles
      .subscribe((style: StyleVariables) => {
        this.style = style;
        this.primaryButton.backgroundColor = style.primaryColor;
        this.primaryButton.color = '#ffffff';
      });

    this.util.getSettings.subscribe((settings: AppSettings) => {
      if (!!settings) {
        this.settings = settings;
        this.image_paths = settings.site_logo;
        this.loginType = settings.phone_registration_flag == 1 ? 'phone' : 'email';

        if (settings.countryCodes.length > 0) {
          settings.countryCodes.forEach(item => {
            if(settings.cutom_country_code == 1){
              this.preferredCountries.push(item)
            } else {
              this.preferredCountries.push(item.iso.toLowerCase())
            }
          });
        }  
        if (!!settings.countryISO && !settings.cutom_country_code) {
          this.countryISO = (settings.countryISO).toLowerCase();
          this.preferredCountries = [(settings.countryISO).toLowerCase()];
        }
        
      }
    });
    this.createLoginForm();
  }

  setCountryCode(data) {
    console.log('data', data);
    
    this.loginForm.controls.countryCode.setValue(data.country_code);
    this.countryCodeString = data.country_code;
    this.countryCodeFlag = data.flag_image;
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      deviceToken: GlobalVariable.device_token,
      deviceType: GlobalVariable.device_type,
      languageId: this.util.handler.languageId
    });
    if (this.loginType == 'email' && !this.settings.enable_signup_phone_only) {
      this.loginForm.addControl('email', new FormControl('', [Validators.required, Validators.email]));
    } else {
      this.loginForm.addControl(this.settings.phone_registration_flag == 0 ? 'phoneNumber' : 'mobileNumber', new FormControl(null, [Validators.required]))
      if(this.settings.cutom_country_code) {
        this.loginForm.addControl('countryCode', new FormControl('', [Validators.required]))
      }
    }

    // login with otp (whatsApp)
    if (this.settings.phone_registration_flag == 0 || (this.loginType == 'email' && !this.settings.enable_signup_phone_only)) {
      this.loginForm.addControl('password', new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]));
    } else {
      this.loginForm.addControl('latitude', new FormControl(this.util.handler.latitude)),
        this.loginForm.addControl('longitude', new FormControl(this.util.handler.longitude));
    }

  }

  loginMethod(type: any) {
    if (this.loginType == type) return;
    this.loginType = type;
    this.createLoginForm();
    this.submitted = false;
  }

  get userForm() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      setTimeout(() => {
        this.submitted = false;
      }, 10000);
      return;
    }

    if (!this.is_tnc_checked && this.settings.auth_terms_check == 1) {
      this.message.toast("info", "You must accept the terms and conditions!");
      return;
    }

    const payload = { ...this.loginForm.value };
    if (this.loginType == 'phone' || this.settings.enable_signup_phone_only) {
      
      if(this.settings.cutom_country_code) {
        payload.countryCode = payload['countryCode'];
        payload[this.settings.phone_registration_flag == 0 ? 'phoneNumber' : 'mobileNumber'] =
        payload[this.settings.phone_registration_flag == 0 ? 'phoneNumber' : 'mobileNumber'];
      } else {
        payload.countryCode = payload[this.settings.phone_registration_flag == 0 ? 'phoneNumber' : 'mobileNumber'].dialCode;

        payload[this.settings.phone_registration_flag == 0 ? 'phoneNumber' : 'mobileNumber'] =
        Number(payload[this.settings.phone_registration_flag == 0 ? 'phoneNumber' : 'mobileNumber'].number.replace(/[^\d]/g, '')); // / +/g
      }
    }

    if (this.settings.phone_registration_flag == 1) {
      payload['mobileNumber'] =
        JSON.stringify(payload['mobileNumber']);
    }

    const firebaseToken = this.util.getLocalData('fcm_token');
    if (firebaseToken) {
      payload['deviceToken'] = firebaseToken;
      payload['deviceType'] = '2';
    }

    this.isLoading = true;
    this.http.postData(this.settings.phone_registration_flag == 0 ? ApiUrl.auth.login : ApiUrl.auth.whatsappSendOtp, payload)
      .subscribe(response => {
        this.isLoading = false;
        if (!!response && response.data) {
          if (this.settings.phone_registration_flag == 1) { // login with otp
            this.userCreatedId = response.data.userCreatedId;
            this.createOtpForm();
            this.otpView = true;
            return;
          }

          this.afterLogin(response);
        }
        else {
          this.message.toast("error", response.message || "Something went wrong");
        }
      },
        (err) => {
          this.isLoading = false;
        });
  }

  /********** login OTP check start **********/
  createOtpForm() {
    this.otpForm = this.formBuilder.group({
      userCreatedId: [this.userCreatedId, Validators.required],
      languageId: this.util.handler.languageId,
      otp: ['', [Validators.required, Validators.maxLength(5)]]
    });
  }

  get otpfm() { return this.otpForm.controls; }

  confirmOTP() {
    this.otpSubmitted = true;
    if (this.otpForm.invalid) {
      setTimeout(() => {
        this.otpSubmitted = false;
      }, 10000);
      return;
    }

    this.isLoading = true;
    this.http.postData(ApiUrl.auth.whatsappOtpVerify, this.otpForm.value)
      .subscribe(response => {
        this.isLoading = false;
        if (!!response && response.data) {
          this.otpView = false;
          this.otpSubmitted = false;
          this.afterLogin(response);
        }
      }, error => {
        this.isLoading = false;
      });
  }

  resendOTP() {
    this.isLoading = true;
    this.counter = 0;
    this.http.postData(ApiUrl.auth.whatsappResendOtp, { userCreatedId: this.userCreatedId })
      .subscribe(response => {
        this.isLoading = false;
        if (!!response && response.data) {
          this.counter = 180;
          this.message.toast('success', 'OTP Has Been Sent Again');
        }
      });
  }

  afterLogin(response) {
    if (!response.data.firstname && this.settings.phone_registration_flag == 0) {
      this.onIncompleteProfile.emit(response.data);
      return;
    }
    if (response['data']['accessToken']) {
      response['data']['access_token'] = response['data']['accessToken'];
    }
    this.closeModal.emit(true);
    this.user.setUserLocalData(response['data']);
    this.message.toast('success', this.translate.instant('Logged-In Successfully'));
    // this.util.callGetData.next(true);
    const redirectAfterLogin = this.util.getLocalData('redirectAfterLogin', false);
    if (redirectAfterLogin !== null) {
      this.router.navigate([redirectAfterLogin]);
      this.util.setLocalData('redirectAfterLogin', '', false);
    }
  }

  openForgotPassword() {
    this.openForgot.emit(true);
  }

  onSocialLogin(userData) {
    if (userData['otp_verified'] && userData['access_token']) {
      this.user.setUserLocalData(userData);
      this.message.toast('success', this.translate.instant('Logged-In Successfully'));
      this.closeModal.emit(true);
    } else {
      this.socialLogin.emit(userData);
    }
  }

  ngOnDestroy() {
    this.styleSubscription.unsubscribe();
  }

}
