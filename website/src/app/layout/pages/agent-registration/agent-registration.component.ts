import { ApiUrl } from './../../../core/apiUrl';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO } from 'ngx-intl-tel-input';
import { Router } from '@angular/router';
import { MessagingService } from './../../../services/messaging/messaging.service';
import { HttpService } from './../../../services/http/http.service';
import { UtilityService } from './../../../services/utility/utility.service';
import { AppSettings } from './../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../core/theme/styleVariables.model';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from './../../../core/global';
import { StyleConstants } from 'src/app/core/theme/styleConstants.model';

@Component({
  selector: 'app-agent-registration',
  templateUrl: './agent-registration.component.html',
  styleUrls: ['./agent-registration.component.scss']
})
export class AgentRegistrationComponent implements OnInit {

  styleSubscription: Subscription;
  settingSubscription: Subscription;
  agentForm: FormGroup;
  submitted: boolean = false;
  style: StyleVariables;
  settings: AppSettings;
  isLoading: boolean = false;
  documents: Array<any> = [];
  imageType: Array<string> = [];
  image: any = '';
  imageToUpload: any;

  primaryButton: StyleConstants;
  siteName: string = "";

  public flavorOfTheWeek: any = {};

  countryISO: CountryISO | string = CountryISO.UnitedStates;
  preferredCountries: Array<any> | Array<any> = [];
  selectedIso: string = '';

  countryCodeString: string = '';
  countryCodeFlag: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private util: UtilityService,
    private http: HttpService,
    private message: MessagingService,
    private router: Router,
    private translate: TranslateService
  ) {

    this.imageType = GlobalVariable.imageType;
    this.primaryButton = new StyleConstants();
    this.siteName = GlobalVariable.SITE_NAME;
  }

  ngOnInit() {
    this.styleSubscription = this.util.getStyles
      .subscribe((style: StyleVariables) => {
        this.style = style;
        this.primaryButton.backgroundColor = style.primaryColor;
        this.primaryButton.color = '#ffffff';
      });

    this.settingSubscription = this.util.getSettings.subscribe((settings: AppSettings) => {
      if (!!settings) {
        this.settings = settings;
        if (this.settings.is_flavor_of_week_enable) {
          this.flavorOfTheWeek = JSON.parse(this.settings.flavor_of_week);
          var checkText = this.flavorOfTheWeek.become_driver_signup_text;
          checkText = checkText.replace(/<[^>]*>/g, '')
          if (!checkText) {
            this.flavorOfTheWeek.become_driver_signup_text = null;
          }
        }
        if (!!settings.countryISO) {
          this.countryISO = (settings.countryISO).toLowerCase();
          //this.preferredCountries = [(settings.countryISO).toLowerCase()];
        }
        if (this.settings.countryCodes.length > 0) {
          this.settings.countryCodes.forEach(item => {
            if(settings.cutom_country_code == 1){
              this.preferredCountries.push(item)
            } else {
              this.preferredCountries.push(item.iso.toLowerCase())
            }
          });
        }
      }
    });

    this.initForm();
  }

  initForm() {
    this.agentForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      driver_license_number: ['', [Validators.required]],
      car_model: ['', [Validators.required]],
      car_color: ['', [Validators.required]],
      is_car_insured: 1,
      latitude: '',
      longitude: '',
      country: '',
      city: '',
      is_agreeed: 1
    });

    if(this.settings.cutom_country_code) {
      this.agentForm.addControl('countryCode', new FormControl('', [Validators.required]))
    }
  }

  get form() { return this.agentForm.controls; }
  onChangeCountry() {
    if (this.preferredCountries.length > 0) {
      this.preferredCountries.filter((x: any) => {
        if (x.country_code === this.agentForm.value.countryCode) {
          this.selectedIso = x.iso;
        }
      });
    }
  }

  setCountryCode(data) {
    this.agentForm.controls.countryCode.setValue(data.country_code);
    this.selectedIso = data.iso;
    this.countryCodeString = data.country_code;
    this.countryCodeFlag = data.flag_image;
  }

  onSubmit() {
    this.submitted = true;

    if (this.agentForm.invalid) {
      setTimeout(() => {
        this.submitted = false;
      }, 15000);
      return;
    }

    if (this.agentForm.value.is_agreeed == 0 && this.agentForm.value.is_car_insured == 1) return;

    if (!this.documents.length && this.agentForm.value.is_car_insured == 1) {
      this.message.alert('warning', 'Please Select Insuarance Documents');
      return;
    }

    if (!this.agentForm.value.latitude || !this.agentForm.value.longitude) {
      this.message.alert('warning', 'Location invalid please try again');
      return;
    }

    let payload = {
      name: this.agentForm.value.name,
      email: this.agentForm.value.email,
      phone_number: !this.settings.cutom_country_code ? this.agentForm.value.phone_number.number : this.agentForm.value.phone_number,
      iso: !this.settings.cutom_country_code ? this.agentForm.value.phone_number.countryCode : this.selectedIso,
      password: this.agentForm.value.password,
      latitude: this.agentForm.value.latitude,
      longitude: this.agentForm.value.longitude,
      country: this.agentForm.value.country,
      city: this.agentForm.value.city,
      driver_license_number: this.agentForm.value.driver_license_number,
      car_model: this.agentForm.value.car_model,
      car_color: this.agentForm.value.car_color,
      is_car_insured: this.agentForm.value.is_car_insured,
    }

    if(this.settings.cutom_country_code) {
      payload['country_code'] = this.agentForm.value.countryCode;
    }
    if (this.imageToUpload) {
      payload['file'] = this.imageToUpload;
    }

    let form_data = new FormData();
    for (let key in payload) {
      form_data.append(key, payload[key]);
    }

    if (this.documents.length) {
      for (let document of this.documents) {
        form_data.append('documents', document);
      }
    }
    let headers = [{
      key: 'secret_key',
      value: GlobalVariable.AGENT_DB_KEY
    }];

    this.isLoading = true;
    this.http.postAgentData(ApiUrl.registerAgent, form_data, headers)
      .subscribe(response => {
        if (response) {
          this.message.toast('success', 'Registration Successfull');
          this.router.navigate(['/']);
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
      });

  }

  onDocumentSelect(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.documents.push(file)
    }
  }

  removeDocument() {
    this.documents = [];
  }

  addressSearch(data) {
    this.agentForm.controls.address.setValue(data.formatted_address);
    this.agentForm.controls.country.setValue(data.country);
    this.agentForm.controls.city.setValue(data.locality);
    this.agentForm.controls.latitude.setValue(data.lat);
    this.agentForm.controls.longitude.setValue(data.lng);
  }
  trackBydocumentsFn(id, index) {
    return index;
  }
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
}
