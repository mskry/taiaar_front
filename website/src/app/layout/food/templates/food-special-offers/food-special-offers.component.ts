import { TranslateService } from '@ngx-translate/core';
import { HttpService } from './../../../../services/http/http.service';
import { UtilityService } from './../../../../services/utility/utility.service';
import { Router } from '@angular/router';
import { CartService } from './../../../../services/cart/cart.service';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from './../../../../services/user/user.service';
import { MessagingService } from './../../../../services/messaging/messaging.service';
import { LocalizationPipe } from './../../../../shared/pipes/localization.pipe';
import { GlobalVariable } from './../../../../core/global';
import { ApiUrl } from './../../../../core/apiUrl';
import { Subscription } from 'rxjs';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { AddOnComponent } from './../../../../layout/shared/product/components/add-on/add-on.component';
import { DescriptionComponent } from './../../../../layout/shared/product/components/description/description.component';
import { CurrencyComponent } from 'src/app/layout/common/header/currency/currency.component';
import { Currency } from 'src/app/shared/models/apiKeys.model';

@Component({
  selector: 'app-food-special-offers',
  templateUrl: './food-special-offers.component.html',
  styleUrls: ['./food-special-offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodSpecialOffersComponent implements OnInit, OnChanges {

  @Input() isLoading: boolean = false;
  @Input() settings: AppSettings;
  @Input() style: StyleVariables;

  @Input('offerData')
  set setOfferData(offerData) {
    if (offerData) {
      this.allOfferData = offerData;
      this.offerData = offerData.offerEnglish;
      if (this.settings.enable_supplier_in_special_offer) {
        this.mergeSpecialOffers();
      }
      else {
        this.specialOffers = this.offerData;
      }
    }
  }

  getDataSubscribe: Subscription;
  cartSubscription: Subscription;
  userSubscription: Subscription;
  themeSubscription: Subscription;
  orderTypeSubscription: Subscription;

  allOfferData: any = [];
  offerData: any = [];
  specialOffers: any = [];

  currency: string = "";
  allOffers: boolean = false;
  hoverIndex: number = -1;
  cart: Array<any> = [];
  loggedIn: boolean = false;
  isDarkTheme: boolean = false;

  productstate: any = {
    is_pointer: true
  }

  timeInterval: number = 0;

  is_mobile: boolean = GlobalVariable.IS_MOBILE;

  slideConfig = {
    "slidesToShow": 2,
    "slidesToScroll": 1,
    "dots": true,
    "arrows": false,
    "infinite": false,
    "autoplay": true,
    "autoplaySpeed": 3000
  };

  public is_user_subscribed: boolean = false;

  public isImageInProcess: boolean = false;
  public out_network_props: boolean = false;
  public is_out_network_show: boolean = false;
  public selected_product: any = {};
  public currentUser: any = {};
  public uniqueSuppliers: any = [];

  public supplierDetail: any = {};
  schedulingData: any = {};
  showScheduleTime: boolean = false;

  selected_order_type: number = 1;

  selected_currency: Currency = new Currency();

  localTblBooking: any = null;

  constructor(
    private translate: TranslateService,
    private http: HttpService,
    public util: UtilityService,
    private router: Router,
    public cartService: CartService,
    public dialogService: DialogService,
    private user: UserService,
    private message: MessagingService,
    private localization: LocalizationPipe
  ) {
    this.currency = GlobalVariable.CURRENCY;

    this.style = new StyleVariables();
    if (this.router.url == "/all-discounted-products") {
      this.allOffers = true;
    }

    this.userSubscription = this.user.currentUser
      .subscribe(user => {
        if (!!user && user['access_token']) {
          this.loggedIn = true;
          this.is_user_subscribed = user.is_subscribed;
          this.currentUser = user;
        } else {
          this.loggedIn = false;
        }
      });
  }

  ngOnInit() {
    this.timeInterval = this.settings.interval;
    this.productstate.hideSupplier = !!this.settings.is_single_vendor;
    this.productstate.is_pointer = false;

    this.cartSubscription = this.util.getCart.subscribe(cart => {
      if (cart) {
        this.cart = cart;
        this.mapData(this.offerData);
        if (this.settings.enable_supplier_in_special_offer) {
          this.mergeSpecialOffers();
        }
        else {
          this.specialOffers = this.offerData;
        }
        this.getUniqueSuppliers();
      }
    });

    this.themeSubscription = this.util.getDarkTheme.subscribe((darkTheme) => {
      this.isDarkTheme = darkTheme;
    });

    if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
      this.slideConfig.slidesToShow = 3
    }

    if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
      this.getOrderType();
    }

    if (this.settings.is_multicurrency_enable) {
      setTimeout(() => {
        this.getCurrency();
      }, 1000);
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.offerData && changes.offerData.currentValue) {
      this.mapData(this.offerData);
      if (this.settings.enable_supplier_in_special_offer) {
        this.mergeSpecialOffers();
      }
      else {
        this.specialOffers = this.offerData;
      }
    }
  }


  getCurrency() {
    this.util.getSelectedCurrency.subscribe((res: any) => {
      if (res) {
        this.selected_currency = res;
        if (this.specialOffers) {
          this.currency = this.selected_currency.currency_name;
        }
      }
    })
  }

  mergeSpecialOffers() {
    var offersSuppliers = Object.assign([], this.allOfferData.offersSuppliers.slice(0, 6));
    var offerEnglish = Object.assign([], this.allOfferData.offerEnglish.slice(0, 6));
    if (this.settings.selected_template == 4) {
      if (this.selected_order_type == 2) {
        this.specialOffers = offersSuppliers;
      }
      else {
        this.specialOffers = offerEnglish;
      }
    }
    else {
      this.specialOffers = [...offersSuppliers, ...offerEnglish];
    }

    // this.specialOffers = this.specialOffers[Math.floor(Math.random() * this.specialOffers.length)];
  }



  productDetail(data: any) {
    if (this.settings.app_type != 1) {
      let obj = {
        productId: data.product_id,
        supplierBranchId: data.supplier_branch_id,
        category: data.category_id
      };
      data.name = data.name.replace(/ &/g, "-");
      obj = { ...this.util.handler, ...obj };
      this.router.navigate(["/", "products", "product-detail", data.name], {
        queryParams: { f: this.util.encryptData(obj) }
      });
    }
  }

  mapData(offerData: Array<any>): Array<any> {
    if (!offerData || !offerData.length) {
      return offerData;
    }

    offerData.map((offer: any) => {
      offer['avg_rating'] = Number.parseFloat(offer['avg_rating']).toFixed(1);
      offer["selectedQuantity"] = 0;
      if (this.cart.length) {
        this.cart.forEach(cartProduct => {
          if (cartProduct.productId == offer.product_id) {
            offer['selectedQuantity'] = cartProduct['selectedQuantity'];
          }
        });
      }
      if (offer['price_type']) {
        offer['maxHour'] = offer['hourly_price'][offer['hourly_price'].length - 1]['max_hour'] - this.timeInterval;
        if (offer['discount'] && offer['hourly_price'][0]['discount_price']) {
          offer['fixed_price'] = offer['hourly_price'][0]['discount_price'];
          offer['display_price'] = offer['hourly_price'][0]['price_per_hour'];
          offer['discount_price'] = Math.round(((offer['hourly_price'][0]['price_per_hour'] - offer['hourly_price'][0]['discount_price']) / offer['hourly_price'][0]['price_per_hour']) * 100);
          offer["discountPercentage"] = parseFloat((((offer.display_price - offer.fixed_price) / offer.display_price) * 100).toFixed(2));
        } else {
          offer['fixed_price'] = offer['hourly_price'][0]['price_per_hour'];
        }
      } else {
        this.util.productPriceToFloat(offer);
        offer["discountPercentage"] = parseFloat((((offer.display_price - offer.fixed_price) / offer.display_price) * 100).toFixed(2));
        offer["discount"] = Math.round(offer.discountPercentage);
      }
    });
    return offerData;
  }

  /********* Open Add On Dialog *********/

  openAddOnDialog(product) {
    let item = this.cart.find(p => p.productId == product.product_id);
    if (item) {
      product.customization = item.customization;
    }

    const dialogRef = this.dialogService.open(AddOnComponent, {
      header: product['name'],
      width: '50%',
      showHeader: false,
      // contentStyle: { "max-height": "350px", "overflow": "auto" },
      transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',

      data: {
        product: Object.assign({}, product),
        addOnItems: product['adds_on']
      }
    })

    dialogRef.onClose.subscribe(() => {
      if (product.customization && product.customization.length) {
        delete product.customization;
      }
    })
  }

  addProduct(product) {

    if (product.adds_on && product.adds_on.length) {
      this.openAddOnDialog(product);
    } else {
      this.cartService.addToCart(product, this.specialOffers.slice(0, 24));
      return;
    }

  }

  removeProduct(product) {
    let item = this.cart.find(p => p.productId == product.product_id);
    if (item['customization'] && item['customization'].length) {
      this.openAddOnDialog(product);
    } else {
      this.cartService.removeFromCart(product)
    }
  }

  wishlist(status, detail) {
    if (!this.loggedIn) {
      this.message.alert('warning', this.translate.instant('Please Login First'));
      return;
    }
    let param_data = {
      status: +status,
      product_id: detail.product_id
    }
    this.http.postData(ApiUrl.addToWishlist, param_data, true)
      .subscribe(response => {
        if (!!response && response.data) {
          this.message.toast('success', `${this.localization.transform('products')} ${this.translate.instant('Has Been Successfully')} ${status ? this.translate.instant('Added To') : this.translate.instant('Removed From')} ${this.localization.transform('wishlist')}`);
          detail.is_favourite = status;
        }
      });
  }

  onSeeMore() {
    this.router.navigate(['/', 'products', 'all-discounted-products'], {
      queryParams: { type: 1 }
    });
  }

  decreaseValue(product) {
    if (product.selectedQuantity <= 0) {
      return;
    }
    this.removeProduct(product);
    if (this.settings.enable_in_out_network) {
      if (product.is_out_network) {
        this.out_network_props = false;
      }
    }
  }

  increaseValue(product) {
    this.selected_product = product;
    if (this.settings.enable_in_out_network) {
      if (this.selected_product.is_out_network) {
        if (!this.out_network_props) {
          this.is_out_network_show = true;
          return;
        }
        if (this.selected_product.selectedQuantity >= 1) {
          this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
          return
        }
      }
      if (this.uniqueSuppliers.length >= 4 && !this.uniqueSuppliers.includes(this.selected_product.supplier_id)) {
        this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
        return
      }
    }
    if (this.settings.is_enable_subscription_required) {
      if (!this.loggedIn) {
        this.util.authToggle.next(true);
        return;
      }
      if (!this.is_user_subscribed && this.selected_product.is_subscription_required) {
        this.message.alert("info", "You must subscribe to buy this product!");
        return;
      }
    }
    if (this.settings.enable_item_purchase_limit) {
      if ((Number)(this.selected_product.purchase_limit) > 0) {
        if (this.selected_product.selectedQuantity >= (Number)(this.selected_product.purchase_limit)) {
          this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
          return;
        }
      }
    }
    if (this.selected_product.selectedQuantity >= (Number(this.selected_product.quantity) - Number(this.selected_product.purchased_quantity))) {
      this.message.alert('info', 'Maximum Limit Reached');
      return;
    }

    if (this.util.handler.selfPickup !== this.selected_product['self_pickup'] && this.selected_product['self_pickup'] !== 2 && this.settings.app_type == 1) {
      this.message.alert('info', `This Product is not available for  ${this.util.handler.selfPickup ? 'self pickup' : 'delivery'}`);
      return;
    }

    this.addProduct(this.selected_product);
  }

  porductDescription(product) {
    if (!product.product_id) {
      this.router.navigate(["/", "products", "listing"], {
        queryParams: {
          supplierId: product.id,
        }
      });
    }
    else {
      const dialogRef = this.dialogService.open(DescriptionComponent, {
        dismissableMask: true,
        width: this.is_mobile ? '85%' : '40%',
        showHeader: false,
        transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
        data: {
          description: product.product_desc,
        }
      })

      dialogRef.onClose.subscribe(() => {
      })
    }
  }

  handleImageProcess(event) {
    this.isImageInProcess = event;
  }

  onProcessOutNetEvent(event) {
    if (event) {
      if (this.isImageInProcess) {
        return;
      }
      this.selected_product.product_dimensions = event.product_dimensions;
      this.selected_product.product_owner_name = event.product_owner_name;
      this.selected_product.product_upload_reciept = event.product_upload_reciept;
      this.selected_product.product_reference_id = event.product_reference_id;
      this.out_network_props = true;
      this.increaseValue(this.selected_product);
    }
    this.is_out_network_show = false;
  }


  getUniqueSuppliers() {
    this.uniqueSuppliers = Object.assign([], this.cart).reduce((unique, item) =>
      unique.includes(item.supplier_id) ? unique : [...unique, item.supplier_id], []
    )
  }





  getOrderType() {
    this.orderTypeSubscription = this.util.getOrderTypeData.subscribe((res: any) => {
      if (res) {
        this.selected_order_type = (Number)(res);
        if (this.settings.enable_supplier_in_special_offer) {
          this.mergeSpecialOffers();
        }
      }
    })
  }


  productList(supplier, flag?: any) {
    let queryParams = {
      supplierId: supplier.supplier_id || supplier.id
    }
    if (this.settings.branch_flow == 1 && supplier.is_multi_branch == 1) {
      queryParams['is_branches'] = 1;
    }

    if (flag == 1) {
      queryParams['action'] = 'tb_item';
    }
    if (this.settings.app_type == 1) {
      this.router.navigate(['/', 'products', 'listing'], {
        queryParams: queryParams
      });
    }
  }



  openSchedulingModal(supplier) {
    if (!this.loggedIn) {
      this.util.authToggle.next(true);
      return false;
    }
    this.supplierDetail = supplier;
    this.schedulingData = {
      supplier_id: supplier.id || supplier.supplier_id,
      branch_id: supplier.supplier_branch_id,
      date_order_type: 3,
      latitude: 0,
      longitude: 0,
      by_pass_tables_selection: this.settings.by_pass_tables_selection
    }
    this.showScheduleTime = true;
  }

  onSchedulingProcess(eventData: any) {
    this.createTableBooking(eventData);


    //   if (localStorage.getItem('table_booking_details')) {
    //     console.log('enter');
    //     this.localTblBooking = JSON.parse(localStorage.getItem('table_booking_details'));
    //     console.log('localTblBooking', this.localTblBooking, typeof this.localTblBooking);

    // }
  }

  createTableBooking(data) {
    if (data) {
      var table_booking_param = {
        user_id: this.currentUser.id,
        // table_id: data.table_id,
        slot_id: data.slot_id,
        schedule_date: data.startTime,
        schedule_end_date: data.endTime,
        supplier_id: this.supplierDetail.id,
        branch_id: this.supplierDetail.supplier_branch_id
      }


      if (this.settings.table_book_mac_theme == 1) {
        table_booking_param['amount'] = data.table_booking_price;
        table_booking_param['seating_capacity'] = data.table_seating;
        table_booking_param['table_id'] = '0';
        if (data.table_booking_price) {
          table_booking_param = { ...table_booking_param, ...data['payment_details'] };
        }
      } else {
        table_booking_param['table_id'] = data.table_id;
      }

      this.http.postData(ApiUrl.makeTableBookingRequest, table_booking_param).subscribe((res: any) => {
        if (res.status == 200) {
          this.message.alert("success", "Your Table Booking request has been placed successfully!");
          this.router.navigateByUrl('/account/table-bookings');
        }
      })
    } else {
      console.log(this.schedulingData);

      this.productList(this.schedulingData, 1)
    }
  }
  trackBySpecialOffersFn(id, index) {
    return index;
  };
  trackByutilFakeFn(id, index) {
    return index;
  };
  trackBySpOffersFn(id, index) {
    return index;
  };
  trackByGenerateFakeFn(id, index) {
    return index;
  };
  trackByOffersFn(id, index) {
    return index;
  };
  trackByFakeListFn(id, index) {
    return index;
  };

  ngOnDestroy() {
    if (!!this.userSubscription) this.userSubscription.unsubscribe();
    if (!!this.getDataSubscribe) this.getDataSubscribe.unsubscribe();
    if (!!this.themeSubscription) this.themeSubscription.unsubscribe();
    if (!!this.orderTypeSubscription) this.orderTypeSubscription.unsubscribe();

    let componentInstance = this.dialogService.dialogComponentRef;
    if (componentInstance) {
      componentInstance.destroy()
    }
  }
}
