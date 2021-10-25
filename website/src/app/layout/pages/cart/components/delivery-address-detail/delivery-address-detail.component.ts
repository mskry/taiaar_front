import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { AppSettings } from '../../../../../shared/models/appSettings.model';
import { UtilityService } from '../../../../../services/utility/utility.service';
import { HttpService } from '../../../../../services/http/http.service';
import { UserService } from '../../../../../services/user/user.service';
import { MessagingService } from '../../../../../services/messaging/messaging.service';
import { ApiUrl } from '../../../../../core/apiUrl';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ValidationService } from '../../../../../services/validation/validation.service';
import { StyleConstants } from '../../../../../core/theme/styleConstants.model';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { GlobalVariable } from 'src/app/core/global';

@Component({
  selector: 'app-delivery-address-detail',
  templateUrl: './delivery-address-detail.component.html',
  styleUrls: ['./delivery-address-detail.component.scss']
})
export class DeliveryAddressDetailComponent implements OnInit, OnChanges, OnDestroy {

  isLoading: boolean = false;
  showError: boolean = false;
  is_self_pickup: number = 0;
  addressList: Array<any> = [];
  selectedAreaIndex: number = 0;
  localAreaIndex: number = 0;

  addressModel: any = {};
  form: FormGroup;
  display: string = "none";

  countryCodeString: string = '';
  countryCodeFlag: string = '';

  loggedIn: boolean = false;
  loggedInDataObj: any;


  @Input() cart: Array<any> = [];
  @Input() style: StyleVariables;
  @Input() settings: AppSettings;
  @Input() addAddressModel: Observable<boolean>;
  @Input() isAddressHide: number = 0;
  @Input() calc_distance: number = 0;

  @Input('loggedInData')
  set setLoggedInData(data) {
    if (data) {
      this.loggedInDataObj = data;
      if (this.loggedInDataObj.access_token) {
        this.loggedIn = true;
        this.countryISO = this.loggedInDataObj.iso || 'us';
      }
    }
  }

  

  cancelBtn: StyleConstants;
  saveBtn: StyleConstants;
  routeSubscription: Subscription;

  @ViewChild('closeAddressModal', { static: false }) closeAddressModal: ElementRef;
  @ViewChild('closeNewAddress', { static: false }) closeNewAddress: ElementRef;

  @Output() addressDetail: EventEmitter<any> = new EventEmitter<any>();
  @Output() serviceCharge: EventEmitter<any> = new EventEmitter<any>(null);

  addressId: number = 0;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  countryISO: CountryISO | string = CountryISO.UnitedStates;
  preferredCountries: Array<any> | Array<any> = [];

  client_code: string = GlobalVariable.UNIQUE_ID;



  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpService,
    private user: UserService,
    private util: UtilityService,
    private message: MessagingService,
    private validator: ValidationService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {
    this.cancelBtn = new StyleConstants();
    this.saveBtn = new StyleConstants();

    this.routeSubscription = this.route.queryParams
      .subscribe(params => {
        if (params['place_order'] == 1 && params['adrs_id']) {
          this.addressId = parseInt(params['adrs_id']);
        }
      });
  }

