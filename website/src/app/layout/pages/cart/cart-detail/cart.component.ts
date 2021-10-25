import { SeoService } from './../../../../services/seo/seo.service';
import { DeliveryAddressDetailComponent } from '../components/delivery-address-detail/delivery-address-detail.component';
import { ImageUpload } from './../../../../shared/models/imageUpload.model';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { ApiUrl } from './../../../../core/apiUrl';
import { CartModel, UpdateCartModel, CartProductModel } from './../../../../shared/models/cart.model';
import { MessagingService } from './../../../../services/messaging/messaging.service';
import { UserService } from './../../../../services/user/user.service';
import { UtilityService } from './../../../../services/utility/utility.service';
import { HttpService } from './../../../../services/http/http.service';
import { StyleConstants } from './../../../../core/theme/styleConstants.model';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { CartService } from './../../../../services/cart/cart.service';
import { CartPriceModel } from '../../../../shared/models/cart-price.model';
import _ from 'lodash';
import { GlobalVariable } from './../../../../core/global';
import { DialogService } from 'primeng/dynamicdialog';
import { LocalizationPipe } from '../../../../shared/pipes/localization.pipe';
import { CartPriceDetailComponent } from '../components/cart-price-detail/cart-price-detail.component';
import { QuestionsModel } from './../../../../shared/models/questions.model';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseAnalyticsService } from '../../../../services/firebase-analytics/firebase-analytics.service';
import { SegmentAnalyticsService } from '../../../../services/firebase-analytics/segment-analytics.service';
import { Currency } from './../../../../shared/models/apiKeys.model';
import { DateService } from 'src/app/services/date/date.service';

