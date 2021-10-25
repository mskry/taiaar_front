import { StyleConstants } from './../../../core/theme/styleConstants.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { ApiUrl } from './../../../core/apiUrl';
import { HttpService } from './../../../services/http/http.service';
import { UserService } from './../../../services/user/user.service';
import { UtilityService } from './../../../services/utility/utility.service';
import { MessagingService } from './../../../services/messaging/messaging.service';
import { StyleVariables } from './../../../core/theme/styleVariables.model';
import { ValidationService } from './../../../services/validation/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { AppSettings } from '../../../shared/models/appSettings.model';

declare const google: any;

@Component({
  selector: 'app-manage-address',
  templateUrl: './manage-address.component.html',
  styleUrls: ['./manage-address.component.scss']
})
export class ManageAddressComponent implements OnInit {

  addEdit: string = 'Add New';
  private subscription: Subscription;
  getDataSubscription: Subscription;
  private getSettingSubscription: Subscription;

  style: StyleVariables;
  cancelBtn: StyleConstants;
  saveBtn: StyleConstants;

  form: FormGroup;
  showError: boolean = false;
  btnDisabled: boolean = false;
  id: string = '';
  location: any = {};
  setting: AppSettings;

  isLoading: boolean = false;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  countryISO: CountryISO | string = CountryISO.UnitedStates;
  preferredCountries: Array<CountryISO> | Array<string> = [];

