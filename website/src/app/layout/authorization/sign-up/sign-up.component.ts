import { AppSettings } from './../../../shared/models/appSettings.model';
import { ApiUrl } from './../../../core/apiUrl';
import { HttpService } from './../../../services/http/http.service';
import { MessagingService } from './../../../services/messaging/messaging.service';
import { StyleVariables } from './../../../core/theme/styleVariables.model';
import { UserService } from './../../../services/user/user.service';
import { UtilityService } from './../../../services/utility/utility.service';
import { GlobalVariable } from './../../../core/global';
import { StyleConstants } from './../../../core/theme/styleConstants.model';
import { AppHandler } from './../../../shared/models/appHandler.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TooltipLabel, SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { ValidationService } from '../../../services/validation/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseAnalyticsService } from '../../../services/firebase-analytics/firebase-analytics.service';
import { SegmentAnalyticsService } from '../../../services/firebase-analytics/segment-analytics.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

  @Output() closeModal = new EventEmitter<boolean>();
  @Output() otherLogins = new EventEmitter<boolean>();

  @Input() inCompleteProfile: any = {};
  @Input() is_tnc_checked: boolean = false;

  signUpForm: FormGroup;
  phoneForm: FormGroup;
  phoneOnlyForm: FormGroup;
  otpForm: FormGroup;
  infoForm: FormGroup;
  emailForm: FormGroup;
  primaryButton: StyleConstants;
  style: StyleVariables;

  submitted: boolean = false;
  phoneSubmitted: boolean = false;
  otpSubmitted: boolean = false;
  infoSubmitted: boolean = false;

  step1: boolean = true;
  step2: boolean = false;
  otpView: boolean = false;
  step3: boolean = false;

  counter: number = 180;
  interval: number = 1000;

  siteName: string = '';
  emailPattern: RegExp;
  handler: AppHandler;
  styleSubscription: Subscription;
  accesstoken: string = '';
  userData: any;
  imageType: Array<string> = [];
  image: any = '';
  showLoader: boolean = false;
  imageToUpload: any;
  phoneNumber: string = '';
  settings: AppSettings;
  image_paths: string = '';

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  countryISO: CountryISO | string = CountryISO.UnitedStates;
  preferredCountries: Array<any> | Array<any> = [];

  is_referral = false;
  is_allow_notification: boolean = false;
  showPassword = false;
  documents: Array<any> = [];
  documents_uploaded: boolean = false;

  userCreatedId: string;

  onlyEmailView: boolean = false;
  socialData: any = null;

  alphabetsOnly: RegExp = /^[a-zA-Z ]*$/;

  public dateOfBirth: string = "";

  countryCodeString: string = '';
  countryCodeFlag: string = '';

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private user: UserService,
    private util: UtilityService,
    private message: MessagingService,
    private http: HttpService,
    private validator: ValidationService,
    private fireBaseAnSvc: FirebaseAnalyticsService,
    private segmentAnalyticsSvc: SegmentAnalyticsService,
    private router: Router
  ) {

    this.emailPattern = new RegExp(this.validator.email);
    this.primaryButton = new StyleConstants();
    this.style = new StyleVariables();
    this.imageType = GlobalVariable.imageType;
    this.siteName = GlobalVariable.SITE_NAME;
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

        if (settings.countryCodes.length > 0) {
          settings.countryCodes.forEach(item => {
            if (settings.cutom_country_code == 1) {
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

    if (this.inCompleteProfile && this.inCompleteProfile.access_token) {
      this.step1 = false;
      this.step3 = true;
      this.userData = {};
      this.accesstoken = this.inCompleteProfile.access_token;
      this.createInfoForm();
    } else {
      if (this.settings.phone_registration_flag == 1) { // signup with otp
        this.createOtpSignUpForm();
        return;
      }
      // other forms //
      if (this.settings.user_register_flow == 1) { // single page registration
        this.createSinglePageSignUpForm();
      } else {
        this.createSignUpForm();
      }
    }

    if (this.settings.enable_signup_phone_only) {
      this.createPhoneOnlyForm();
    }

    if (this.userForm['mobileNumber']) {
      this.userForm['countryCode'].setValue(this.preferredCountries[0].country_code);
    }
  }

  initEmailForm(event) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.onlyEmailView = true;
    this.socialData = event;
  }

  onEmailSubmit() {
    this.submitted = true;
    if (this.emailForm.invalid) {
      setTimeout(() => {
        this.submitted = false;
      }, 10000);
      return;
    }
    this.socialData['email'] = this.emailForm.value.email;

    this.http.postData(ApiUrl.auth.facebookLogin, this.socialData)
      .subscribe(response => {
        if (!!response && response.data) {
          response['data']['is_social_login'] = true;
          this.onSocialLogin(response['data']);
          this.user.setUserLocalData(response['data']);
          // this.util.callGetData.next(true);
        }
      });
  }

  onSocialLogin(user: any): void {
    this.userData = user;
    this.accesstoken = user.access_token;
    this.image = user.image || user['user_image'] || '';
    if (!user.otp_verified) {
      this.createPhoneForm();
      this.step1 = false;
      this.step2 = true;
      this.submitted = false;
      this.otherLogins.emit(false);
    } else {
      this.closeModal.emit(true);
      this.user.setUserLocalData(user);
      this.message.toast('success', this.translate.instant('Logged-In Successfully'));
    }
  }

  /********** SignUp Step 1 start **********/
  createSinglePageSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobileNumber: new FormControl(undefined, [Validators.required]),
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      passwordField: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        confirmPassword: ['', Validators.required]
      }, { validator: this.checkPasswords }
      ),
      deviceToken: GlobalVariable.device_token,
      deviceType: GlobalVariable.device_type,
      languageId: this.util.handler.languageId,
      latitude: this.util.handler.latitude,
      longitude: this.util.handler.longitude,
      referralCode: [{ value: '', disabled: !this.is_referral }, [Validators.required]]
    });
    if (this.settings.cutom_country_code) {
      this.signUpForm.addControl('countryCode', new FormControl('', [Validators.required]))
    } else {
      this.signUpForm.addControl('countryCode', new FormControl(''))
    }
    this.otherLogins.emit(true);
  }

  createSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      deviceToken: GlobalVariable.device_token,
      deviceType: GlobalVariable.device_type,
      languageId: this.util.handler.languageId,
      // latitude: this.util.handler.latitude,
      // longitude: this.util.handler.longitude
    });
    this.otherLogins.emit(true);
  }

  createOtpSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      deviceToken: GlobalVariable.device_token,
      deviceType: JSON.stringify(GlobalVariable.device_type),
      languageId: this.util.handler.languageId,
      mobileNumber: new FormControl(null, [Validators.required]),
      name: [''],
      latitude: this.util.handler.latitude,
      longitude: this.util.handler.longitude
    });
    if (this.settings.cutom_country_code) {
      this.signUpForm.addControl('countryCode', new FormControl('', [Validators.required]))
    }
    this.otherLogins.emit(true);
  }

  get userForm() { return this.signUpForm.controls; }

  /**password and Confirm password  starts*/
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  get password() {
    return this.signUpForm.controls.passwordField as FormGroup;
  }

  /**password and Confirm password  ends*/

  onSubmit() {
    this.submitted = true;
    if (this.settings.enable_signup_phone_only ? this.phoneOnlyForm.invalid : this.signUpForm.invalid) {
      setTimeout(() => {
        this.submitted = false;
      }, 10000);
      return;
    }
    if (!this.is_tnc_checked && this.settings.auth_terms_check == 1) {
      this.message.toast("info", "You must accept the terms and conditions!");
      return;
    }
    if (!this.is_allow_notification && this.settings.notification_message_permission == 1) {
      this.message.toast("info", "You must accept receive message permission!");
      return;
    }
    var payload;
    if (this.settings.enable_signup_phone_only) {
      payload = { ...this.phoneOnlyForm.value };
    }
    else {
      payload = { ...this.signUpForm.value };
    }
    const firebaseToken = this.util.getLocalData('fcm_token');
    if (firebaseToken) {
      payload['deviceToken'] = firebaseToken;
    }
    if (this.settings.user_register_flow == 1 || this.settings.enable_signup_phone_only) {
      payload.countryCode = !this.settings.cutom_country_code ? payload.mobileNumber.dialCode : payload.countryCode;
      payload.mobileNumber = !this.settings.cutom_country_code ? Number(payload.mobileNumber.number.replace(/[^\d]/g, "")) : payload.mobileNumber;
      if (!this.settings.enable_signup_phone_only) {
        payload.password = payload.passwordField.password;
        delete payload.passwordField;
      }
      else {
        payload.password = payload.password;
      }
      payload['deviceType'] = '2';

    } else {
      payload['deviceType'] = 2;
    }

    if (this.settings.user_register_flow == 1) {
      if (this.settings.enable_date_of_birth && this.dateOfBirth) {
        payload['dateOfBirth'] = moment(this.dateOfBirth.toString()).format('YYYY-MM-DD');
      }
    }

    this.showLoader = true;
    this.http.postData(this.settings.user_register_flow == 1 ? ApiUrl.auth.signUp : ApiUrl.auth.signUp_step1, payload)
      .subscribe(response => {
        this.showLoader = false;
        if (!!response && response.data) {
          this.userData = response.data;
          this.step1 = false;

          this.util.setLocalData('user_pass', this.signUpForm.value.password);

          if (!this.settings.enable_signup_phone_only) {
            if (this.settings.user_register_flow == 1) {
              this.accesstoken = response.data.access_token;
              this.createOtpForm();
              this.otpView = true;
            } else {
              this.accesstoken = response.data.access_token;
              this.createPhoneForm();
              this.step2 = true;
            }
          }
          else {
            if (this.settings.user_register_flow == 1) {
              this.accesstoken = response.data.access_token;
            } else {
              this.accesstoken = response.data.access_token;
              this.step3 = true;
              this.createInfoForm();
            }
          }

          this.submitted = false;
          this.otherLogins.emit(false);

        }
      }, error => {
        this.showLoader = false;
      });
  }

  onSubmitOtpSignupForm() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      setTimeout(() => {
        this.submitted = false;
      }, 10000);
      return;
    }
    if (!this.is_tnc_checked && this.settings.auth_terms_check == 1) {
      this.message.toast("info", "You must accept the terms and conditions!");
      return;
    }
    const payload = { ...this.signUpForm.value };
    const firebaseToken = this.util.getLocalData('fcm_token');
    if (firebaseToken) {
      payload['deviceToken'] = firebaseToken;
    }

    payload.countryCode = !this.settings.cutom_country_code ? payload.mobileNumber.dialCode : payload.countryCode;
    payload.mobileNumber = !this.settings.cutom_country_code ? Number(payload.mobileNumber.number.replace(/[^\d]/g, "")) : payload.mobileNumber;

    payload['mobileNumber'] = JSON.stringify(payload['mobileNumber']);
    this.showLoader = true;
    this.http.postData(ApiUrl.auth.whatsappSendOtp, payload)
      .subscribe(response => {
        this.showLoader = false;
        if (!!response && response.data) {
          this.userData = response.data;
          this.step1 = false;
          this.userCreatedId = response.data.userCreatedId;
          this.createOtpForm();
          this.otpView = true;

          this.submitted = false;
          this.otherLogins.emit(false);

        }
      }, error => {
        this.showLoader = false;
      });
  }
  /********** SignUp Step 1 ends **********/

  /********** SignUp Step 2 start **********/
  changeReferralView(isUserForm?: boolean) {
    this.is_referral = !this.is_referral;
    if (!this.settings.enable_signup_phone_only) {
      if (this.is_referral) {
        isUserForm ? this.signUpForm.controls.referralCode.enable() : this.phoneForm.controls.referralCode.enable();
      } else {
        isUserForm ? this.signUpForm.controls.referralCode.disable() : this.phoneForm.controls.referralCode.disable();
      }
    }
    else {
      if (this.is_referral) {
        isUserForm ? this.signUpForm.controls.referralCode.enable() : this.phoneOnlyForm.controls.referralCode.enable();
      } else {
        isUserForm ? this.signUpForm.controls.referralCode.disable() : this.phoneOnlyForm.controls.referralCode.disable();
      }
    }

  }

  createPhoneForm() {
    this.phoneForm = this.formBuilder.group({
      mobileNumber: new FormControl(undefined, [Validators.required]),
      referralCode: [{ value: '', disabled: !this.is_referral }, [Validators.required]]
    });

    if (this.settings.cutom_country_code) {
      this.phoneForm.addControl('countryCode', new FormControl('', [Validators.required]))
    }
  }
  createPhoneOnlyForm() {
    this.phoneOnlyForm = this.formBuilder.group({
      mobileNumber: new FormControl(undefined, [Validators.required]),
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      deviceToken: GlobalVariable.device_token,
      deviceType: GlobalVariable.device_type,
      languageId: this.util.handler.languageId,
      referralCode: [{ value: '', disabled: !this.is_referral }, [Validators.required]]
    });

    if (this.settings.cutom_country_code) {
      this.phoneOnlyForm.addControl('countryCode', new FormControl('', [Validators.required]))
    }
  }


  get phone() { return this.phoneForm.controls; }

  sendOTP() {
    this.phoneSubmitted = true;
    if (this.phoneForm.invalid) {
      setTimeout(() => {
        this.phoneSubmitted = false;
      }, 10000);
      return;
    }
    this.phoneNumber = !this.settings.cutom_country_code ? (this.phoneForm.value.mobileNumber.dialCode + ' ' + this.phoneForm.value.mobileNumber.number) :
      (this.phoneForm.value.countryCode + ' ' + this.phoneForm.value.mobileNumber);

    this.showLoader = true;
    let form_data = {
      accessToken: this.accesstoken
    }

    form_data['countryCode'] = !this.settings.cutom_country_code ? this.phoneForm.value.mobileNumber.dialCode : this.phoneForm.value.countryCode;
    form_data['mobileNumber'] = !this.settings.cutom_country_code ? Number(this.phoneForm.value.mobileNumber.number.replace(/[^\d]/g, "")) : this.phoneForm.value.mobileNumber;

    if (this.is_referral && this.settings.referral_feature == 1) {
      form_data['referralCode'] = this.phoneForm.value.referralCode;
    }
    this.http.postData(ApiUrl.auth.signUp_step2, form_data)
      .subscribe(response => {
        this.showLoader = false;
        if (this.is_referral) {
          this.fireBaseAnSvc.firebaseAnalyticsEvents('referral_code_used', 'referral_code_used');
        }
        if (!!response && response.data) {
          this.createOtpForm();
          this.step2 = false;
          this.otpView = true;
          this.phoneSubmitted = false;
          this.message.toast('success', 'Please enter the verification code sent to your phone number.');
        }
      }, error => {
        this.showLoader = false;
      });

  }
  /********** SignUp Step 2 ends **********/

  /********** SignUp OTP check start **********/
  createOtpForm() {
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.maxLength(this.settings.is_twilio_authy_enable ? 7 : 5)]],
      languageId: this.util.handler.languageId,
    });

    if (this.settings.phone_registration_flag == 0) {
      this.otpForm.addControl('accessToken', new FormControl(this.accesstoken));
    } else {
      this.otpForm.addControl('userCreatedId', new FormControl(this.userCreatedId));
    }

    if (this.settings.bypass_otp == 1) {
      this.otpForm.controls['otp'].setValue(12345);
      this.confirmOTP();
    }
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

    this.showLoader = true;
    const url = this.settings.phone_registration_flag == 1 ? ApiUrl.auth.whatsappOtpVerify :
      (this.settings.user_register_flow == 1 ? ApiUrl.auth.checkOTPNew : ApiUrl.auth.checkOTP);
    this.http.postData(url, this.otpForm.value)
      .subscribe(response => {
        this.showLoader = false;
        if (!!response && response.data) {
          if (this.settings.user_register_flow == 1 || this.settings.phone_registration_flag == 1) {
            this.successfullySignIN(response.data);
          } else {
            this.createInfoForm();
            this.step3 = true;
          }
          this.otpView = false;
          this.otpSubmitted = false;
        }
      }, error => {
        this.showLoader = false;
      });
  }

  resendOTP() {
    this.showLoader = true;
    this.counter = 0;
    const apiUrl = this.settings.phone_registration_flag == 1 ? ApiUrl.auth.whatsappResendOtp : ApiUrl.auth.resendOTP;
    const objToSend = this.settings.phone_registration_flag == 1 ? { userCreatedId: this.userCreatedId } : { accessToken: this.accesstoken };
    this.http.postData(apiUrl, objToSend)
      .subscribe(response => {
        this.showLoader = false;
        if (!!response && response.data) {
          this.counter = 180;
          this.message.toast('success', 'OTP Has Been Sent Again');
        }
      });
  }
  /********** SignUp OTP check ends **********/

  /********** SignUp Step 3 start **********/
  createInfoForm() {
    this.infoForm = this.formBuilder.group({
      name: [this.userData.firstname || '', [Validators.required]],
      profilePic: [''],
      accessToken: this.accesstoken,
      'abn_number': [''],
      'business_name': [''],
    });
  }

  get info() { return this.infoForm.controls; }

  finish() {
    this.infoSubmitted = true;
    if (this.infoForm.invalid) {
      setTimeout(() => {
        this.infoSubmitted = false;
      }, 10000);
      return;
    }

    if (this.settings.user_id_proof == 1 && !this.documents_uploaded) {
      this.message.alert('warning', 'Please upload your documents to continue');
      return;
    }

    if (typeof (this.imageToUpload) === 'string' && this.imageToUpload.startsWith('C:\fakepath')) {
      this.message.alert('warning', this.translate.instant('Please Choose The Image Again'));
      return;
    }

    if (this.imageToUpload) {
      this.infoForm.value.profilePic = this.imageToUpload;
    } else {
      delete this.infoForm.value.profilePic;
    }

    let info = { ...this.infoForm.value };
    if (this.util.getLocalData('user_pass')) {
      info['password'] = this.util.getLocalData('user_pass');
    }
    if (this.settings.enable_date_of_birth && this.dateOfBirth) {
      info['dateOfBirth'] = moment(this.dateOfBirth.toString()).format('YYYY-MM-DD');
    }

    let formData = this.http.appendFormData(info);
    this.showLoader = true;
    this.http.postData(ApiUrl.auth.signUp_step3, formData)
      .subscribe(response => {
        this.showLoader = false;
        if (!!response && response.data) {
          this.util.clearLocalData('user_pass')
          this.fireBaseAnSvc.firebaseAnalyticsEvents('user_signup', 'user_signup');
          this.segmentAnalyticsSvc.segmentAnalyticsEvent('user_register', { name: this.infoForm.get('name').value, info: 'user registeration' });
          this.successfullySignIN(response.data);
        }
      }, (err) => this.showLoader = false);
  }

  successfullySignIN(data) {
    if (data['accessToken']) {
      data['access_token'] = data['accessToken'];
    }
    this.user.setUserLocalData(data);
    this.message.toast('success', this.translate.instant('Signed-up Successfully'));
    this.closeModal.emit(true);
    this.imageToUpload = '';
    const redirectAfterLogin = this.util.getLocalData('redirectAfterLogin', false);
    if (redirectAfterLogin !== null) {
      this.router.navigate([redirectAfterLogin]);
      this.util.setLocalData('redirectAfterLogin', '', false);
    }
  }

  /********** On selection of image insert the value in form **********/
  onImageSelect(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (this.imageType.includes(file.type)) {
        this.imageToUpload = event.target.files[0];
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e: any) => {
          this.image = e.target.result;
        }
      } else this.message.toast('warning', this.translate.instant('Invalid File Type'));
    }
  }

  /********** Remove image and reset profilePic field in form **********/
  removeImage() {
    this.image = '';
    this.infoForm.controls['profilePic'].reset();
    this.infoForm.value.profilePic = '';
    this.imageToUpload = '';
  }
  /********** SignUp Step 3 ends **********/


  onDocumentSelect(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.documents.push(file)
    }
  }

  uploadDocuments() {
    this.user.setUserLocalData({ 'access_token': this.accesstoken });
    if (!this.documents.length) {
      this.message.alert('warning', 'Please select documnets to upload')
    }
    let formdata = new FormData();
    this.documents.forEach(element => {
      formdata.append('documents', element);
    });

    this.http.postData(ApiUrl.documntUpload, formdata)
      .subscribe(response => {
        this.documents_uploaded = true;
        this.message.toast('success', 'Documents uploaded successfully');
      })
  }

  removeDocument(index) {
    this.documents.splice(index, 1);
  }


  otpContactUs() {
    var obj = {
      emailId: this.signUpForm.get('email').value,
      phoneNumber: this.signUpForm.value.mobileNumber ? this.signUpForm.value.mobileNumber.number :
        this.phoneForm.value.mobileNumber.number,
      countryCode: this.signUpForm.value.countryCode ? this.signUpForm.value.countryCode :
        this.phoneForm.value.mobileNumber.countryCode,
    }

    this.http.postData(ApiUrl.otpContactUs, obj)
      .subscribe(response => {
        if (response.status == 200) {
          this.message.toast('success', 'Request raised successfully');
        }
      })
  }

  setCountryCode(data, form) {
    console.log('data', data);

    this[form].controls.countryCode.setValue(data.country_code);
    this.countryCodeString = data.country_code;
    this.countryCodeFlag = data.flag_image;
  }

  back() {
    if (this.otpView && !this.step3) {
      this.step1 = false;
      this.step2 = true;
      this.otpView = false;
      this.step3 = false;
      this.createPhoneForm();
    } else if (!this.otpView && this.step3) {
      this.step1 = false;
      this.step2 = false;
      this.otpView = true;
      this.step3 = false;
      this.createOtpForm();
    }
  }
  trackByFn(id, index) {
    return index;
  }

  ngOnDestroy() {
    this.styleSubscription.unsubscribe();
  }
}
