import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild, ElementRef, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { AppSettings } from '../../../../../shared/models/appSettings.model';
import { UtilityService } from '../../../../../services/utility/utility.service';
import { CartPriceModel, PromoModel } from '../../../../../shared/models/cart-price.model';
import { CartService } from '../../../../../services/cart/cart.service';
import { HttpService } from '../../../../../services/http/http.service';
import { UserService } from '../../../../../services/user/user.service';
import { MessagingService } from '../../../../../services/messaging/messaging.service';
import { ApiUrl } from '../../../../../../app/core/apiUrl';
import { StyleConstants } from '../../../../../core/theme/styleConstants.model';
import { GlobalVariable } from './../../../../../core/global';
import { QuestionsModel } from './../../../../../shared/models/questions.model';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseAnalyticsService } from '../../../../../services/firebase-analytics/firebase-analytics.service';
import { Currency } from 'src/app/shared/models/apiKeys.model';
declare const $;

@Component({
  selector: 'app-cart-price-detail',
  templateUrl: './cart-price-detail.component.html',
  styleUrls: ['./cart-price-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPriceDetailComponent implements OnInit, OnChanges {

  deliveryType: number = 0;
  urgentPrice: number = 0;
  cart: Array<any> = [];

  saveBtn: StyleConstants;
  promoCode: string = '';
  promoModel: any = {};
  currency: string = "";
  is_voucher_applied: boolean = false;

  @ViewChild('closePromoCode', { static: false }) closePromoCode: ElementRef;
  @Input() delivery_charge: number = 0;
  @Input() is_dinin: number = 0;
  @Input() applyWalletDiscount: boolean = false;
  @Input() walletAmount: number = 0;
  @Input() style: StyleVariables;
  @Input() settings: AppSettings;
  @Input() loggedIn: boolean = false;
  @Input() selfPickup: any;
  @Input() activePlan: any;
  @Input() priceObj: CartPriceModel;
  @Input() questions: Array<QuestionsModel> = [];

  @Input() total_product_weight: number = 0;
  @Input() product_weight_list: any = [];

  @Input() is_out_network: boolean = false;
  @Input() rest_user_service_charges: any = [];

  @Input() table_booking_details: any;

  @Output() cartUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() priceDetail: EventEmitter<CartPriceModel> = new EventEmitter<CartPriceModel>();

  //************ subscription ************/
  cartSubscription: Subscription;
  hide_tax: boolean = false
  public isPromoCodeList: boolean;
  public supplier_ids: string = "";
  public category_ids: string = "";

  public delivery_charge_with_check: number = 0;
  public is_any_in_network: boolean = false;

  public selected_currency: Currency = new Currency();

  constructor(
    private translate: TranslateService,
    private util: UtilityService,
    private cartService: CartService,
    private http: HttpService,
    private user: UserService,
    private message: MessagingService,
    private fireBaseAnSvc: FirebaseAnalyticsService,
    private ref: ChangeDetectorRef,
  ) {
    this.style = new StyleVariables();
    this.saveBtn = new StyleConstants();
    this.currency = GlobalVariable.CURRENCY;
    this.ref.detach();
    setInterval(() => { this.ref.detectChanges(); }, 2000);
  }

  ngOnInit(): void {

    this.cartSubscription = this.util.getCart.subscribe(cart => {
      if (cart) {
        this.cart = cart;
        this.cart.forEach(product => {
          if (!this.supplier_ids.includes(product.supplier_id)) {
            this.supplier_ids += product.supplier_id + ','
          }

          if (!this.category_ids.includes(product.categoryId)) {
            this.category_ids += product.categoryId + ','
          }
        })
        this.getTotal();
      }
    });

    this.saveBtn.backgroundColor = this.style.primaryColor;
    this.saveBtn.borderColor = this.style.primaryColor;
    this.saveBtn.color = '#ffffff';

    if (this.settings.is_multicurrency_enable) {
      this.getCurrency();
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.saveBtn.backgroundColor = this.style.primaryColor;
    this.saveBtn.borderColor = this.style.primaryColor;
    this.saveBtn.color = '#ffffff';

    if ((!!changes.delivery_charge && !isNaN(changes.delivery_charge.currentValue))) {
      this.delivery_charge = changes.delivery_charge.currentValue;
      this.getTotal();
    }
    if ((changes.applyWalletDiscount != undefined || changes.applyWalletDiscount != null)) {
      this.applyWalletDiscount = changes.applyWalletDiscount.currentValue;
      this.getTotal();
    }
    if ((!!changes.walletAmount && !isNaN(changes.walletAmount.currentValue))) {
      this.priceObj.walletAmount = changes.walletAmount.currentValue;
    }
  }

  getTotal() {
    const promo: PromoModel = new PromoModel(this.promoModel);
    promo.code = this.promoCode;
    this.priceObj = new CartPriceModel({ ...this.priceObj, promo, walletAmount: this.walletAmount });

    console.log('this.cart', this.cart);

    if (this.cart && this.cart.length) {
      let totalAdminHandling = 0;
      let maxSupplierHandling = 0;
      let maxDeliveryCharges = 0;
      this.priceObj.amount = 0;
      for (let i = 0; i < this.cart.length; i++) {
        const productAmount = this.cartService.calulateProductPrice(this.cart[i]);
        if (!this.cart[i].is_out_network) {
          this.priceObj.amount += productAmount;
        }

        if (this.cart[i].is_liquor) {
          this.priceObj.bottle_deposit_price += this.cartService.calulateLiquorProductPrice(this.cart[i]);
          // this.cart[i].selectedQuantity * 0.10;
          console.log('this.priceObj.bottle_deposit_price', this.cart[i].selectedQuantity, this.priceObj.bottle_deposit_price);

          this.priceObj.plt_tax += (productAmount * this.settings.plt_liquor_tax) / 100;
        }

        if (maxDeliveryCharges < this.cart[i].delivery_charges) {
          maxDeliveryCharges = this.cart[i].delivery_charges;
        }

        if (this.cart[i].handling_admin && this.settings.disable_tax == 0) {
          totalAdminHandling += (productAmount * this.cart[i].handling_admin) / 100;
        }

        if(this.settings.enable_dynamic_vat_for_supplier_by_admin == 1 && this.settings.enable_product_tax_feature != 1 && this.cart[i].is_vat_applicable == 0) {
          this.hide_tax = true
          totalAdminHandling = 0
        } else {
          this.hide_tax = false
        }

        if (maxSupplierHandling < this.cart[i].handling_supplier) {
          maxSupplierHandling = this.cart[i].handling_supplier;
        }

        if (!this.cart[i].is_out_network) {
          this.is_any_in_network = true;
        }
        if(this.settings.enable_base_delivery_charge_on_vehicle_cat == 1) {
          this.priceObj.expectedDeliveryCharges = this.cart[0].estimated_delivery_charge
        }

        if(this.settings.enable_product_tax_feature == 1) {
          this.priceObj.handingCharges += this.cart[i].handingCharges
          this.priceObj.handlingAdmin += this.cart[i].handling_admin;

        }
      }


      this.calculateQuestionPrice();
      if (this.priceObj.questionPrice && this.settings.disable_tax == 0) {   // calculate taxes on question price (Addons Charges)
        totalAdminHandling += (this.priceObj.questionPrice * this.cart[0].handling_admin) / 100;
      }
      if(this.settings.enable_dynamic_vat_for_supplier_by_admin == 1 && this.settings.enable_product_tax_feature != 1 &&  this.cart[0].is_vat_applicable == 0) {
        this.hide_tax = true
        totalAdminHandling = 0
      } else {
        this.hide_tax = false
      }

      // if (this.settings.delivery_charge_type == 1) {
      //   this.delivery_charge = this.cart[0].radius_price;
      //   // this.addressDetail.address['delivery_charge'] = this.delivery_charge;
      // }


      if (this.settings.is_customized_commision_enable == 1) {
        totalAdminHandling = this.priceObj.minimum_cart_fee;
        if (this.priceObj.amount > this.priceObj.minimum_commission_amount) {
          totalAdminHandling = 0;
        }
      }
      if (this.settings.enable_min_order_amount_for_free_delivery == 1 && this.settings.min_order_amount_for_free_delivery <= this.priceObj.amount) {
        this.priceObj.deliveryCharges = 0;
      } else {
        this.priceObj.deliveryCharges = this.settings.app_type == 1 || (this.settings.app_type == 2 && this.settings.ecom_agent_module == 1) ? this.delivery_charge : (this.settings.app_type == 8 ? 0 : maxDeliveryCharges);
      }

      if(this.settings.enable_base_delivery_charge_on_vehicle_cat == 1) {
        this.priceObj.deliveryCharges = this.priceObj.expectedDeliveryCharges
      }
      this.priceObj.handlingAdmin += totalAdminHandling;
      this.priceObj.handlingSupplier = maxSupplierHandling;
      this.priceObj.handingCharges += totalAdminHandling;


      if(this.settings.tax_on_delivery_charges) {
        let texOnDeliveryCharges = 0;
        texOnDeliveryCharges = this.cart[0].delivery_charge_tax_type == 0 ? this.cart[0].delivery_charge_tax: (this.priceObj.deliveryCharges * this.cart[0].delivery_charge_tax)/100
        this.priceObj.handlingAdmin += texOnDeliveryCharges;
        this.priceObj.handingCharges += texOnDeliveryCharges;
      }



      // if (this.activePlan && this.activePlan.benefits && this.activePlan.benefits.length) {
      //   if (!!this.activePlan.benefits.find((benefit) => benefit.benefit_unique_id == 'FD_1')) {
      //     this.priceObj.deliveryCharges = 0;
      //   }
      // }
      if (this.activePlan) {
        if (this.priceObj.amount > this.activePlan.min_order_amount) {
          this.priceObj.deliveryCharges = 0;
        }
      }



      if (this.settings.is_delivery_charge_weight_wise_enable) {
        if (this.product_weight_list.length > 0) {
          var self = this;
          var availablePrice;
          this.product_weight_list.sort(function (a, b) { return b.weight - a.weight });
          this.product_weight_list.every(function (weight) {
            if (weight.weight <= self.total_product_weight) {
              availablePrice = weight;
              return false;
            }
            return true;
          });
          if (availablePrice) {
            this.priceObj.deliveryCharges = availablePrice.delivery_charge;
          }
          else {
            this.priceObj.deliveryCharges = this.settings.app_type == 1 || (this.settings.app_type == 2 && this.settings.ecom_agent_module == 1) ? this.delivery_charge : (this.settings.app_type == 8 ? 0 : maxDeliveryCharges);
          }
        }
      }
    }

    if (!!this.promoModel && !!this.promoModel.id) {
      if (this.priceObj.amount < this.promoModel['minOrder']) {
        if (this.cart && this.cart.length)
          this.message.toast('info', `${this.translate.instant('Your Cart Total Must Be Greater Than')} ${this.currency}${this.promoModel.minOrder}`);
        this.promoModel = null;

        this.applyDiscount();
      } else {
        this.calDiscountAmount();
      }
    } else {
      this.applyDiscount();
    }
  }

  private calDiscountAmount(): void {
    let cart_total: number = 0;
    let discount_amount: number = 0;

    this.is_voucher_applied = false;
    this.cart.forEach(product => {

      if (this.promoModel.discountType != 2) {
        if (this.promoModel['categoryIds'].length) {
          this.promoModel['categoryIds'].forEach(element => {
            if (element == product.categoryId) {
              cart_total += this.cartService.calulateProductPrice(product);
            }
          });
        } else if (this.promoModel['supplierIds'].length) {
          this.promoModel['supplierIds'].forEach(element => {
            if (element == product.supplier_id) {
              cart_total += this.cartService.calulateProductPrice(product);
            }
          });
        }
      }

      // if (element == product.productId) {
      //   cart_total += this.cartService.calulateProductPrice(product);
      // }

      if (this.promoModel.discountType === 2) {
        this.promoModel.discountPrice = 0;
        console.log('enterrrrr');

        if (this.promoModel.product_ids) {
          const productArray = this.promoModel.product_ids.split(',');

          // if (this.promoModel.discountType === 2) { // buy some get some free
          // this.cart.forEach((element,index) => {
          if (productArray.includes(typeof product.productId !== 'string' ? JSON.stringify(product.productId) : product.productId)) {
            if (product.selectedQuantity >= this.promoModel.promo_buy_x_quantity) {
              // tslint:disable-next-line: radix
              const productsFree = this.promoModel.promo_get_x_quantity - this.promoModel.promo_buy_x_quantity;
              let freeQuantity = Math.floor(product.selectedQuantity / productsFree) * productsFree;
              freeQuantity = (freeQuantity > this.promoModel.max_buy_x_get) ? this.promoModel.max_buy_x_get : freeQuantity;


              this.priceObj.freeQuantity = this.priceObj.freeQuantity + freeQuantity;
              // this.cart[index]['freeQuantity'] =  freeQuantity;
              product['freeQuantity'] = freeQuantity;
              this.promoModel.discountPrice += (product['freeQuantity'] * product.fixed_price);
              discount_amount = this.promoModel.discountPrice >= cart_total ? cart_total : this.promoModel.discountPrice;

            } else {
              product['freeQuantity'] = 0;
            }
          }
          // });
          // }

          if (this.priceObj.freeQuantity > 0) {
            this.is_voucher_applied = true;
          }
        }
      }
    });
    if (cart_total > 0) {
      if (this.promoModel.discountType) {
        discount_amount = cart_total * (this.promoModel.discountPrice / 100);
      } else {
        discount_amount = this.promoModel.discountPrice >= cart_total ? cart_total : this.promoModel.discountPrice;
      }
    }
    this.priceObj.discount = discount_amount > 0 ? discount_amount : 0;

    if (this.settings.is_enable_max_discount_value) {
      if (this.promoModel.max_discount_value > 0 && this.priceObj.discount > this.promoModel.max_discount_value) {
        this.priceObj.discount = this.promoModel.max_discount_value;
      }
    }
    this.applyDiscount();
  }

  serviceChargeCalculation() {
    if (this.settings.enable_flat_user_service_charge) {
      this.priceObj.flat_user_service_charges = [];
      this.priceObj.serviceCharge = 0;
      this.rest_user_service_charges.forEach(element => {
        var prods = this.cart.filter(x => x.supplier_id == element.supplier_id);
        element['product_amount'] = prods.reduce(function (a, b) {
          return a + (parseFloat(b.fixed_price) * parseInt(b.selectedQuantity))
        }, 0);
        if (element.is_user_service_charge_flat) {
          this.priceObj.flat_user_service_charges.push({ supplier_id: element.supplier_id, serviceCharge: element.user_service_charge });
          this.priceObj.serviceCharge += element.user_service_charge;
        }
        else {
          var perCharge = (element.user_service_charge / 100) * element.product_amount;
          this.priceObj.flat_user_service_charges.push({ supplier_id: element.supplier_id, serviceCharge: perCharge });
          this.priceObj.serviceCharge += perCharge;
        }
      });
    }
    else {
      if (this.settings.supplier_service_fee == 1 && this.priceObj.supplier_service_charge && this.settings.vendor_status == 0) {
        this.priceObj.serviceCharge = (this.priceObj.supplier_service_charge / 100) * this.priceObj.amount;
      } else if (this.settings.supplier_service_fee == 1 && this.rest_user_service_charges) {
        this.priceObj.serviceCharge = 0;
        let supplier_wise_data = this.util.groupBy(this.rest_user_service_charges, 'supplier_id');
        Object.values(supplier_wise_data).forEach((products: Array<any>) => {
          products.forEach(product => {
            const productAmount = this.cartService.calulateProductPrice(product);
            this.priceObj.serviceCharge += (product.user_service_charge / 100) * productAmount;
          });
        });
      }
    }
  }

  private applyDiscount(): void {
    this.serviceChargeCalculation();
    if (this.promoModel && this.promoModel.discountType === 2) {
      this.cart.forEach(ele => {
        if (!this.priceObj.freeQuantity || !this.is_voucher_applied) {
          ele.freeQuantity = 0;
        }
      });
      this.cartUpdated.emit(this.cart);
    }
    let subtotal = 0
    if (this.applyWalletDiscount && this.settings.payment_through_wallet_discount) {
      this.priceObj.walletDiscountAmount = (this.priceObj.amount / 100) * this.settings.payment_through_wallet_discount;
      if (this.priceObj.walletAmount >= this.priceObj.walletDiscountAmount) {
        subtotal = this.priceObj.amount - this.priceObj.walletDiscountAmount;
      } else {
        subtotal = this.priceObj.amount;
        // this.message.toast('info', `${this.translate.instant('Your Wallet Total Must Be Greater Than')} ${this.currency}${this.promoModel.minOrder}`);
      }
    } else {
      this.priceObj.walletAmount = 0;
      subtotal = this.priceObj.amount >= this.priceObj.discount ? this.priceObj.amount - this.priceObj.discount : 0;
    }
    this.priceObj.netTotal = subtotal + this.priceObj.questionPrice + this.priceObj.deliveryCharges + this.priceObj.handingCharges + this.priceObj.agent_tip + this.priceObj.serviceCharge + this.priceObj.slot_price;



    //To Display Calculations
    this.priceObj.displayNetTotal = this.priceObj.netTotal;
    if (!!this.priceObj.perProductLoyalityDiscount && !this.settings.loyality_discount_on_product_listing) {
      this.priceObj.displayNetTotal -= this.priceObj.productLoyaltyDiscountAmount;
    }
    if (this.priceObj.displayNetTotal >= this.priceObj.referral_amount) {
      this.priceObj.displayNetTotal -= this.priceObj.referral_amount
    }

    if (this.priceObj.appliedLoyaltyAmount && !this.settings.loyality_discount_on_product_listing) {
      if (this.priceObj.displayNetTotal >= this.priceObj.totalLoyaltyAmount) {
        this.priceObj.displayNetTotal -= this.priceObj.appliedLoyaltyAmount
      } else {
        this.priceObj.displayNetTotal = 0;
      }
    }

    if (this.settings.is_currency_exchange_rate == 1 && this.priceObj.currency_exchange_rate) {
      this.priceObj.displayNetTotal = this.priceObj.displayNetTotal * this.priceObj.currency_exchange_rate;
    }


    if (this.settings.enable_tax_on_total_amt && this.cart.length > 0) {
      this.priceObj.displayNetTotal -= this.priceObj.handlingAdmin;
      this.priceObj.handlingAdmin = (this.priceObj.displayNetTotal * this.cart[0].handling_admin) / 100;
      this.priceObj.handingCharges = this.priceObj.handlingAdmin;
      this.priceObj.displayNetTotal += this.priceObj.handingCharges;
    }

    if (this.is_out_network && !this.is_any_in_network) {
      this.priceObj.displayNetTotal -= this.priceObj.handingCharges;
      this.priceObj.handingCharges = 0;
      this.priceObj.handlingAdmin = 0;
    }

    if (this.priceObj.bottle_deposit_price) {
      this.priceObj.displayNetTotal += this.priceObj.bottle_deposit_price;
    }

    if (this.table_booking_details) {
      if (this.table_booking_details.table_booking_price) {
        if (!this.settings.table_book_mac_theme) {
          this.priceObj.netTotal += this.table_booking_details.table_booking_price;
        }
        this.priceObj.displayNetTotal = this.priceObj.netTotal;
      }
    }

    if (this.settings.enable_liquor_popup) {
      this.priceObj.netTotal += this.priceObj.plt_tax + this.priceObj.bottle_deposit_price;
      this.priceObj.displayNetTotal = this.priceObj.netTotal;
    }

    this.priceDetail.emit(this.priceObj);
  }

  restrictSpace($event) {
    return $event.keyCode == 32 ? false : true;
  }

  removePromoCode() {
    this.priceObj.discount = 0;
    this.is_voucher_applied = false;
    this.promoCode = ''
    this.applyDiscount();
  }

  submitPromoCode() {
    if (!this.loggedIn) {
      this.message.alert('warning', this.translate.instant('Please Login To Continue'));
      return;
    }
    if (this.promoCode.trim()) {

      let obj = {
        totalBill: this.priceObj.amount,
        supplierId: [],
        promoCode: this.promoCode.toUpperCase(),
        accessToken: this.user.getUserToken,
        categoryId: [],
        langId: this.util.handler.languageId
      }

      this.http.postData(ApiUrl.checkPromo, obj, false)
        .subscribe(response => {
          if (!!response && response.data) {
            this.fireBaseAnSvc.firebaseAnalyticsEvents('promo_code_used', 'promo_code_used');

            this.promoModel = response.data;
            this.priceObj.promo = new PromoModel(response.data);
            this.priceObj.promo.code = this.promoCode;
            if (this.priceObj.amount < response.data['minOrder']) {
              this.message.toast('info', `${this.translate.instant('Your Cart Total Must Be Greater Than')} ${this.currency}${this.promoModel.minOrder}`);
              this.clearPromo();
              return;
            }
            this.calDiscountAmount();
            if (this.priceObj.discount || this.priceObj.freeQuantity) {
              console.log('4444444');
              this.applyDiscount();
              this.message.toast('success', this.translate.instant('Promo Code Applied Successfully'));
            } else {
              this.clearPromo();
              this.message.toast('warning', this.translate.instant('Promo Code Not Applicable For This Cart'));
            }

            this.closePromoCode.nativeElement.className = 'promo-form collapse';
          }
        });
    } else {
      this.message.toast('error', this.translate.instant('Please Enter Promo Code'));
    }
  }

  clearPromo() {
    this.promoModel = null;
    this.priceObj.promo = new PromoModel();
    this.priceObj.promo.code = '';
  }

  onGiftCardSelect(gift: any) {
    this.clearPromo();
    this.priceObj.gift = gift;
    let cartTotal: number = 0;
    let discountAmount = 0
    this.cart.forEach(product => {
      cartTotal += this.cartService.calulateProductPrice(product);
    })

    if (cartTotal > 0) {
      discountAmount = this.priceObj.gift.price_type ? cartTotal * (this.priceObj.gift.percentage_value / 100) : this.priceObj.gift.price;
    }
    this.priceObj.discount = discountAmount > 0 ? discountAmount : 0;
    this.applyDiscount();
  }

  onGiftCardRemove() {
    this.priceObj.gift = {};
    this.priceObj.discount = 0;
    this.applyDiscount();
  }

  calculateQuestionPrice(): void {
    if (this.questions.length && this.settings.app_type == 8) {
      this.questions.forEach(question => {
        question.optionsList.forEach(option => {
          if (option.valueChargeType == 1) {
            this.priceObj.questionPrice += option.flatValue;
          } else {
            let percentageValue = (this.priceObj.amount * option.percentageValue) / 100;
            this.priceObj.questionPrice += percentageValue;
          }
        });
      });
    }
  }

  openPromoCodeList() {
    this.isPromoCodeList = true;
  }
  onItemSelectEvt(event) {
    this.promoCode = event.promoCode;
    this.isPromoCodeList = false;
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



  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

}