// declare const $;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [DatePipe],

})
export class CartComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(CartPriceDetailComponent, { static: false }) cartPriceClass: any;
  @ViewChild(DeliveryAddressDetailComponent, { static: false }) deliveryAddress: DeliveryAddressDetailComponent;

  @Input() inSupplierPage: number = 0
  styleSubscription: Subscription;
  settingSubscription: Subscription;
  cartSubscription: Subscription;
  userSubscription: Subscription;
  routeSubscription: Subscription;
  themeSubscription: Subscription;
  orderTypeSubscription: Subscription;


  style: StyleVariables;
  saveBtn: StyleConstants;
  settings: AppSettings;

  cart: Array<any> = [];
  full_cart: any[] = [];

  currentUser: any = {}

  priceObj: CartPriceModel = new CartPriceModel();
  addressDetail: any = {};
  cartModel: any = {};
  updateCartModel: any = {};
  cartDateTimeData: any = { is_open: false, data: {} };

  paymentOrderModel: any = {};

  walletAmount: number = 0;
  totalItems: number = 0;
  deliveryType: number = 0;
  urgentPrice: number = 0;
  self_pickup = 0;
  book_dining = 0;
  delivery_opt = 1;
  showDeliveryOption: boolean = false;

  showScheduleTime: boolean = false;
  scheduleOrderSlot: any = null;
  schedulingData: any = {};

  currency: string = '';
  orderId: any = '';
  paymentType: string = '0';
  product_id: string = '';

  public min: Date = new Date();
  scheduleMaxDate: Date;
  selectedScheduleDate: Date[];
  pickUp_dateTime: any;

  is_agent: boolean = false;
  loggedIn: boolean = false;
  is_service: boolean = false;

  delivery_charge: number = 0;
  isDarkTheme: boolean = false;

  isPayOnline: boolean = false;

  isLoading: boolean = false;
  isCartCheck: boolean = false;

  agent_tips: Array<number> = [];
  questions: Array<QuestionsModel> = [];

  transaction: any = {};

  prescription_images: ImageUpload;

  instructions: string = '';
  parking_instruction: string = '';
  area_to_focus: string = '';

  show_prescription: boolean = false;
  show_instructions: boolean = false;
  displayAddModal = new BehaviorSubject(false);

  payment_after_confirmation: number = 0;

  geofencedGateways: Array<string> = [];

  region_delivery_charge: number = 0;

  hidePaymentModeSelection: boolean = false;

  isBookNow: boolean = false;

  distance_value: number = 0;
  applyWalletDiscount: boolean = false;

  activePlan: any;
  place_order_directly = 0;
  serviceDateTime: any = '';

  is_supplier_scheduling: boolean = false;
  stripe_transaction_id: string = ''
  supplier_timing: any = {};

  public is_after_table_booking: boolean;
  public table_booking_details: any;
  public manualTableNo: number;
  public manualTable_id: number;

  public have_coin_change: string = "0";

  public min_distance_price_list: any = [];
  public calc_distance: number = 0;

  public is_order_try: boolean;
  public is_order_try_online: boolean;
  public is_declaration_checked: boolean;

  public total_product_weight: number = 0;
  public product_weight_list: any = [];

  public normal_delivery: number;
  public express_delivery: number;
  public selected_delivery_type: number;
  public supplier_delivery_type_normal: any;
  public supplier_delivery_type_express: any;
  public supplier_delivery_time_duration: any = { time: 0, time_unit: '' };
  public is_own_delivery: number = 0;

  public order_type_wise_gateways: any = [];
  public hidePaymentModeOption: boolean = false;

  public vehicle_number: number;

  public is_cutlery_required: boolean = false;
  public no_touch_delivery: boolean = false;

  public is_out_network: boolean = false;

  public rest_user_service_charges: any = [];
  public checkedProdList: any = [];

  public delivery_charges_array: any = [];

  public loyalty_points: number = 0;

  public selected_currency: Currency = new Currency();
  web_user: any;
  id_for_invoice: any;

  appointmentOrderInCart = 0;

  public selected_order_type: number = 0;


  constructor(
    private http: HttpService,
    private util: UtilityService,
    public user: UserService,
    private cartService: CartService,
    private message: MessagingService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogService: DialogService,
    private localization: LocalizationPipe,
    private translate: TranslateService,
    private userService: UserService,
    private seo: SeoService,
    private firebaseAnalyticsSvc: FirebaseAnalyticsService,
    private segmentAnalyticsSvc: SegmentAnalyticsService,
    private dateService: DateService
  ) {
    this.style = new StyleVariables();
    this.saveBtn = new StyleConstants();
    this.cartModel = new CartModel();
    this.currency = GlobalVariable.CURRENCY;
  }

  ngOnInit() {
    this.web_user = this.util.getLocalData('web_user', true);

    this.seo.updateTitle(`Cart | ${GlobalVariable.SITE_NAME}`);

    this.styleSubscription = this.util.getStyles
      .subscribe(style => {
        this.style = style;
        this.saveBtn.backgroundColor = style.primaryColor;
        this.saveBtn.borderColor = style.primaryColor;
        this.saveBtn.color = '#ffffff';
      });

    this.themeSubscription = this.util.getDarkTheme.subscribe((darkTheme) => {
      this.isDarkTheme = darkTheme;
    });

    this.settingSubscription = this.util.getSettings
      .subscribe((settings: AppSettings) => {
        if (settings) {
          this.settings = settings;
          if (settings.app_type == 7) {
            this.self_pickup = 1;
          } else if (settings.app_type == 8) {    // || (settings.is_pickup_order == 2 && settings.is_table_booking == '0')
            this.self_pickup = 0;
            this.showDeliveryOption = false;
          }

          if (settings.enable_id_for_invoice_in_profile) {
            this.id_for_invoice = this.web_user.id_for_invoice;
          }

          const selfPickup: any = this.cartService.getOrderPickType();
          if (selfPickup == 2) {
            if (this.util.handler.selfPickup == 1) {
              this.self_pickup = 1;
            } else {
              this.self_pickup = 0;
              this.showDeliveryOption = true;
            }
          } else {
            this.showDeliveryOption = true;
            this.self_pickup = selfPickup || 0;
          }
          switch (selfPickup) {
            case "0":
              this.onDelivery();
              break;
            case "1":
              this.onSelfPickup();
              break;
            case "3":
              this.onDining();
              break;
          }
          if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
            this.getOrderType();
          }
        }
      });

    if (JSON.parse(localStorage.getItem('table_booking_details'))) {
      this.table_booking_details = JSON.parse(localStorage.getItem('table_booking_details'));
      this.table_booking_details.table_booking_actual_price = this.table_booking_details.table_booking_price
      this.is_after_table_booking = true;
      this.onDining();
    }

    this.userSubscription = this.user.currentUser
      .subscribe(user => {
        if (!!user && user['access_token']) {
          this.paymentOrderModel.user = user;
          this.loggedIn = true;
          this.currentUser = user;
        } else {
          this.loggedIn = false;
        }
      });

    this.cartInit();

    if (this.settings.is_multicurrency_enable) {
      this.getCurrency();
    }

  }

  ngAfterViewInit() {
    this.getLocalData();
  }

  cartInit() {
    this.routeSubscription = this.route.queryParams
      .subscribe(params => {
        if (params['place_order'] == 1) {
          this.isLoading = true;
          this.place_order_directly = parseInt(params['place_order']);
        }

        this.cartSubscription = this.util.getCart
          .subscribe(cart => {
            if (cart) {

              this.calculateProductWeight(cart);

              if (params && params['p_id']) {
                this.product_id = params['p_id'];
                let product = (cart.slice()).find(product => {
                  return params['p_id'] == product['productId'];
                });
                if (!!product) {
                  this.cart = [product];
                  this.totalItems = product['selectedQuantity'];
                }
              } else {
                this.cart = cart;
                console.log(this.cart);

                this.totalItems = this.util.getTotalCountCart();
              }


              this.is_agent = false;
              this.is_service = false;
              this.show_prescription = false;
              this.show_instructions = false;
              this.cart.forEach((product, i, arr) => {
                if (product['is_agent'] == 1) this.is_agent = true;
                if (product['is_product'] == 0) this.is_service = true;
                if (product['cart_image_upload'] == 1) this.show_prescription = true;
                if (product['order_instructions'] == 1) this.show_instructions = true;

                if (((arr.length > 1 && i > 0 && product.self_pickup == arr[i - 1].self_pickup) || (this.cart.length == 1)) && product.self_pickup != 2 && this.showDeliveryOption && this.settings.app_type == 1 && this.settings.is_table_booking == 0) {
                  this.showDeliveryOption = false;
                }
              });

              if (this.cart.length && this.settings.order_request == 1) {
                this.payment_after_confirmation = this.cart[0].payment_after_confirmation;
              }

              if (this.cart.length && (this.settings.enable_product_appointment && this.cart[0].is_appointment)) {
                this.onSelfPickup();
              }
            }
          });


        if (this.cart.length) {
          this.checkCartUpdate();
        }

        if(params['source'] && params['client_secret']) {
          this.stripe_transaction_id = params['source']
          this.transaction['paymentGatewayId'] = 'stripe'
          this.transaction['token'] = this.stripe_transaction_id;
          (async () => {
            await this.delay(2000);
            this.placeOrder();
          })();
        }

      });
  }

  checkCartUpdate() {
    const product_ids = this.cart.map((product) => product['productId'] || product['product_id']);

    const payload = {
      product_ids: product_ids,
      latitude: this.util.handler.latitude,
      longitude: this.util.handler.longitude
    }

    let cart_address = this.util.getLocalData('cart_address', true);
    if (cart_address) {
      payload.latitude = cart_address.latitude
      payload.longitude = cart_address.longitude
    } else if (this.addressDetail && this.addressDetail.address) {
      payload.latitude = this.addressDetail.address.latitude
      payload.longitude = this.addressDetail.address.longitude
    }

    this.http.postData(ApiUrl.checkProductList, payload)
      .subscribe(response => {
        this.isCartCheck = true;
        if (!!response && response.data) {

          if (this.settings.enable_supplier_config_closing_day == 1) {
            this.supplier_timing = response.data.supplier_timing;
          }

          if(GlobalVariable.UNIQUE_ID == 'homent_0753' && this.settings.skip_payment_option == 1) {
            this.setPaymentType('5');
          }
          if (response.data.min_order_distance_wise) {
            this.min_distance_price_list = response.data.min_order_distance_wise;
          }
          if (response.data.supplier_weight_wise_delivery_charge) {
            this.product_weight_list = response.data.supplier_weight_wise_delivery_charge;
          }

          if(this.settings.is_customized_commision_enable == 1) {
            this.priceObj.minimum_commission_amount = response.data.customized_commission_data.minimum_amount;
            this.priceObj.minimum_cart_fee = response.data.customized_commission_data.minimum_cart_fee;
          }

          if(this.settings.enable_base_delivery_charge_on_vehicle_cat == 1) {
            this.priceObj.expectedDeliveryCharges = response.data.estimated_delivery_charge
          }

          this.is_own_delivery = response.data.is_own_delivery || 0;
          if (this.settings.is_enable_delivery_type && response.data.supplier_delivery_types.length && !this.is_own_delivery) {
            response.data.supplier_delivery_types.forEach(element => {
              switch (element.type) {
                case 0:
                  this.supplier_delivery_type_normal = element;
                  break;
                case 1:
                  this.supplier_delivery_type_express = element;
                  break;
              }
            });
            if (this.supplier_delivery_type_normal || this.supplier_delivery_type_express) {
              this.onSelectDeliveryType(this.supplier_delivery_type_normal ? 0 : 1);
            }
          }
          if (this.settings.dynamic_order_type_client_wise) {
            if (!this.selected_order_type) {
              if (this.settings.is_table_booking && this.settings.dynamic_order_type_client_wise_dinein) {
                this.onDining();
              }
              if ((this.settings.dynamic_order_type_client_wise_pickup || (this.settings.enable_product_appointment && response.data.result[0].is_appointment)) && !Object.keys(this.table_booking_details || {}).length) {
                this.onSelfPickup();
              }
              if (this.settings.dynamic_order_type_client_wise_delivery && !Object.keys(this.table_booking_details || {}).length) {
                this.onDelivery();
              }
            }
            // if (!this.settings.dynamic_order_type_client_wise_delivery) {
            //   this.hidePaymentModeOption = true;
            //   this.paymentType = '1';
            // }
          }
          if (response.data.userSubscriptionData) {
            this.activePlan = response.data.userSubscriptionData;
          }

          if (this.settings.is_loyality_enable == 1) {
            this.priceObj.productLoyaltyDiscountAmount = response.data.loyalityLevelDiscountAmount;
            this.priceObj.totalLoyaltyAmount = response.data.loyalitPointDiscountAmount;
            if (this.settings.enable_referral_bal_limit) {
              if (response.data.loyalitPointDiscountAmount > this.settings.referral_bal_limit_per_order) {
                this.priceObj.totalLoyaltyAmount = this.settings.referral_bal_limit_per_order;
              }
            }
          }
          if (this.settings.enable_min_loyality_points) {
            this.loyalty_points = response.data.loyalty_points;
          }
          if (response.data.payment_gateways.length) {
            this.geofencedGateways = response.data.payment_gateways;
            let cod_index = this.geofencedGateways.findIndex(el => el === 'cod');
            if (cod_index > -1) {
              this.geofencedGateways.splice(cod_index, 1);
              if (!this.geofencedGateways.length) {
                // this.hidePaymentModeSelection = true;
                this.setPaymentType('0');
              }
            } else {
              this.setPaymentType('1');
              // this.hidePaymentModeSelection = true;
            }
          }
          if (this.settings && this.settings.is_enable_orderwise_gateways && response.data.order_type_wise_gateways.length) {
            this.order_type_wise_gateways = response.data.order_type_wise_gateways;
            this.setOrderwiseGateways();
          }

          this.region_delivery_charge = response.data.region_delivery_charge ? response.data.region_delivery_charge : 0;

          this.agent_tips = response.data.tips || [];

          let products = response.data.result;
          this.checkedProdList = products;
          if (!products || !products.length) { return; };

          this.distance_value = products[0].distance_value;

          this.is_supplier_scheduling = products.some(product => {
            return product['is_scheduled'] == 1;
          });

          if (this.settings.is_currency_exchange_rate == 1) {
            this.priceObj.currency_exchange_rate = (products[0]).currency_exchange_rate;
            this.priceObj.local_currency = (products[0]).local_currency;
          }

          this.is_out_network = this.cart.some(item => {
            return item['is_out_network'] == 1;
          })

          this.calculateSupplierUserSvcCharges(products);

          if (this.settings.table_book_mac_theme == 1 && this.table_booking_details) {
            this.table_booking_details.table_booking_discount = products[0].table_booking_discount;
            this.table_booking_details.table_booking_actual_price = this.table_booking_details.table_booking_price;
            let table_discount_price = (this.priceObj.amount * this.table_booking_details.table_booking_discount) / 100;
            if (table_discount_price > this.table_booking_details.table_booking_price) {
              this.table_booking_details.table_booking_price = table_discount_price;
            }
          }

          this.cart.forEach(cart_item => {
            products.forEach(element => {
              if (cart_item['productId'] == element['product_id']) {
                if (element.quantity > 0 && element.purchased_quantity < element.quantity) {
                  cart_item['price_type'] = element['price_type'];
                  cart_item['quantity'] = element['quantity'];
                  cart_item['purchased_quantity'] = element['purchased_quantity'];
                  if (element['quantity'] < cart_item['selectedQuantity']) {
                    cart_item['selectedQuantity'] = 1;
                  }
                  if (this.settings.is_loyality_enable == 1) {
                    cart_item['perProductLoyalityDiscount'] = element['perProductLoyalityDiscount'];
                  }
                  if (this.settings.tax_on_delivery_charges == 1) {
                    cart_item['delivery_charge_tax_type'] = element['delivery_charge_tax_type'];
                    cart_item['delivery_charge_tax'] = element['delivery_charge_tax'];
                  }
                  cart_item['latitude'] = element['latitude'];
                  cart_item['longitude'] = element['longitude'];
                  cart_item['handling_supplier'] = element['handling_supplier'];
                  cart_item['handling_admin'] = element['handling_admin'];
                  cart_item['delivery_charges'] = element['delivery_charges'];
                  cart_item['radius_price'] = element['radius_price'];
                  cart_item['is_product'] = element['is_product'];
                  cart_item['distance_value'] = element['distance_value'];
                  cart_item['base_delivery_charges'] = element['base_delivery_charges'];
                  cart_item['base_delivery_charges_array'] = element['base_delivery_charges_array'];
                  cart_item['user_service_charge'] = element['user_service_charge'];
                  cart_item['is_vat_applicable'] = element['is_vat_applicable'];
                  if(this.settings.enable_base_delivery_charge_on_vehicle_cat == 1) {
                    cart_item['estimated_delivery_charge'] = response.data.estimated_delivery_charge
                  }

                  if (cart_item['discount'] == element['discount']) {
                    cart_item['isOutOfStock'] = false;

                    if (cart_item['price_type']) {
                      cart_item['hourly_price'] = element['hourly_price'];
                      this.cartService.calculateProductHourlyPrice(cart_item);
                    } else {
                      cart_item['fixed_price'] = parseFloat(element['fixed_price']);
                      if (this.settings.loyality_discount_on_product_listing == 1) {
                        if (!!element['perProductLoyalityDiscount']) {
                          cart_item.fixed_price = cart_item.fixed_price - (element['perProductLoyalityDiscount'] || 0);
                        }
                      }
                      cart_item['display_price'] = parseFloat(element['display_price']);
                    }
                    if (cart_item['customization'] && cart_item['customization'].length) {
                      let addons = this.makeAddOnModel(cart_item['customization']);
                      element.adds_on.forEach(addon => {
                        (addon.value).forEach(type => {
                          addons.forEach(cart_type => {
                            if (cart_type['type_id'] == type['type_id']) {
                              cart_type['price'] = type['price'];
                              cart_type['type_name'] = type['type_name'];
                            }
                          })
                        });
                      });
                    }
                  }
                  cart_item['isOutOfStock'] = false;
                } else {
                  cart_item['isOutOfStock'] = true;
                  // this.cart.splice(this.cart.indexOf(cart_item), 1);
                }
                this.util.setCart(this.cart);
              }
            });
          });

        }
      });
  }

  calculateSupplierUserSvcCharges(products) {
    if (this.settings.enable_flat_user_service_charge) {
      this.rest_user_service_charges = [];
      var dumyList = Object.assign([], products);
      var uniques = [];
      dumyList.forEach(function (item) {
        var i = uniques.findIndex(x => x.supplier_id == item.supplier_id);
        if (i <= -1) {
          uniques.push(item);
        }
      });
      this.rest_user_service_charges = uniques;
    } else if (this.settings.vendor_status == 1) {
      this.rest_user_service_charges = this.cart;
    }
  }

  calculateProductWeight(cartItems) {
    this.total_product_weight = 0;
    cartItems.forEach(element => {
      this.total_product_weight += element.duration * element.selectedQuantity;
    });
  }

  getLocalData() {
    if (this.util.getLocalData('ques_data', true)) {
      this.questions = this.util.getLocalData('ques_data', true);
    }
    this.pickUp_dateTime = this.util.getLocalData('pickUp_DT', true);
  }

  setPrice(priceDetail: CartPriceModel) {
    // setTimeout(() => { this.priceObj = priceDetail; }, 100);
    this.priceObj = priceDetail;

    if (this.settings.table_book_mac_theme == 1 && this.table_booking_details) {
      let table_discount_price = (this.priceObj.amount * this.table_booking_details.table_booking_discount) / 100;
      if (table_discount_price > this.table_booking_details.table_booking_actual_price) {
        this.table_booking_details.table_booking_price = table_discount_price;
      } else {
        this.table_booking_details.table_booking_price = this.table_booking_details.table_booking_actual_price;
      }
    }
  }

  setAddress(addressObj: any) {
    if (addressObj) {
      this.addressDetail = addressObj;
      this.walletAmount = this.addressDetail['wallet_amount'];
      if (addressObj.region_delivery_charge) {
        this.region_delivery_charge = addressObj.region_delivery_charge;
      }
      if (this.cart.length && addressObj.address && addressObj.address.latitude && addressObj.address.longitude && (this.settings.app_type == 1 || (this.settings.app_type == 2 && this.settings.ecom_agent_module == 1)) && this.self_pickup != 1) {
        if (this.settings.delivery_charge_type == 1) {
          if (this.cart.length >= 1) {
            this.delivery_charge = 0;
            let products = [...new Map(this.cart.map(item =>
              [item['supplier_branch_id'], item])).values()];
            products.forEach(el => {
              this.delivery_charge += el.radius_price;
            });
            this.addressDetail.address['delivery_charge'] = this.delivery_charge;
          } else {
            this.delivery_charge = this.cart[0].radius_price;
            this.addressDetail.address['delivery_charge'] = this.delivery_charge;
          }
        } else {
          if (this.settings.enable_multi_supplier_delivery_charge_distance_wise == 1) {
            let supplier_data = [...new Map(this.cart.map(item => [item['supplier_id'], item])).values()].map(product => {
              return {
                supplierId: product.supplier_id,
                source_latitude: product.latitude,
                source_longitude: product.longitude,
                dest_latitude: addressObj.address.latitude,
                dest_longitude: addressObj.address.longitude
              }
            });
            if (this.region_delivery_charge) {
              if (this.settings.is_enabled_multiple_base_delivery_charges == 1) {
                this.delivery_charge = this.region_delivery_charge;
              } else {
                this.delivery_charge = this.region_delivery_charge + this.addressDetail['base_delivery_charges'];
              }
              this.addressDetail.address['delivery_charge'] = this.delivery_charge;
              if (this.settings.enable_min_order_distance_wise == '1') {
                this.getGoogleMatrixLocationSupplierWise(supplier_data);
              }
            } else {
              this.getGoogleMatrixLocationSupplierWise(supplier_data);
            }
          } else {
            let origin = {
              lat: this.cart[0].latitude,
              lng: this.cart[0].longitude
            }
            let destination = {
              lat: addressObj.address.latitude,
              lng: addressObj.address.longitude,
            }

            if (this.region_delivery_charge) {
              if (this.settings.is_enabled_multiple_base_delivery_charges == 1) {
                this.delivery_charge = this.region_delivery_charge;
              } else {
                this.delivery_charge = this.region_delivery_charge + this.addressDetail['base_delivery_charges'];
              }
              this.addressDetail.address['delivery_charge'] = this.delivery_charge;
              if (this.settings.enable_min_order_distance_wise == '1') {
                this.getGoogleMatrixLocation(origin, destination);
              }
            } else {
              this.getGoogleMatrixLocation(origin, destination);
            }
          }

        }
        this.paymentOrderModel.address = this.addressDetail.address;
      }

      if (this.place_order_directly == 1) {
        (async () => {
          await this.delay(2000);
          this.placeOrder();
        })();
      }
    }
  }

  getGoogleMatrixLocation(origin, destination) {
    let params = {
      source_latitude: origin.lat,
      source_longitude: origin.lng,
      dest_latitude: destination.lat,
      dest_longitude: destination.lng
    }
    this.http.getData(ApiUrl.getGoogleDistance, params)
      .subscribe(response => {
        let distanceObj = response.data;
        this.calc_distance = distanceObj.distance;
        if (!this.region_delivery_charge) {
          if (distanceObj && distanceObj.distance) {
            let distance = distanceObj.distance;
            const calc_duration = distanceObj.duration || 0;
            if (calc_duration) {
              const split_duration = calc_duration.split(' ');
              this.supplier_delivery_time_duration['time'] = split_duration[0] ? (Number)(split_duration[0]) : 0;
              this.supplier_delivery_time_duration['time_unit'] = split_duration[1] ? split_duration[1] : '';
            }
            if (!this.settings.is_enable_delivery_type || this.is_own_delivery) {
              if (this.settings.is_enabled_multiple_base_delivery_charges == 1 && this.addressDetail['base_delivery_charges_array'] && this.addressDetail['base_delivery_charges_array'].length) {
                let base_charges = this.addressDetail['base_delivery_charges_array'].filter(el => distance < el.distance_value);
                let max_base = null;
                if (base_charges.length) {
                  max_base = base_charges.reduce(function (prev, current) {
                    return (prev.distance_value < current.distance_value) ? prev : current
                  });
                  if (!!max_base) {
                    this.delivery_charge = max_base.base_delivery_charges;
                  } else {
                    this.delivery_charge = 0;
                  }
                } else {
                  let maxBase = this.addressDetail['base_delivery_charges_array'].reduce(function (prev, current) {
                    return (prev.distance_value > current.distance_value) ? prev : current
                  });
                  this.delivery_charge = ((distance - maxBase.distance_value) * this.cart[0].radius_price) + maxBase.base_delivery_charges;
                }
              } else {
                if (distance > this.distance_value) {
                  this.delivery_charge = ((distance - this.distance_value) * this.cart[0].radius_price) + this.addressDetail['base_delivery_charges'];
                  if(this.settings.is_customized_commision_enable == 1) {
                    if(this.priceObj.amount > this.priceObj.minimum_commission_amount) {
                      this.delivery_charge = ((distance - this.distance_value) * this.cart[0].radius_price) + 0;
                    }
                  }
                } else {
                  this.delivery_charge = this.addressDetail['base_delivery_charges'];
                  if(this.settings.is_customized_commision_enable == 1) {
                    if(this.priceObj.amount > this.priceObj.minimum_commission_amount) {
                      this.delivery_charge = 0;
                    }
                  }
                }
              }
            }
            else {
              if (!this.is_own_delivery && (this.supplier_delivery_type_normal || this.supplier_delivery_type_express)) {
                this.calcDeliveryChargesWithDelTypes(this.supplier_delivery_type_normal ? 0 : 1);
              }
            }
          } else {
            this.delivery_charge = 0;
            if (!this.settings.is_enabled_multiple_base_delivery_charges) {
              this.delivery_charge = this.addressDetail['base_delivery_charges'] || 0;
            }
          }
          this.addressDetail.address['delivery_charge'] = this.delivery_charge;
        }
      });
  }

  getGoogleMatrixLocationSupplierWise(supplier_data) {
    this.http.postData(ApiUrl.getGoogleDistanceV1, { supplierUserLatLongs: supplier_data })
      .subscribe(response => {
        if (!!response && response.data) {
          let supplier_distance = response.data;
          this.delivery_charge = 0;
          this.calc_distance = 0;
          if (!this.region_delivery_charge && supplier_distance.length) {
            let calc_duration = 0;
            if (!this.settings.is_enable_delivery_type || this.is_own_delivery) {
              supplier_distance.forEach(sp => {
                this.calc_distance += sp.distance;
                if (sp.duration) {
                  calc_duration += sp.duration;
                }
                var delivery_charges_obj = {};
                delivery_charges_obj['supplier_id'] = sp.supplierId;
                let product = this.cart.find(el => el.supplier_id == sp.supplierId);
                if (this.settings.is_enabled_multiple_base_delivery_charges == 1 && product['base_delivery_charges_array'] && product['base_delivery_charges_array'].length) {
                  let base_charges = product['base_delivery_charges_array'].filter(el => sp.distance < el.distance_value);
                  let max_base = null;
                  if (base_charges.length) {
                    max_base = base_charges.reduce(function (prev, current) {
                      return (prev.distance_value < current.distance_value) ? prev : current
                    });
                    if (!!max_base) {
                      delivery_charges_obj['delivery_charges'] = max_base.base_delivery_charges;
                      this.delivery_charge += max_base.base_delivery_charges;
                    } else {
                      this.delivery_charge = 0;
                      delivery_charges_obj['delivery_charges'] = this.delivery_charge;
                    }
                  } else {
                    let maxBase = product['base_delivery_charges_array'].reduce(function (prev, current) {
                      return (prev.distance_value > current.distance_value) ? prev : current
                    });
                    delivery_charges_obj['delivery_charges'] = ((sp.distance - maxBase.distance_value) * product.radius_price) + maxBase.base_delivery_charges;

                    this.delivery_charge += ((sp.distance - maxBase.distance_value) * product.radius_price) + maxBase.base_delivery_charges;
                  }
                } else {
                  if (sp.distance > product.distance_value) {
                    delivery_charges_obj['delivery_charges'] = ((sp.distance - product.distance_value) * product.radius_price) + product['base_delivery_charges'];
                    this.delivery_charge += ((sp.distance - product.distance_value) * product.radius_price) + product['base_delivery_charges'];
                  } else {
                    this.delivery_charge += product['base_delivery_charges'] || 0;
                    delivery_charges_obj['delivery_charges'] = product['base_delivery_charges'] || 0;
                  }
                }
                this.delivery_charges_array.push(delivery_charges_obj);
              });

              this.cart.forEach(element => {
                var rec = this.delivery_charges_array.find(x => x.supplier_id == element.supplier_id);
                if (rec) {
                  element['delivery_charges'] = rec.delivery_charges;
                }
              });
            } else {
              if (!this.is_own_delivery && (this.supplier_delivery_type_normal || this.supplier_delivery_type_express)) {
                this.calcDeliveryChargesWithDelTypes(this.supplier_delivery_type_normal ? 0 : 1);
              }
            }
            if (calc_duration) {
              this.supplier_delivery_time_duration['time'] = calc_duration / 60;
              this.supplier_delivery_time_duration['time_unit'] = 'minutes';
            }
          } else {
            this.delivery_charge = 0;
          }
          this.addressDetail.address['delivery_charge'] = this.delivery_charge;
        }
      });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onChangeInRequest(event) {
    if (event) {
      this.have_coin_change = "1";
    }
    else {
      this.have_coin_change = "0";
    }
  }

  setPaymentType(mode: string) {
    this.paymentType = mode;
    if (this.agent_tips.length) {
      this.agentTipChange({ tip: 0, isCustom: false });
    }
    if (this.paymentType == '0') {
      this.isPayOnline = false;
      this.applyWalletDiscount = false;
    } else if (this.paymentType == '4') {
      // if (this.priceObj.netTotal > this.addressDetail['wallet_amount']) {
      //   this.message.alert('warning', `${this.translate.instant('Wallet Amount Must Be Greater Than')} ${this.priceObj.netTotal}`);
      // } else {
      this.applyWalletDiscount = true;
      // }
    } else if (this.paymentType == '5') {
      this.isPayOnline = false;
      this.applyWalletDiscount = false;
    } else {
      this.applyWalletDiscount = false;
    }
  }


  setOrderwiseGateways() {
    this.hidePaymentModeOption = false;

    if (this.settings && this.settings.is_enable_orderwise_gateways && this.order_type_wise_gateways.length) {
      this.geofencedGateways = [];
      if (this.self_pickup == 1) {
        var data = this.order_type_wise_gateways.find(x => x.order_type == 0);
        if (data) {
          this.geofencedGateways = data.payment_gateways.replace(/#/g, ',').split(',');
        }
      }
      else if (this.delivery_opt == 1) {
        var data = this.order_type_wise_gateways.find(x => x.order_type == 1);
        if (data) {
          this.geofencedGateways = data.payment_gateways.replace(/#/g, ',').split(',');
        }
      }
      else if (this.book_dining == 1) {
        var data = this.order_type_wise_gateways.find(x => x.order_type == 2);
        if (data) {
          this.geofencedGateways = data.payment_gateways.replace(/#/g, ',').split(',');
        }
      }

      if (!this.hidePaymentModeOption) {
        var cod = this.geofencedGateways.find((gateway) => gateway == 'cod');
        this.hidePaymentModeOption = !cod ? true : false;
        if (this.hidePaymentModeOption) {
          this.paymentType = '1';
        }
      }

      if (this.hidePaymentModeOption) {
        this.setPaymentType('1');
      }
    }
    if (!this.is_own_delivery && (this.supplier_delivery_type_normal || this.supplier_delivery_type_express)) {
      this.onSelectDeliveryType(this.supplier_delivery_type_normal ? 0 : 1);
    }
  }

  calcDeliveryChargesWithDelTypes(delv_type) {
    switch (delv_type) {
      case 0:
        this.delivery_charge = this.supplier_delivery_type_normal.price * this.calc_distance;
        break;
      case 1:
        this.delivery_charge = this.supplier_delivery_type_express.price * this.calc_distance;
        break;
    }
    if (this.delivery_charge) {
      this.addressDetail.address['delivery_charge'] = this.delivery_charge;
    }
  }

  onSelfPickup() {
    this.self_pickup = 1;
    this.delivery_opt = 0;
    this.delivery_charge = 0;
    this.book_dining = 0;
    this.normal_delivery = 0;
    this.express_delivery = 0;

    if (this.settings.enable_product_appointment && this.cart.length & this.cart[0].is_appointment) {
      this.appointmentOrderInCart = 1;
    }
    this.setOrderwiseGateways();
  }
  onDining() {
    this.self_pickup = 0;
    this.delivery_charge = 0;
    this.delivery_opt = 0;
    this.book_dining = 1;
    this.normal_delivery = 0;
    this.express_delivery = 0;
    this.setOrderwiseGateways();
  }

  onDelivery() {
    this.self_pickup = 0;
    this.delivery_opt = 1;
    this.book_dining = 0;
    if (!_.isEmpty(this.addressDetail)) {
      this.delivery_charge = this.delivery_charge || this.addressDetail.address['delivery_charge'] || this.priceObj.deliveryCharges || 0;
    }
    this.setOrderwiseGateways();
  }

  onSelectDeliveryType(type) {
    // if (!this.loggedIn) {
    //   this.util.authToggle.next(true);
    //   return false;
    // }

    // if (!((!!this.addressDetail && !!this.addressDetail.address && this.addressDetail.address.id) || this.self_pickup == 1) && !this.is_after_table_booking) {
    //   if (this.settings.header_theme == 2) {
    //     this.displayAddModal.next(true);
    //   } else {
    //     this.deliveryAddress.openNewAddressDialog();
    //     // this.message.alert('info', `${this.translate.instant('Firstly Add Address')}!`);
    //   }
    //   return false;
    // }

    this.selected_delivery_type = type;
    switch (type) {
      case 0:
        this.normal_delivery = 1;
        this.express_delivery = 0;
        break;
      case 1:
        this.normal_delivery = 0;
        this.express_delivery = 1;
        break;
    }
    this.calcDeliveryChargesWithDelTypes(type);
  }

  placeOrder() {
    this.cartModel = new CartModel();
    this.updateCartModel = new UpdateCartModel();

    let cart_id = this.util.getLocalData('cart_id', true);
    if (cart_id) {
      let check = false;
      for (let el of this.cart) {
        if (!cart_id.service_ids.includes(el.id)) {
          check = true;
          break;
        }
      };
      if (check) {
        this.makeModelData();
      } else {
        this.router.navigate(['/', 'cart', 'agent'], {
          queryParams: {
            service_ids: cart_id.service_ids.join(),
            cart_id: cart_id.id,
            isPkg: '0',
            payType: '0',
            promo: (this.priceObj.promo && this.priceObj.promo.code) ? this.priceObj.promo.code : null,
            discount: this.priceObj.discount,
            user_gift_ids: this.priceObj.gift && this.priceObj.gift.id ? [this.priceObj.gift.id] : null
          }
        });
      }
    } else {
      this.makeModelData();
    }
  }
  onInvoiceUpdate(value) {
    const obj = {
      'id_for_invoice': value,
      'name': [this.web_user.firstname],
      'accessToken': this.userService.getUserToken,
      'profilePic': this.web_user.user_image,
      'abn_number': this.web_user.abn_number,
      'business_name': this.web_user.business_name
    }
    let formData = this.http.appendFormData(obj);
    this.http.postData(ApiUrl.auth.signUp_step3, formData)
      .subscribe(response => {
        this.isLoading = false;
        if (!!response && response.data) {
          this.userService.setUserLocalData(response.data);
          this.ngOnInit();
        }
      }, error => { this.isLoading = false });
  }
  makeAddOnModel(customization): Array<any> {
    let addOns = [];

    if (!customization || !customization.length) {
      return addOns;
    }

    customization.forEach((item, index) => {
      let quantity = item.quantity;
      item.data.forEach(d => {
        addOns.push(...d.value.map(v => {
          v.quantity = quantity;
          v.serial_number = index + 1;
          return v;
        })
        );
      })
    })

    return addOns;
  }

  makeModelData() {
    if (this.settings.enable_supplier_config_closing_day == 1) {
      let is_supplier_availability = this.check_supplier_availability(this.supplier_timing);
      if (!is_supplier_availability)
        return is_supplier_availability;
    }
    this.cartModel.accessToken = this.user.getUserToken;
    this.cartModel.supplierBranchId = this.cart[0].supplier_branch_id;
    this.cartModel.supplier_id = this.cart[0].supplier_id;

    this.cartModel.order_time = moment().format('HH:mm:ss');
    let day = [6, 0, 1, 2, 3, 4, 5];
    this.cartModel.order_day = day[(new Date()).getDay()];

    this.cartModel.adds_on = [];
    this.cartModel.variants = [];
    for (let i = 0; i < this.cart.length; i++) {
      let model = new CartProductModel(this.cart[i]);

      if (this.cart[i].cartVariants && this.cart[i].cartVariants.length) {
        this.cartModel.variants.push(...this.cart[i].cartVariants);
      }

      this.cartModel.adds_on.push(...this.makeAddOnModel(this.cart[i]['customization']));
      model['category_id'] = this.cart[i].categoryId || this.cart[i].category_id;
      model['agent_type'] = this.cart[i].agent_list && this.cart[i].is_agent ? 1 : 0;
      model.quantity = this.cart[i]['price_type'] ? 1 : this.cart[i].selectedQuantity;
      model['freeQuantity'] = this.cart[i].freeQuantity;

      if (this.cart[i].is_out_network) {
        this.is_out_network = true;
        model['product_dimensions'] = this.cart[i].product_dimensions;
        model['product_owner_name'] = this.cart[i].product_owner_name;
        model['product_reference_id'] = this.cart[i].product_reference_id;
        model['product_upload_reciept'] = this.cart[i].product_upload_reciept;
      }


      if (this.settings.enable_product_special_instruction == 1 && this.cart[i].special_instructions) {
        model['special_instructions'] = this.cart[i].special_instructions;
      }

      if (this.cart[i].agentBufferPrice) {
        model['agentBufferPrice'] = this.cart[i].agentBufferPrice
      }

      if (this.settings.enable_multi_supplier_delivery_charge_distance_wise && this.settings.delivery_charge_type == 0) {
        model['delivery_charge'] = this.cart[i].delivery_charges;
      } else if (this.settings.delivery_charge_type == 1) {
        model['delivery_charge'] = this.cart[i].radius_price;
      }

      if (this.settings.enable_flat_user_service_charge && this.priceObj.flat_user_service_charges.length) {
        model['handling_supplier'] = this.priceObj.flat_user_service_charges.find(x => x.supplier_id == this.cart[i].supplier_id).serviceCharge;
      } else if (this.settings.vendor_status == 1) {
        let supplier_data = [...new Map(this.cart.map(item => [item['supplier_id'], item])).values()];
        if (supplier_data.length > 1) {
          model['tax'] = (this.cart[i].handling_admin / 100) * (this.cart[i].fixed_price * this.cart[i].selectedQuantity);
          model['handling_supplier'] = (this.cart[i].user_service_charge / 100) * this.cartService.calulateProductPrice(this.cart[i]);
        }
      }

      this.cartModel.productList.push(model);
    }

    // update cart model data
    this.updateCartModel.accessToken = this.user.getUserToken;
    this.updateCartModel.currencyId = this.util.handler.currencyId;
    this.updateCartModel.languageId = this.util.handler.languageId;
    this.updateCartModel.deliveryType = this.deliveryType.toString();
    this.updateCartModel.deliveryCharges = this.priceObj.deliveryCharges.toString();
    this.updateCartModel.handlingAdmin = this.priceObj.handlingAdmin.toString();
    this.updateCartModel.handlingSupplier = this.priceObj.handlingSupplier.toString();
    this.updateCartModel.netAmount = this.priceObj.netTotal;

    this.updateCartModel.liquor_bottle_deposit_tax = this.priceObj.bottle_deposit_price;
    this.updateCartModel.liquor_plt_deposit_tax = this.priceObj.plt_tax;

    this.updateCartModel.delivery_max_time = this.pickUp_dateTime ? moment(this.pickUp_dateTime['date_time']).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    let date = moment();
    if (this.addressDetail['delivery_max_time']) {
      date = date.add(this.addressDetail['delivery_max_time'], 'minutes');
    }

    if (this.deliveryType == 1) {
      date = date.add(this.addressDetail['urgent_delivery_time'], 'minutes');
      this.updateCartModel.urgentPrice = this.urgentPrice;
    }

    this.updateCartModel.deliveryDate = this.pickUp_dateTime ? moment(this.pickUp_dateTime['date_time']).format('YYYY-MM-DD') : date.format('YYYY-MM-DD');
    this.updateCartModel.deliveryTime = this.pickUp_dateTime ? moment(this.pickUp_dateTime['date_time']).format('HH:mm') : date.format('HH:mm');
    this.updateCartModel.day = this.pickUp_dateTime ? moment(this.pickUp_dateTime['date_time']).day() : new Date().getDay();

    if (this.priceObj.amount + this.priceObj.handlingSupplier + this.priceObj.handlingAdmin >= this.addressDetail.free_delivery_amount) {
      this.updateCartModel.minOrderDeliveryCrossed = 1;
    } else {
      this.updateCartModel.minOrderDeliveryCrossed = 0;
    }

    if (this.self_pickup == 1) {
      this.updateCartModel.deliveryId = '0';
    } else {
      this.cartModel.latitude = this.addressDetail.address.latitude;
      this.cartModel.longitude = this.addressDetail.address.longitude;
      this.updateCartModel.deliveryId = this.addressDetail.address.id;
    }

    if (this.settings.app_type == 8 && this.questions.length) {
      this.cartModel.questions = this.questions.slice();
      this.cartModel.addOn = this.priceObj.questionPrice;
      this.updateCartModel.questions = this.questions.slice();
      this.updateCartModel.addOn = this.priceObj.questionPrice;
    }

    this.addToCart();
  }

  check_supplier_availability(supplier_timing) {

    let supplier_timing_arr: any = {};
    let timing: any = {};
    let timing_status = [];

    for (let i = 0; i < supplier_timing.length; i++) {
      supplier_timing_arr = supplier_timing[i];
      let arr: any = Object.keys(supplier_timing_arr);
      timing = supplier_timing_arr[arr];

      timing_status.push({ name: timing.name, open_status: this.todaySupplierTimings(timing.data) })
    }
    let unavailable_supplier = [];

    unavailable_supplier = timing_status.filter(o => o.open_status == 0);
    if (unavailable_supplier.length) {
      let supplier_name = unavailable_supplier[0].name;
      this.message.toast('error', `Sorry! ${supplier_name} is closed now`);
      return false;
    } else {
      return true;
    }
  }

  todaySupplierTimings(timing) {
    if (timing && timing.length) {
      const today = this.dateService.getDay(moment().format('dddd').toLowerCase())
      const todayTimes = timing.find((i) => i.week_id == today);
      let todayTimesObj;

      if (todayTimes) {
        let startTime = todayTimes.start_time.split(':');
        let endTime = todayTimes.end_time.split(':');
        const openingTime = moment().set('h', startTime[0]).set('m', startTime[1]).set('s', startTime[2]);
        let closeTime;
        if (this.settings.enable_supplier_config_closing_day == 1 && (!!todayTimes.close_week_id || todayTimes.close_week_id == 0) && todayTimes.close_week_id != todayTimes.week_id) {
          closeTime = moment().add(1, 'day').set('h', endTime[0]).set('m', endTime[1]).set('s', endTime[2]);
        } else {
          closeTime = moment().set('h', endTime[0]).set('m', endTime[1]).set('s', endTime[2]);
        }

        todayTimesObj = {
          is_open: todayTimes.is_open,
          startTime: openingTime.format('LT'),
          endTime: closeTime.format('LT'),
          day: this.dateService.getDayName(today)
        };
        if (moment().isBefore(openingTime, 'm') || moment().isAfter(closeTime)) {
          todayTimesObj['is_open'] = 0;
        }

        if (this.settings.enable_supplier_config_closing_day == 0) {
          return todayTimesObj['is_open'];
        }
      }

      if (this.settings.enable_supplier_config_closing_day == 1) {
        const closingSlotTimes = timing.find((i) => i.close_week_id == today);

        if (closingSlotTimes) {
          let endTime = todayTimes.end_time.split(':');
          const openingTime = moment().set('h', 0).set('m', 0).set('s', 0);
          let closeTime;
          closeTime = moment().set('h', endTime[0]).set('m', endTime[1]).set('s', endTime[2]);
          if (moment().isAfter(openingTime, 'm') && moment().isBefore(closeTime)) {
            todayTimesObj['is_open'] = 1;
          }
        }
      }
      return todayTimesObj['is_open'];
    } else {
      return 0;
    }
  }

  addToCart() {
    this.isLoading = true;
    this.http.postData(ApiUrl.addToCart, this.cartModel, false)
      .subscribe(response => {
        if (!!response && response.data) {
          this.updateCartModel.cartId = response.data.cartId;
          this.updateCart();
        } else {
          this.isLoading = false;
        }
      }, (err) => this.isLoading = false);
  }

  makePaymentOrderModel() {
    this.paymentOrderModel.amount = this.priceObj.netTotal; //+ this.priceObj.serviceCharge;
    this.paymentOrderModel.address = this.addressDetail.address;
  }

  updateCart() {
    this.http.postData(ApiUrl.updateCartInfo, this.updateCartModel, false)
      .subscribe(response => {
        if (!!response && response.data) {
          this.afterUpdateCart();
        } else {
          this.isLoading = false;
        }
      }, (err) => this.isLoading = false);
  }

  afterUpdateCart() {
    if (!this.is_service || ((!this.is_agent || this.cart[0].agent_slot) && this.settings.hideAgentList == 0) || this.isBookNow || this.serviceDateTime || this.stripe_transaction_id) {
      this.generateOrder();
    } else {
      let serviceIds: Array<any> = [];
      this.cart.forEach(data => {
        serviceIds.push(data.productId);
      });
      this.util.setLocalData('cart_id', { id: this.updateCartModel.cartId, service_ids: serviceIds }, true);
      this.cartDateTimeData = {
        is_open: true,
        cart: this.cart,
        // addressDetail: this.addressDetail,
        priceObj: this.priceObj,
        data: {
          service_ids: serviceIds.join(),
          cart_id: this.updateCartModel.cartId,
          isPkg: '0',
          payType: this.paymentType,
          promo: (this.priceObj.promo && this.priceObj.promo.code) ? this.priceObj.promo.code : null,
          discount: this.priceObj.discount,
          promoId: (this.priceObj.promo && this.priceObj.promo.id) ? this.priceObj.promo.id : null,
        }
      }

      if (this.settings.extra_instructions == 1) {
        this.cartDateTimeData.data['parking_instructions'] = this.parking_instruction;
        this.cartDateTimeData.data['area_to_focus'] = this.area_to_focus;
      }

      if (this.transaction) {
        this.cartDateTimeData.data['paymentGatewayId'] = this.transaction.paymentGatewayId;
        if (this.transaction.token) {
          this.cartDateTimeData.data['token'] = this.transaction.token;
        } else {
          if (this.transaction.paymentGatewayId != "authorize_net") {
            this.cartDateTimeData.data['customer_payment_id'] = this.transaction.customer_payment_id;
            this.cartDateTimeData.data['card_id'] = this.transaction.card_id;
          }
          else {
            this.cartDateTimeData.data['authnet_profile_id'] = this.transaction.customer_payment_id || this.paymentOrderModel.user.authnet_profile_id;
            this.cartDateTimeData.data['authnet_payment_profile_id'] = this.transaction.card_id;
          }
        }
      }
      this.isLoading = false;
    }
  }

  generateOrder() {
    let offset = moment().format('Z');
    let obj = {
      cartId: this.updateCartModel.cartId,
      languageId: this.util.handler.languageId,
      isPackage: '0',
      paymentType: this.payment_after_confirmation == 1 ? '3' : (this.priceObj.referral_amount >= this.priceObj.netTotal ? '2' : this.paymentType),
      accessToken: this.user.getUserToken,
      offset: offset,
      self_pickup: this.self_pickup,
      type: this.settings.app_type,
      payment_after_confirmation: this.payment_after_confirmation,
      order_delivery_type: this.selected_delivery_type,
      order_source: 2
    }

    if (this.settings.enable_cutlery_option) {
      obj['is_cutlery_required'] = this.is_cutlery_required ? 1 : 0;
    }

    if (this.settings.enable_no_touch_delivery) {
      obj['no_touch_delivery'] = this.no_touch_delivery ? 1 : 0;
    }

    if (this.applyWalletDiscount && this.priceObj.walletDiscountAmount && this.paymentType == '4') {
      obj['wallet_discount_amount'] = this.priceObj.walletDiscountAmount
    }
    // console.log(this.transaction.card_details);

    if (this.transaction && !this.transaction.card_details) {
      obj['gateway_unique_id'] = this.transaction.paymentGatewayId;
      obj['currency'] = GlobalVariable.CURRENCY_NAME;
      if (this.transaction.token) {
        obj['payment_token'] = this.transaction.token;
      } else if (this.transaction.mobile_no) {
        obj['mobile_no'] = this.transaction.mobile_no;
      } else {
        if (this.transaction.paymentGatewayId != "authorize_net") {
          obj['customer_payment_id'] = this.transaction.customer_payment_id;
          obj['card_id'] = this.transaction.card_id;
        } if (this.transaction.paymentGatewayId == "authorize_net") {
          this.cartDateTimeData.data['authnet_profile_id'] = this.paymentOrderModel.user.authnet_profile_id;
          this.cartDateTimeData.data['authnet_payment_profile_id'] = this.transaction.card_id;
          obj['authnet_profile_id'] = this.paymentOrderModel.user.authnet_profile_id;
          obj['authnet_payment_profile_id'] = this.transaction.card_id;
        }
        if(this.transaction.paymentGatewayId != "authorize_net") {
          obj['payment_token'] = this.transaction.token
        }
      }
    }
    else {
      obj['gateway_unique_id'] = this.transaction.card_details.paymentGatewayId;
      obj['currency'] = GlobalVariable.CURRENCY_NAME;
      obj['payment_token'] = this.transaction.card_details.card_number;
      obj['cvt'] = this.transaction.card_details.cvc;
      obj['cp'] = this.transaction.card_details.p_code;
      obj['expMonth'] = this.transaction.card_details.exp_month;
      obj['expYear'] = this.transaction.card_details.exp_year;
      obj['cardHolderName'] = this.transaction.card_details.card_holder_name;

    }

    obj['order_time'] = moment().format('HH:mm:ss');
    let day = [6, 0, 1, 2, 3, 4, 5];
    obj['order_day'] = day[(new Date()).getDay()];

    if (this.priceObj.promo && this.priceObj.promo.code) {
      obj['promoId'] = this.priceObj.promo.id;
      obj['promoCode'] = this.priceObj.promo.code;
      obj['discountAmount'] = this.priceObj.discount;
    }

    if (this.priceObj.gift && this.priceObj.gift.id) {
      obj['user_gift_ids'] = [this.priceObj.gift.id]
      obj['gift_amount'] = this.priceObj.discount
    }
    if (this.pickUp_dateTime) {
      obj['date_time'] = this.pickUp_dateTime.date_time;
    } else {
      if (this.serviceDateTime) {
        obj['date_time'] = this.serviceDateTime.date_time;
        if (this.serviceDateTime.drop_off_date) {
          obj['drop_off_date'] = this.serviceDateTime.drop_off_date;
        }
      } else {
        let date = moment();
        obj['date_time'] = date.format('YYYY-MM-DD HH:mm:ss');
      }
    }


    obj['duration'] = 0;
    this.cart.forEach(data => {
      if (data['is_product'] == 0) {
        if (data['price_type']) {
          obj['duration'] += (this.settings.interval * data['selectedQuantity']);
        } else {
          obj['duration'] += (data['duration'] * data['selectedQuantity']);
        }
      } else {
        if (data['price_type'] == 1) {
          obj['duration'] += data['selectedQuantity'] * 60;
        }
      }
    });

    if (this.cart[0].agent_slot) {
      obj['date_time'] = this.cart[0].agent_slot.date_time;
      obj['agentIds'] = [this.cart[0].agent_slot.agent.cbl_user.id];
    }

    if (this.priceObj.agent_tip) {
      obj['tip_agent'] = this.priceObj.agent_tip;
    }

    if (this.settings.app_type == 8 && this.questions.length) {
      obj['questions'] = this.questions.slice();
    }

    if (this.settings.referral_feature == 1) {
      obj['use_refferal'] = this.priceObj.referral_amount ? 1 : 0;
    }

    if (this.settings.supplier_service_fee == 1) {
      obj['user_service_charge'] = this.priceObj.serviceCharge;
    }

    if ((this.settings.cart_image_upload == 1 || this.settings.product_prescription) && this.show_prescription) {
      Object.keys(this.prescription_images).forEach(key => {
        if (this.prescription_images[key]) {
          obj[key] = this.prescription_images[key];
        }
      });
    }

    if (this.settings.order_instructions == 1 && this.show_instructions && this.instructions) {
      obj['pres_description'] = this.instructions;
    }

    if (this.settings.extra_instructions == 1) {
      obj['parking_instructions'] = this.parking_instruction;
      obj['area_to_focus'] = this.area_to_focus;
    }

    if (this.settings.is_loyality_enable == 1 && this.priceObj.appliedLoyaltyAmount) {
      obj['use_loyality_point'] = 1;
    }

    if (this.scheduleOrderSlot && this.settings.is_schdule_order == 1) {
      obj['is_schedule'] = this.scheduleOrderSlot.table_id ? 0 : 1;//0 in case of dining
      obj['schedule_date'] = this.scheduleOrderSlot.startTime;
      obj['schedule_end_date'] = this.scheduleOrderSlot.endTime;
      obj['slot_price'] = this.scheduleOrderSlot.price;
      obj['slot_id'] = this.scheduleOrderSlot.slot_id;
      if (this.scheduleOrderSlot.table_id) {
        obj['is_dine_in_with_food'] = 1;
        obj['is_dine_in'] = 1;
        obj['table_id'] = this.scheduleOrderSlot.table_id;
      }
    }
    if (this.is_after_table_booking && this.table_booking_details) {
      obj['is_dine_in'] = 1;
      obj['table_id'] = this.table_booking_details.table_id;

      if (this.table_booking_details && this.table_booking_details.table_booking_price) {
        obj['slot_price'] = this.table_booking_details.table_booking_price;
      }
      if (this.settings.table_book_mac_theme) {
        obj['seating_capacity'] = this.table_booking_details.table_seating;
        obj['schedule_date'] = this.table_booking_details.table_slot;
        obj['schedule_end_date'] = this.table_booking_details.table_slot_endTime;
      } else {
        obj['table_request_id'] = this.table_booking_details.table_request_id;
      }
    }
    if (this.manualTableNo) {
      if (this.manualTable_id) {
        obj['table_id'] = this.manualTable_id;
      }
      else {
        this.message.toast("error", "Please verify the table no.");
        return;
      }
    }
    // if (this.settings.dynamic_order_type_client_wise_dinein && this.settings.is_table_booking && this.book_dining == 1) {
    //   if (!obj['table_id']) {
    //     this.isLoading = false;
    //     this.message.toast("error", "Please select the table no.");
    //     return;
    //   }
    // }

    if (this.paymentType === "0") {
      obj['have_coin_change'] = this.have_coin_change;
    }
    if (this.book_dining == 1) {
      obj['self_pickup'] = 3;
      obj['is_dine_in'] = 1;
    }

    if (this.settings.enable_user_vehicle_number) {
      obj['vehicle_number'] = this.vehicle_number;
    }

    console.log('this.transaction', this.transaction);

    if (this.transaction && this.transaction.waitForSuccess) {
      this.util.setLocalData('gop', obj, true);
      if (!['hyperpay'].includes(this.transaction.paymentGatewayId)) {
        const a = document.createElement('a');
        //a.target = '_blank'
        a.href = this.transaction['paymentUrl'];
        a.click();
      }
      this.isLoading = false;
      return
    }

    this.http.postData(ApiUrl.generateOrder, obj, false)
      .subscribe(response => {
        if (!!response && response.data) {
          this.firebaseAnalyticsSvc.firebaseAnalyticsEvents('place_order', 'place_order');
          this.segmentAnalyticsSvc.segmentAnalyticsEvent('item_purchase', { name: 'new item', info: 'new item purchage done' });
          this.isLoading = false;
          this.orderId = response.data;
          // if (this.settings.is_scheduled && !this.is_agent && !this.pickUp_dateTime && !this.is_service) {
          //   this.scheduleMaxDate = moment().add('days', this.settings.schedule_time).toDate();
          //   $("#scheduleDateModal").modal('show');
          // } else {
          this.toOrderDetail();
          // }
          this.util.clearLocalData('pickUp_DT');
          this.util.clearLocalData('table_booking_details');
        }
        this.isLoading = false;
        this.isBookNow = false;
      }, (err) => {
        this.isLoading = false
        this.isBookNow = false;
      });
  }

  // scheduleOrder() {
  //   let orderDates: Array<any> = [];
  //   this.selectedScheduleDate.forEach(date => {
  //     orderDates.push({
  //       deliveryDate: date,
  //       delivery_time: this.updateCartModel.deliveryTime
  //     });
  //   });

  //   let form_data = {
  //     accessToken: this.user.getUserToken,
  //     orderDates: orderDates,
  //     orderId: this.orderId
  //   };

  //   this.http.postData(ApiUrl.orders.scheduleOrder, form_data, false)
  //     .subscribe(response => {
  //       if (!!response && response.data) {
  //         $("#scheduleDateModal").modal('hide');
  //         this.toOrderDetail();
  //       }
  //     });
  // }

  toOrderDetail() {
    this.router.navigate(['/orders/order-detail'], { queryParams: { orderId: this.orderId } });
    this.util.setCart([]);
    setTimeout(() => {
      this.message.alert('success', `${this.translate.instant('Thanks for waiting, we are processing your')} ${this.localization.transform('order')}`);
    }, 600);
  }

  validateOrder(): boolean {
    let isOutOfStock = this.cart.find(p => p.isOutOfStock);
    if (isOutOfStock) {
      this.message.alert('info', this.translate.instant('Some Item Out Of Stock'));
      return false;
    }

    if (!this.loggedIn) {
      this.util.authToggle.next(true);
      return false;
    }

    if (!((!!this.addressDetail && !!this.addressDetail.address && this.addressDetail.address.id) || this.self_pickup == 1) && !this.is_after_table_booking) {
      if (this.settings.header_theme == 2) {
        this.displayAddModal.next(true);
      } else {
        this.deliveryAddress.openNewAddressDialog();
        // this.message.alert('info', `${this.translate.instant('Firstly Add Address')}!`);
      }
      return false;
    }

    if (!this.is_out_network) {
      if (this.settings.enable_min_order_distance_wise == '1' && this.min_distance_price_list.length > 0) {
        var self = this;
        var availablePrice;
        this.min_distance_price_list.sort(function (a, b) { return b.distance - a.distance });
        this.min_distance_price_list.every(function (minPrice) {
          if (minPrice.distance <= self.calc_distance) {
            availablePrice = minPrice;
            return false;
          }
          return true;
        });
        if (availablePrice && this.priceObj.amount < availablePrice.min_amount) {
          this.message.alert('warning', `${this.translate.instant('Sub Total Must Be Greater Than')} ${availablePrice.min_amount}`);
          return false;
        }
      }

      if (this.priceObj.amount < this.addressDetail['min_order']) {
        this.message.alert('warning', `${this.translate.instant('Sub Total Must Be Greater Than')} ${this.addressDetail['min_order']}`);
        return false;
      }

      if (this.paymentType == '4' && this.priceObj.netTotal > this.addressDetail['wallet_amount']) {
        this.message.alert('warning', `${this.translate.instant('Wallet Amount Must Be Greater Than')} ${this.priceObj.netTotal}`);
        return false;
      }

      if (this.pickUp_dateTime && moment(this.pickUp_dateTime['date_time']) < moment()) {
        this.message.alert('warning', this.translate.instant('Please Reselect Date-Time'), this.translate.instant('Your Date-Time Cannot Be Less Than Current Time.'));
        return false;
      }

      if (this.show_prescription && !this.prescription_images) {
        this.message.alert('warning', this.translate.instant('Please Upload Prescription'));
        return false;
      }
    }

    return true;
  }

  onPlaceOrder() {
    if (this.settings.signup_declaration == '1' && !this.is_declaration_checked) {
      this.is_order_try = true;
      return;
    }
    if (this.settings.cart_image_upload == 1 && this.show_prescription && !(this.prescription_images && Object.values(this.prescription_images).length)) {
      this.message.alert('warning', this.translate.instant('Please Select Image'));
      return;
    }

    if (this.settings.enable_no_order_without_scheduling == 1 && this.settings?.is_schdule_order == 1 && !this.scheduleOrderSlot) {
      this.message.alert('warning', this.translate.instant('Please Schedule Your Order First!'));
      return;
    }

    if (this.validateOrder()) {
      this.placeOrder();
    }
  }

  bookServiceNow() {
    if (this.settings.signup_declaration == '1' && !this.is_declaration_checked) {
      this.is_order_try = true;
      return;
    }
    if (this.validateOrder()) {
      this.isBookNow = true;
      if (this.paymentType == '1') {
        this.makePaymentOrderModel();
        this.isPayOnline = true;
      } else {
        this.placeOrder();
      }
    }
  }

  onPay(type?: string) {
    if (this.settings.signup_declaration == '1' && !this.is_declaration_checked) {
      this.is_order_try = true;
      if (type == 'online') {
        this.is_order_try_online = true;
      }
      else {
        this.is_order_try_online = false;
      }
      return;
    }

    if (this.settings.cart_image_upload == 1 && this.show_prescription && !(this.prescription_images && Object.values(this.prescription_images).length)) {
      this.message.alert('warning', this.translate.instant('Please Select Image'));
      return;
    }

    if (this.validateOrder()) {
      if (this.is_service && this.settings.hideAgentList == 1 && !this.serviceDateTime) { //&& !this.cartDateTimeData
        this.cartDateTimeData = {
          is_open: true,
          isOnlinePayment: true,
          cart: this.cart,
          data: {}
        }
      } else {
        this.makePaymentOrderModel();
        this.isPayOnline = true;
      }
    }
  }

  onPaymentError(error: string) {
    this.firebaseAnalyticsSvc.firebaseAnalyticsEvents('initiate_checkout_failed', 'initiate_checkout_failed');
    this.isPayOnline = false;
    this.message.toast('error', error);
  }

  onPaymentSuccess(transaction) {
    this.firebaseAnalyticsSvc.firebaseAnalyticsEvents('initiate_checkout_success', 'initiate_checkout_success');
    this.transaction = transaction;
    if (this.transaction.paymentGatewayId != 'hyperpay') {
      this.isPayOnline = false;
    }
    this.isLoading = true;
    this.placeOrder();
  }

  agentTipChange(tipData: any) {
    if (this.settings.agentTipPercentage == 1) {
      if (tipData.isCustom) {
        this.priceObj.agent_tip = parseFloat(tipData.tip);
      } else {
        this.priceObj.agent_tip = (parseFloat(tipData.tip) / 100) * this.priceObj.amount;
      }
    } else {
      this.priceObj.agent_tip = parseFloat(tipData.tip);
    }
    this.cartPriceClass.getTotal();
  }

  referralAmountChange(amount: number) {
    this.priceObj.referral_amount = amount;
    this.cartPriceClass.getTotal();
  }

  loyaltyAmountChange(loyaltyAmount: number) {
    this.priceObj.appliedLoyaltyAmount = loyaltyAmount;
    this.cartPriceClass.getTotal();
  }

  calculateServiceCharge(service_charge) {
    if (service_charge) {
      this.priceObj.supplier_service_charge = service_charge;
      this.cartPriceClass.getTotal();
    }
  }

  prescriptionImagesCheck(event) {
    this.prescription_images = event;
  }

  instructionChange(instruction) {
    this.instructions = instruction;
  }

  onSchedulingProcess(eventData: any) {
    this.scheduleOrderSlot = eventData;
    this.priceObj.slot_price = eventData.price;
    this.cartPriceClass.getTotal();
    this.showScheduleTime = false;
  }

  verifyManualTableNo() {
    if (!this.manualTableNo || !Number(this.manualTableNo)) {
      this.message.toast("error", "Please enter valid table number");
      return;
    }
    var obj = {
      table_number: this.manualTableNo,
      supplier_id: this.cart[0].supplier_id
    }
    this.http.postData(ApiUrl.verifyTable, obj).subscribe((res: any) => {
      if (res && res.status == 200) {
        if (res.data.length) {
          this.manualTable_id = res.data[0].id;
          this.message.toast("success", "Table is available");
        }
        else {
          setTimeout(() => {
            this.message.toast("error", "Please try another table no.");
          }, 4000);
        }
      }
    })
  }

  openSchedulingModal() {
    if (!this.loggedIn) {
      this.util.authToggle.next(true);
      return false;
    }

    if (!((!!this.addressDetail && !!this.addressDetail.address && this.addressDetail.address.id) || this.self_pickup == 1)) {
      this.deliveryAddress.openNewAddressDialog();
      return false;
    }

    this.schedulingData = {
      supplier_id: this.cart[0].supplier_id,
      branch_id: this.cart[0].supplier_branch_id,
      date_order_type: this.book_dining ? 3 : (this.self_pickup == 1 ? 2 : 1),
      latitude: this.addressDetail.address.latitude,
      longitude: this.addressDetail.address.longitude,
      by_pass_tables_selection: this.settings.by_pass_tables_selection
    }
    this.showScheduleTime = true;
  }

  removeSlot() {
    this.cartDateTimeData = { is_open: false, data: {} };
    this.serviceDateTime = '';
    this.showScheduleTime = false;
    this.priceObj.slot_price = 0;
    this.scheduleOrderSlot = null;
  }
  pickOtherSlots() {
    this.cartDateTimeData = { is_open: false, data: {} };
    this.serviceDateTime = '';
    this.placeOrder();
  }

  setDateTime(event) {
    this.serviceDateTime = event;
    if (this.cartDateTimeData.isOnlinePayment) {
      this.makePaymentOrderModel();
      this.isPayOnline = true;
    }
  }

  removeTableBookingRequest(event) {
    if (event) {
      this.is_after_table_booking = false;
      this.onDelivery();
      this.util.clearLocalData('table_booking_details');
    }
  }

  onCheckDeclaration(event) {
    this.is_declaration_checked = event;
    this.is_order_try = false;

    if (this.is_declaration_checked) {
      if (this.is_order_try_online) {
        this.onPay();
        return;
      }
      else if (!this.is_order_try_online) {
        this.onPlaceOrder();
        return;
      }
      else if (this.settings.laundary_service_flow == 1) {
        this.bookServiceNow();
        return;
      }
    }
  }

  onCloseDeclaration(event) {
    this.is_declaration_checked = event;
    this.is_order_try = false;
  }


  handleUpdatedCart(event) {
    console.log('handling updated cart')
  }


  getCurrency() {
    this.util.getSelectedCurrency.subscribe((res: any) => {
      if (res) {
        this.selected_currency = Object.assign({}, res);
        if (this.selected_currency.currency_name) {
          this.currency = this.selected_currency.currency_name;
        }
      }
    })
  }

  getOrderType() {
    this.orderTypeSubscription = this.util.getOrderTypeData.subscribe((res: any) => {
      if (res) {
        this.selected_order_type = (Number)(res);
        switch (this.selected_order_type) {
          case 0:
            this.onDelivery();
            break;
          case 1:
            this.onSelfPickup();
            break;
          case 2:
            this.onDining();
            break;
        }
      }
    })
  }


  ngOnDestroy() {
    if (!!this.settingSubscription) this.settingSubscription.unsubscribe();
    if (!!this.styleSubscription) this.styleSubscription.unsubscribe();
    if (!!this.cartSubscription) this.cartSubscription.unsubscribe();
    if (!!this.userSubscription) this.userSubscription.unsubscribe();
    if (!!this.themeSubscription) this.themeSubscription.unsubscribe();
    if (!!this.routeSubscription) this.routeSubscription.unsubscribe();
    if (!!this.orderTypeSubscription) this.orderTypeSubscription.unsubscribe();

    // $("#scheduleDateModal").modal('hide');
  }

}