  countryCodeString: string = '';
  countryCodeFlag: string = '';


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private user: UserService,
    private http: HttpService,
    private message: MessagingService,
    public util: UtilityService,
    private validator: ValidationService,
    private translate: TranslateService
  ) {

    this.style = new StyleVariables();
    this.cancelBtn = new StyleConstants();
    this.saveBtn = new StyleConstants();
  }

  ngOnInit() {
    this.util.getStyles
      .subscribe(style => {
        this.style = style;
        this.cancelBtn.color = style.defaultColor;
        this.cancelBtn.borderColor = style.defaultColor;
        this.saveBtn.backgroundColor = style.primaryColor;
        this.saveBtn.borderColor = style.primaryColor;
        this.saveBtn.color = '#ffffff';
      })


    this.getSettingSubscription = this.util.getSettings.
      subscribe((data) => {
        if (data) {
          this.setting = data;
          if (!this.setting.cutom_country_code && !!this.setting.countryISO) {
            this.countryISO = (this.setting.countryISO).toLowerCase();
            this.preferredCountries = [(this.setting.countryISO).toLowerCase()];
          }
          if (this.setting.cutom_country_code == 1 && this.setting.countryCodes.length > 0) {
            this.setting.countryCodes.forEach(item => {
              if (this.setting.cutom_country_code == 1) {
                this.preferredCountries.push(item)
              } else {
                this.preferredCountries.push(item.iso.toLowerCase())
              }
            });
          }
        }
      });

    this.makeForm();
    this.subscribeRoute();
  }


  makeForm() {
    this.form = this.fb.group({
      'name': ['', Validators.compose([Validators.required, this.validator.noWhitespaceValidator])],
      'houseNo': [''],
      'collectNo': ['', Validators.compose([Validators.required, this.validator.noWhitespaceValidator])],
      'addressLineFirst': ['', Validators.compose([Validators.required])],
      'phone_number': ['', Validators.compose([!this.setting.is_address_phone_no_optional ? Validators.required : null])],
      // 'countryCode': ['', Validators.compose([Validators.required])],
      'reference_address': ['', Validators.compose([Validators.maxLength(this.setting.address_reference_char_limit)])]
    });

    if (this.setting.enable_address_on_rejected_location_permission == 1) {
      this.form.addControl('latitude', new FormControl(this.util.handler.latitude, [Validators.required]))
      this.form.addControl('longitude', new FormControl(this.util.handler.latitude, [Validators.required]))
    } else {
      this.form.addControl('latitude', new FormControl('', [Validators.required]))
      this.form.addControl('longitude', new FormControl('', [Validators.required]))
    }
    
    if (this.setting.cutom_country_code) {
      this.form.addControl('countryCode', new FormControl('', [Validators.required]))
    }

    if (this.setting.addCollectFieldInAddress == 0) {
      this.form.controls['collectNo'].setValidators(null);
      this.form.controls['collectNo'].updateValueAndValidity();
    }
    if (this.setting.enable_address_pin_code == 1) {
      this.form.addControl('pincode', new FormControl('', [Validators.required]))
    }


    // this.getDataSubscription = this.util.callGetData.
    // subscribe((data) => {
    //   if (data) {
    //     this.getGeoLocation(this.util.handler.latitude, this.util.handler.longitude);
    //   }
    // });
  }

  // subscribe route
  subscribeRoute() {
    let self = this;
    this.subscription = this.route.queryParams.subscribe(params => {
      if (params['id']) {
        self.id = params['id'];
        self.getAddress();
        self.addEdit = 'Edit';
      }
    });
  }

  getAddress() {
    let data = this.util.getLocalData('locationData', true);
    this.form.controls.name.setValue(data.name);
    this.form.controls.houseNo.setValue(data.address_line_1);

    if (this.setting.addCollectFieldInAddress == 1) {
      this.form.controls.collectNo.setValue(data.collectNumber);
    }
    this.form.controls.addressLineFirst.setValue(data.customer_address);
    this.form.controls.latitude.setValue(data.latitude);
    this.form.controls.longitude.setValue(data.longitude);
    this.form.controls.phone_number.setValue(data.phone_number);
    this.form.controls.reference_address.setValue(data.reference_address);
    if (this.setting.enable_address_pin_code == 1) {
      this.form.controls.pincode.setValue(data.pincode);
    }
    if (!this.setting.cutom_country_code) {
      this.countryISO = data.country_code;
    } else {
      let country_obj = this.preferredCountries.find(o => o['iso'] == data.country_code);
      console.log('country_obj', country_obj);
      if (!!country_obj) {
        this.setCountryCode(country_obj);
      }
      // this.form.controls.countryCode.setValue(data.country_code ? data.country_code : '');
    }
    this.getLatLong(data.customer_address);
    
  }

  getLatLong(address) {
    let self = this;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        self.form.controls.latitude.setValue(latitude);
        self.form.controls.longitude.setValue(longitude);
      }
    });
  }

  address(data: any) {
    this.form.controls.addressLineFirst.setValue(data.formatted_address);
    this.form.controls.latitude.setValue(data.lat);
    this.form.controls.longitude.setValue(data.lng);
  }

  onSubmit(value) {
    this.showError = true;
    if (this.form.valid) {
      let obj = {
        name: value.name.trim(),
        addressLineFirst: value.houseNo.trim(),
        customer_address: value.addressLineFirst.trim(),
        phone_number: !this.setting.cutom_country_code ? Number(value.phone_number.number.replace(/[^\d]/g, "")) : value.phone_number, // /-/g
        country_code: !this.setting.cutom_country_code ? value.phone_number.countryCode.replace(/ +/g, "") : value.countryCode,
        accessToken: this.user.getUserToken,
        latitude: value.latitude || this.util.handler.latitude,
        longitude: value.longitude || this.util.handler.longitude,
        languageId: this.util.handler.languageId
      };

      if (this.setting.addCollectFieldInAddress == 1) {
        obj['collectNumber'] = value.collectNo.trim();
      }
      if (this.setting.enable_address_reference) {
        obj['reference_address'] = value.reference_address
      }
      
    if (this.setting.enable_address_pin_code == 1) {
      obj['pincode'] = value.pincode
    }
      console.log(obj);

      this.addEditAddress(obj);
    }
  }

  addEditAddress(value) {
    this.isLoading = true;
    if (this.form.invalid) {
      setTimeout(() => {
        this.isLoading = false;
      }, 10000);
      return;
    }
    let url = ApiUrl.address.addAddress;
    if (this.id) {
      value['addressId'] = this.id;
      url = ApiUrl.address.editAddress;
    }

    this.http.postData(url, value)
      .subscribe(response => {
        this.isLoading = false;

        if (response.status === 200) {
          this.resetCountryCode();
          this.message.toast('success', `${this.translate.instant('Address')} ${this.id ? this.translate.instant('Updated') : this.translate.instant('Added')} ${this.translate.instant('Successfully')}!`);
          this.util.goBack();
          this.util.clearLocalData('locationData');
        }

      }, error => {
        this.isLoading = false;
      });
  }

  resetCountryCode() {
    this.countryCodeString = '';
    this.countryCodeFlag = '';
  }

  setCountryCode(data) {
    console.log('data', data);

    this.form.controls.countryCode.setValue(data.iso);
    this.countryCodeString = data.country_code;
    this.countryCodeFlag = data.flag_image;
  }

  getGeoLocation(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
    const request = { latLng: latlng };
    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this.form.patchValue({
            addressLineFirst: results[0].formatted_address,
            latitude: lat,
            longitude: lng
          });
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (!!this.getDataSubscription) this.getDataSubscription.unsubscribe();
    if (!!this.getSettingSubscription) this.getSettingSubscription.unsubscribe();
  }

}