  ngOnInit(): void {
    if (this.settings && this.settings.app_type == 7) {
      this.is_self_pickup = 1;
    }

    // if (!!this.settings.countryISO) {
    //   this.countryISO = (this.settings.countryISO).toLowerCase();
    //   this.preferredCountries = [(this.settings.countryISO).toLowerCase()];
    // }
    if (this.settings.countryCodes.length > 0) {
      this.settings.countryCodes.forEach(item => {
        if (this.settings.cutom_country_code == 1) {
          this.preferredCountries.push(item)
        } else {
          this.preferredCountries.push(item.iso.toLowerCase())
        }
      });
    }
    if (!!this.settings.countryISO && !this.settings.cutom_country_code) {
      this.countryISO = (this.settings.countryISO).toLowerCase(); 
      this.preferredCountries = [(this.settings.countryISO).toLowerCase()];
    }
    this.cancelBtn.color = this.style.defaultColor;
    this.cancelBtn.borderColor = this.style.defaultColor;
    this.saveBtn.backgroundColor = this.style.primaryColor;
    this.saveBtn.borderColor = this.style.primaryColor;
    this.saveBtn.color = '#ffffff';

    this.makeNewAddressForm();
    this.getAddress();
    this.addAddressModel.subscribe(item => {
      if (item && this.settings.header_theme == 2) {
        this.display = 'block';
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.loggedIn && changes.loggedIn.currentValue) {
      this.getAddress();
    }
    if (changes.setLoggedInData && changes.setLoggedInData.currentValue) {
      this.getAddress();
    }
  }

  makeNewAddressForm() {
    this.form = this.fb.group({
      'name': ['', Validators.compose([Validators.required, this.validator.noWhitespaceValidator])],
      'houseNo': [''],
      'collectNo': ['', Validators.compose([Validators.required, this.validator.noWhitespaceValidator])],
      'addressLineFirst': ['', Validators.compose([Validators.required])],
      'phone_number': ['', Validators.compose([Validators.required])],
      'reference_address': ['', Validators.compose([Validators.maxLength(this.settings.address_reference_char_limit)])]
    });

    if (this.settings.enable_address_on_rejected_location_permission == 1) {
      this.form.addControl('latitude', new FormControl(this.util.handler.latitude, [Validators.required]))
      this.form.addControl('longitude', new FormControl(this.util.handler.latitude, [Validators.required]))
    } else {
      this.form.addControl('latitude', new FormControl('', [Validators.required]))
      this.form.addControl('longitude', new FormControl('', [Validators.required]))
    }
    
    if (this.settings.cutom_country_code) {
      this.form.addControl('countryCode', new FormControl('', [Validators.required]))
    }
    if (this.settings.enable_address_pin_code == 1) {
      this.form.addControl('pincode', new FormControl('', [Validators.required]))
    }

    if (this.settings.addCollectFieldInAddress == 0) {
      this.form.controls['collectNo'].setValidators(null);
      this.form.controls['collectNo'].updateValueAndValidity();
    }
  }

  getAddress() {
    let obj = {
      accessToken: this.user.getUserToken,
      languageId: this.util.handler.languageId,
      latitude: this.util.handler.latitude,
      longitude: this.util.handler.longitude
    }
    if (this.cart.length) {
      obj['supplierBranchId'] = this.cart[0].supplier_branch_id;
    }
    if(!this.loggedIn) {
      return
    }

    this.http.postData(ApiUrl.address.getAddress, obj, true)
      .subscribe(response => {
        if (!!response && response.data) {
          this.addressModel = response.data;
          this.addressList = [];
          this.addressList = response.data.address;
          let index = -1;
          if (this.addressId) {
            index = response.data.address.findIndex((add) => add.id == this.addressId);
          } else {
            if (this.util.getLocalData('cart_address', true)) {
              let cart_address = this.util.getLocalData('cart_address', true);
              index = response.data.address.findIndex((add) => add.id == cart_address.id);
            } else {
              index = response.data.address.findIndex((add) => add.is_default == 1);
            }
          }
          if (index > -1) {
            this.selectedAreaIndex = index;
            this.localAreaIndex = index;
          }
          if (this.settings.supplier_service_fee == 1 && response.data.user_service_charge) {
            this.serviceCharge.emit(response.data.user_service_charge);
          }
          this.onAddressSelect();
        }
      });
  }

  onAddressSelect(): void {
    this.selectedAreaIndex = this.localAreaIndex;
    let completeInfo = Object.assign({}, this.addressModel);
    completeInfo.address = this.addressList[this.selectedAreaIndex];
    this.addressDetail.emit(completeInfo);
    this.closeAddressModal.nativeElement.click();
  }

  addAddress() {
    if (this.loggedIn) {
      this.router.navigate(['/account/address/add-edit-address']);
    } else {
      this.message.alert('info', `${this.translate.instant('Please Login First')}!`);
    }
  }

  openNewAddressDialog() {
    if (!this.loggedIn) {
      this.message.alert('info', `${this.translate.instant('Please Login First')}!`);
    } else {
      this.display = 'block';
    }
  }

  onAddressSearch(data) {
    this.form.controls.addressLineFirst.setValue(data.formatted_address);
    this.form.controls.latitude.setValue(data.lat);
    this.form.controls.longitude.setValue(data.lng);
  }

  setCountryCode(data) {
    this.form.controls.countryCode.setValue(data.country_code);
    this.countryCodeString = data.country_code;
    this.countryCodeFlag = data.flag_image;
  }

  onAdd(value) {
    if (this.form.invalid) {
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 300000);
      return;
    }
    let payload = {
      name: value.name.trim(),
      addressLineFirst: value.houseNo.trim(),
      customer_address: value.addressLineFirst.trim(),
      phone_number: !this.settings.cutom_country_code ? Number(value.phone_number.number.replace(/[^\d]/g, "")) : value.phone_number,
      country_code: !this.settings.cutom_country_code ? value.phone_number.countryCode.replace(/ +/g, "") : value.countryCode,
      accessToken: this.user.getUserToken,
      latitude: value.latitude || this.util.handler.latitude,
      longitude: value.longitude|| this.util.handler.longitude,
      languageId: this.util.handler.languageId
    }

    if (this.settings.addCollectFieldInAddress == 1) {
      payload['collectNumber'] = value.collectNo.trim();
    }

    if (this.settings.enable_address_reference) {
      payload['reference_address'] = value.reference_address
    }
    if (this.settings.enable_address_pin_code == 1) {
      payload['pincode'] = value.pincode
    }

    this.isLoading = true;
    this.http.postData(ApiUrl.address.addAddress, payload)
      .subscribe(response => {
        if (response && response.status === 200) {
          this.addressList.push(response.data);

          this.message.toast('success', `${this.translate.instant('Address Added Successfully')}!`);

          let completeInfo = Object.assign({}, this.addressModel);
          completeInfo.address = response.data;

          this.selectedAreaIndex = this.addressList.length - 1;
          this.addressDetail.emit(completeInfo);

          this.util.setLocalData('cart_address', response.data, true);

          this.countryCodeString = '';
          this.countryCodeFlag = '';
          this.form.reset();
          this.closeNewAddress.nativeElement.click();
        }
        this.isLoading = false;
      }, (err) => {
        this.isLoading = false;
      });
  }

  changeAddress() {
    this.localAreaIndex = this.selectedAreaIndex;
    this.util.setLocalData('cart_address', this.addressList[this.localAreaIndex], true);
  }
  trackByAddressFn(id, index) {
    return index;
  }
  ngOnDestroy(): void {
    this.closeAddressModal.nativeElement.click();
    this.closeNewAddress.nativeElement.click();
    if (!!this.routeSubscription) this.routeSubscription.unsubscribe();
  }
}
