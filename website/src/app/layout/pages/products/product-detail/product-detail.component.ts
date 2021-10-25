import { WINDOW } from './../../../../services/window/window.service';
import { SeoService } from './../../../../services/seo/seo.service';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { StyleConstants } from './../../../../core/theme/styleConstants.model';
import { ProductModel } from './../../../../shared/models/product.model';
import { ApiUrl } from './../../../../core/apiUrl';
import { UserService } from './../../../../services/user/user.service';
import { MessagingService } from './../../../../services/messaging/messaging.service';
import { UtilityService } from './../../../../services/utility/utility.service';
import { HttpService } from './../../../../services/http/http.service';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { AppHandler } from './../../../../shared/models/appHandler.model';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { CartService } from './../../../../services/cart/cart.service';
import { LocalizationPipe } from './../../../../shared/pipes/localization.pipe';
import { GlobalVariable } from './../../../../core/global';
import { trigger, transition, style, animate } from '@angular/animations';
import Drift from 'drift-zoom';
import { AddOnComponent } from './../../../../layout/shared/product/components/add-on/add-on.component';
import { QuestionsComponent } from './../../../shared/layout-shared/components/questions/questions.component';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import value from '*.json';

// declare const $;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: [
    './product-detail.component.scss',
    '../../../shared/layout-shared/components/compare-products/compare-products.component.scss'
  ],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ProductDetailComponent implements OnInit, OnDestroy {

  @ViewChild('productImage', { static: false }) productImage: ElementRef;

  private subscription: Subscription;
  private getDataSubscribe: Subscription;
  styleSubscription: Subscription;
  cartSubscription: Subscription;
  settingsSubscription: Subscription;
  userSubscription: Subscription;

  handler: AppHandler;
  detail: any = {
    variants: [],
    selectedQuantity: 0
  };
  image: string = '';
  mainCategoryIndex: number = 0;
  categoryName: string = '';
  showQuantity: boolean = false;
  showSupplier: boolean = false;
  allCheckOrNot: any = [];

  brandId: string = '';
  productId: number = 0;
  supplierBranchId: number = 0;
  variantsArray: any = [];
  cart: any[] = [];
  unitId: string = '';
  setting: any = {};
  offer: number;
  colorPattern: RegExp;
  selectedLocation: any = {};
  currency: string = '';
  style: StyleVariables;
  btnInverse: StyleConstants;
  btn: StyleConstants;
  categoryId: any;
  supplier: any;

  title: string = "Product detail";
  description: string = '';
  avgRating: number = 0;
  loggedIn: boolean = false;
  disableAdd: boolean = false;
  timeInterval: number = 0;
  perValue: string = '';
  settings: AppSettings;
  selectedIndex: number = 0;
  responseVariants: any = [];
  firstVariantType: number = 0;

  isLoading: boolean = false;
  isBuyNow: boolean = false;
  similarProducts: Array<any> = [];

  showSize: boolean = false;
  selectedSize: string = "";
  is_special_instruction: boolean = false;
  is_special_instruction_added: boolean = false;
  special_instructions: string = '';
  selectedVaraints: Array<any> = []

  isTabActive = 0;
  tabContent = '';
  // slideConfig = {
  //   'slidesToShow': 3,
  //   'slidesToScroll': 3,
  //   'dots': false,
  //   'arrows': true,
  //   'infinite': false
  // };


  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true,
    "arrows": false,
    "infinite": false,
    "autoplay": true,
    "autoplaySpeed": 3000
  };


  public compareProductList: any = [];
  public isCompare: boolean;
  public isShowCompareBtn: boolean;
  public openImageViewer: boolean;
  public imageToView: string;
  public canCompareProd: boolean;
  public randomProduct: any;


  public selected_currency: any;
  public detailObj: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    public util: UtilityService,
    private message: MessagingService,
    private router: Router,
    public dialogService: DialogService,
    private user: UserService,
    private cartService: CartService,
    private localization: LocalizationPipe,
    private translate: TranslateService,
    private seo: SeoService,
    @Inject(DOCUMENT) private document,
    @Inject(WINDOW) private window: Window
  ) {

    this.style = new StyleVariables();
    this.btnInverse = new StyleConstants();
    this.btn = new StyleConstants();
    this.currency = GlobalVariable.CURRENCY;

    this.userSubscription = this.user.currentUser
      .subscribe(user => {
        if (!!user && user['access_token']) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      });
  }

  ngOnInit() {
    this.styleSubscription = this.util.getStyles
      .subscribe(style => {
        this.style = style;
        this.btnInverse.color = style.defaultColor;
        this.btnInverse.backgroundColor = '#ffffff';
        this.btnInverse.borderColor = style.defaultColor;
        this.btn.color = '#ffffff';
        this.btn.backgroundColor = style.primaryColor;
        this.btn.borderColor = style.primaryColor;
      });

    this.settingsSubscription = this.util.getSettings
      .subscribe((settings: AppSettings) => {
        if (settings) {
          this.timeInterval = settings['interval'];
          this.settings = settings;
        }
      });

    this.cartSubscription = this.util.getCart.subscribe(cart => {
      if (cart) {
        this.cart = cart;
        let product = this.cart.find(item => item.id == this.detail.id)
        if (product) {
          this.detail.selectedQuantity = product.selectedQuantity
        }
      }
    });
    this.makeSubscribe();


  }

  makeSubscribe() {
    this.getDataSubscribe = this.util.callGetData.
      subscribe((data) => {
        if (data) {
          this.subscribeRoute();
          this.selectedLocation = this.util.getLocalData('locationObj', true);
        }
      });
    this.getDataSubscribe = this.util.getSettings.
      subscribe((data) => {
        if (data) {
          this.setting = data;
        }
      });
  }

  // subscribe route
  subscribeRoute() {
    this.subscription = this.route.queryParams.subscribe(params => {
      if (params.f) {
        params = this.util.decryptData(params.f);
        this.productId = parseInt(params.productId);
        this.supplierBranchId = parseInt(params.supplierBranchId);
        this.categoryId = parseInt(params.category);
        if (params.offer) {
          this.offer = parseInt(params.offer);
        }
        this.getProductDetail();
      }
    });
  }

  addToRecentlyAdded() {
    if (this.loggedIn) {
      this.http.putData(ApiUrl.updateRecentlyViewed, { productId: this.productId })
        .subscribe(respone => { });
    }
  }

  getProductDetail(product_id?: number) {
    let obj = {
      languageId: this.util.handler.languageId,
      productId: product_id ? product_id : this.productId,
      supplierBranchId: this.supplierBranchId,
      offer: this.offer ? this.offer : 0,
      latitude: this.util.handler.latitude,
      longitude: this.util.handler.longitude
    };
    this.isLoading = true;
    this.http.postData(ApiUrl.getProductDetail, obj, false)
      .subscribe(response => {
        if (!!response && response.data) {
          this.window.scrollTo(0, 0);
          this.addToRecentlyAdded();
          this.similarProducts = response.data.similarProduct;
          if (this.similarProducts && this.similarProducts.length) {
            this.randomProduct = this.similarProducts[Math.floor(Math.random() * this.similarProducts.length)];
          }
          this.clearCompareData();

          this.brandId = response.data.brand_id;
          if (product_id) {
            if (!response.data.display_price || response.data.display_price < 0) {
              this.message.alert('info', `${this.localization.transform('product')} ${this.translate.instant('Quantity Not Available')}!`);
            } else {
              this.setValueToDetail(response.data);
            }
          } else {
            this.detail = response.data;
            this.detailObj = this.detail;
            this.seo.updateTitle(`${this.detail.name} | ${GlobalVariable.SITE_NAME}`);
            this.seo.updateDescription(this.detail.product_desc);

            this.detail.fixed_price = Number(this.detail.fixed_price).toFixed(2);
            if (response.data.variants.length) {
              this.responseVariants = response.data.variants;
              this.makeVariant(response.data);
            } else {
              this.detail.selectedQuantity = 0;
              this.showQuantity = true;
              this.productId = this.detail.id;
              this.unitId = this.productId.toString();
              this.checkUintIdExist();
            }
            this.setQuantity();
            this.image = this.detail.image_path[0];
            if (this.settings.isProductCustomTabDescriptionEnable) {
              this.initTab();
            }
          }
          this.checkStock(response.data);
          if (this.settings.app_type == 2 && this.settings.disable_zoom_in_product == 0 && this.setting.selected_template != 4) this.initializeImageMagnifier();
        }
        this.isLoading = false;
        this.getCurrency();
      }, (err) => this.isLoading = false);
  }

  initTab() {
    for (let i = 0; i < this.settings.productCustomTabDescriptionLabel.length; i++) {
      let col = this.settings.productCustomTabDescriptionLabel[i];
      if (!!this.detail[col.labelDBColName]) {
        this.isTabActive = i + 1;
        this.tabContent = this.detail[col.labelDBColName];
        break;
      }
    }
  }

  setTabContent(content, flag) {
    this.isTabActive = flag;
    this.tabContent = content;
  }

  checkStock(product) {
    this.detail.isOutOfStock = false;
    let quantity = !!product.quantity ? (Number(product.quantity) || 0) : 0;
    let purchaseQuantity = !!product.purchased_quantity ? (Number(product.purchased_quantity) || 0) : 0;

    if (purchaseQuantity >= quantity) {
      this.detail.isOutOfStock = true;
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  initializeImageMagnifier() {
    (async () => {
      await this.delay(500);
      this.productImage.nativeElement['dataset']['zoom'] = this.image;
      new Drift(this.document.querySelector(".drift-trigger"), {
        paneContainer: this.document.querySelector(".drift-detail"),
        inlinePane: 900,
        inlineOffsetY: -85,
        containInline: true,
        hoverBoundingBox: true
      });
    })();
  }

  setQuantity() {
    if (this.detail['price_type']) this.detail['fixed_price'] = this.detail['hourly_price'][0].price_per_hour;
    if (this.cart.length) {
      this.cart.forEach(cartProduct => {
        if (cartProduct.productId == this.detail.id) {
          this.detail['selectedQuantity'] = cartProduct['selectedQuantity'];
          if (this.detail['price_type']) {
            this.detail['fixed_price'] = cartProduct['fixed_price'];
          }
        }
      });
    }
  }

  makeVariant(responseData) {
    let data = {}, colorMap = {};
    this.categoryName = responseData.variants[0].variant_name;
    this.firstVariantType = responseData.variants[0].variant_type

    if (this.settings.not_all_variant_required == 0) {
      responseData.variants[0].variant_values.forEach(value => {
        data[value.product_id] = {
          subCat: [],
          name: value.variant_value.toLowerCase(),
          data: value,
          isClicked: false
        };
      });
    } else {
      responseData.variants.forEach(col => {
        col.variant_values.forEach(value => {
          data[value.product_id] = {
            subCat: [],
            name: value.variant_value.toLowerCase(),
            data: value,
            isClicked: false
          };
        });
      });
    }

    for (let i = 1; i < responseData.variants.length; i++) {
      responseData.variants[i].variant_values.forEach(value => {
        value.isClicked = false;
        if (`${responseData.variants[i].variant_name}+${value.product_id}` in colorMap) {
          if (data[value.product_id].subCat[colorMap[`${value.color}+${value.product_id}`]]) data[value.product_id].subCat[colorMap[`${value.color}+${value.product_id}`]].values.push(value);
        } else {
          colorMap[`${responseData.variants[i].variant_name}+${value.product_id}`] = data[value.product_id] ? data[value.product_id].subCat.length : 0;
          if (data[value.product_id]) {
            data[value.product_id].subCat[colorMap[`${responseData.variants[i].variant_name}+${value.product_id}`]] = {
              name: responseData.variants[i].variant_name,
              values: [value],
              isClicked: false,
              clickedId: '',
              [responseData.variants[i].variant_name]: colorMap[`${responseData.variants[i].variant_name}+${value.product_id}`]
            }
          }
        }
      });
    }

    let finalArray = [];
    let subCatMap = {};

    for (let value in data) {
      if (`${data[value].name}` in subCatMap) {
        if (finalArray[subCatMap[data[value].name]].subCat.length != 0) {
          finalArray[subCatMap[data[value].name]].subCat = this.util.findUnique(finalArray[subCatMap[data[value].name]].subCat, data[value].subCat);
        } else {
          finalArray[subCatMap[data[value].name]].subCat = data[value].subCat;
        }
      } else {
        subCatMap[data[value].name] = finalArray.length;
        finalArray[subCatMap[data[value].name]] = data[value];
      }
    }

    this.variantsArray = finalArray;
    console.log(this.variantsArray)

    // this.variantsArray.forEach(variant => {
    //   this.variantsArray
    // });
    // if (this.variantsArray.length == 1) {
    //   this.variantsArray[0].isClicked = true
    //   // console.log(this.variantsArray[0].subCat.length)
    //   // console.log(this.variantsArray[0].subCat[0].values.length)
    //   if (this.variantsArray[0].subCat.length == 1 && this.variantsArray[0].subCat[0].values.length == 1) {
    //     this.variantsArray[0].subCat[0].isClicked = true
    //     this.variantsArray[0].subCat[0].values[0].isClicked = true
    //   }
    // }

    this.detail.variants = JSON.parse(JSON.stringify(this.variantsArray));
  }

  replaceAllValue(index) {
    // if (this.settings.enable_food_varients) {
    //   return;
    // }
    this.selectedVaraints = []
    this.selectedVaraints.push(this.detail.variants[index])
    this.showQuantity = false;
    this.detail.variants = JSON.parse(JSON.stringify(this.variantsArray));
    this.detail.variants[index].isClicked = true;
    this.selectedSize = this.detail.variants[index].name;
    console.log(this.detail.variants[index])
    let values = []
    // this.detail.variants[index].subCat.forEach(subCat => {
    let subCat = this.detail.variants[index].subCat[0]
    if (subCat && subCat.values && subCat.values.length) {
      subCat.values = subCat.values.map(item => {
        item['productIds'] = []
        return item
      })
      for (let i = 0; i <= subCat.values.length - 1; i++) {
        let productIds = []
        subCat.values[i]['productIds'] = []
        let list = subCat.values.filter(item => item.variant_value == subCat.values[i].variant_value);
        if (list.length > 1) {
          list.forEach(item => {
            subCat.values[i].productIds.push(item.product_id)
            productIds.push(item.product_id)
          })
        } else {
          subCat.values[i].productIds.push(subCat.values[i].product_id)
        }
        if (subCat.values[i] != undefined)
          values.push(subCat.values[i])
        if (list.length > 1) {
          subCat.values = subCat.values.filter(item => item.variant_value != subCat.values[i].variant_value);
          i = -1

        }
      }
      this.detail.variants[index].subCat[0].values = values
      console.log(subCat.values)
      values = []
    }



    // })
    // this.detail.variants[index].subCat = values
    console.log(this.detail.variants)



    if (!this.detail.variants[index].subCat.length) {
      this.lastCallProductDetail(this.detail.variants[index].data);
    }
  }

  replaceNextValues(mainIndex, parentIndex, currentIndex, last, data) {
    // if (this.settings.enable_food_varients) {
    //   return;
    // }
    this.showQuantity = false;
    if (last) {
      this.makeIsClickedTrue(mainIndex, parentIndex, currentIndex);
      this.lastCallProductDetail(data);
    } else {
      this.makeIsClickedTrue(mainIndex, parentIndex, currentIndex);
      console.log(this.detail.variants[mainIndex].subCat[parentIndex + 1])
      let index = this.detail.variants[mainIndex].subCat[parentIndex + 1].values.findIndex(x => x.product_id == data.product_id);
      if (index == -1) {
        this.lastCallProductDetail(data);
      }
    }
  }

  makeIsClickedTrue(mainIndex, parentIndex, currentIndex) {
    // let array = JSON.parse(JSON.stringify(this.variantsArray[mainIndex].subCat[parentIndex].values));
    // this.detail.variants[mainIndex].subCat[parentIndex].values = array;
    this.detail.variants[mainIndex].subCat[parentIndex].values.forEach(element => {
      element.isClicked = false
    });
    this.detail.variants[mainIndex].subCat[parentIndex].values[currentIndex].isClicked = true;
  }


  validateVaraint(mainCategoryIndex, parent, i, last, value) {
    // if (this.detail.variants[mainCategoryIndex].subCat[parent] && this.detail.variants[mainCategoryIndex].subCat[parent - 1].productIds) {
    //   let text = this.detail.variants[mainCategoryIndex].subCat[parent].productIds
    // }
    if (parent != 0 && this.detail.variants[mainCategoryIndex].subCat[last ? parent : parent - 1].values.find(item => item.isClicked == true)) {
      if (parent != 0 && this.detail.variants[mainCategoryIndex].subCat[last ? parent : parent - 1].values.find(item => item.isClicked == true)) {
        let parentVariant = this.detail.variants[mainCategoryIndex].subCat[parent - 1].values.find(item => item.isClicked == true)

        // if(this.detail.variants[mainCategoryIndex].subCat[parent - 1].productIds && this.detail.variants[mainCategoryIndex].subCat[parent - 1].productIds.length && this.detail.variants[mainCategoryIndex].subCat[parent - 1].productIds.includes(value.product_id)) {
        //   return true 
        // } else false

        if (parentVariant.productIds && parentVariant.productIds.length && parentVariant.productIds.find(item => item == value.product_id)) {
          return true
        } else if (parentVariant.product_id == value.product_id) {
          return true
        } else return false
      } else return false
    } else return true
  }


  lastCallProductDetail(data) {
    this.unitId = data.unid;
    this.productId = data.product_id;
    this.getProductDetail(data.product_id);
  }

  decreaseValue(): void {
    if (this.settings.app_type == 1) {
      this.removeProduct(this.detail);
      return;
    }
    if (this.detail.selectedQuantity <= 0) {
      return;
    }

    this.detail.selectedQuantity -= 1;
    this.checkAdd();
  }

  increaseValue() {
    if (this.settings.app_type == 1) {
      this.addProduct(this.detail);
      return;
    }
    if (this.detail.variants && this.detail.variants.length) {
      if (!this.unitId || this.unitId == this.detail.id) {
        this.message.alert('info', this.translate.instant('Please Choose / Select Variant First'));
        return;
      }
    }
    if (this.disableAdd) {
      return;
    }
    if (this.detail.selectedQuantity >= (Number(this.detail.quantity) - Number(this.detail.purchased_quantity))) {
      this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
      return;
    }
    this.detail.selectedQuantity += 1;
    this.checkAdd();
  }


  checkAdd() {
    if (this.detail.variants && this.detail.variants.length) {
      if (!this.unitId || this.unitId == this.detail.id) {
        this.message.alert('info', this.translate.instant('Please choose / select variant first'));
        this.isBuyNow = false;
        return;
      }
    }

    let key = this.setting.cart_flow.toString();
    let cart = this.cart ? this.cart.slice() : [];
    if (cart.length) {
      if (key == '0') {
        let msg = `Can't Add More Than One Item Or Quantity!`;
        this.openConfirm(msg);
        this.isBuyNow = false;
        return;
      } else if (key == '1') {
        let index = cart.findIndex(x => x.unitId == this.unitId);
        if (index == -1) {
          let msg = `${this.translate.instant("Can't Add More Than One")} ${this.localization.transform('product')}!`;
          this.openConfirm(msg);
          this.isBuyNow = false;
          return;
        } else {
          this.addToCartValues();
        }
      } else if (key == '2') {
        let index = cart.findIndex(x => x.unitId == this.unitId);
        if (index !== -1) {
          let msg = `${this.translate.instant("Can't Add More Than One Quantity")}!`;
          this.openConfirm(msg);
          this.isBuyNow = false;
          return;
        } else {
          this.addToCartValues();
        }
      } else {
        this.addToCartValues();
      }
    } else {
      this.addToCartValues();
    }
  }

  openConfirm(msg) {
    this.message.confirm(`${this.translate.instant('Clear Your Cart')}`, msg).then(data => {
      if (data.value) {
        this.clearCart();
      }
    });
  }

  clearCart() {
    this.detail.selectedQuantity = 0;
    this.util.setCart([]);
    this.addToCartValues();
  }

  addToCartValues() {
    if (this.detail.adds_on && this.detail.adds_on.length) {
      return this.openAddOnDialog(this.detail);
    }

    if (this.cart.length) {
      if (this.cart[0].supplier_id != this.detail.supplier_id && this.settings.vendor_status == 0) {
        this.message.confirm(`${this.translate.instant('Add This Item To Cart')}`, `${this.translate.instant('Existing Items Will Be Removed From Cart As Your Cart Has Items Of Different')} ${this.localization.transform('supplier')}!`)
          .then(result => {
            if (result.value) {
              this.cart = [];
              this.addTocart();
            } else {
              this.isBuyNow = false;
              return;
            }
          });
      } else {
        const value = this.cart.findIndex(x => x.unitId == this.unitId);
        if (value > -1) {
          this.detail.selectedQuantity = this.detail.selectedQuantity;
          this.cart[value].selectedQuantity = this.detail.selectedQuantity;
          if (this.cart[value]['selectedQuantity'] <= 0) {
            this.cart.splice(value, 1);
          }
          this.hourlyPrice(value);
          this.util.setCart(this.cart);
          if (this.isBuyNow) {
            this.router.navigate(['/cart/list']);
          }
        } else {
          this.addTocart();
        }
      }
    } else {
      this.addTocart();
    }
  }

  getCartVarients(productId: number) {
    let variantsArray = [];
    this.responseVariants.forEach((variant) => {
      variantsArray.push(...variant.variant_values);
    });

    return variantsArray.filter(variant => variant.product_id == productId);
  }

  addTocart() {
    this.detail.handingCharges = this.detail.handling_admin + this.detail.handling_supplier;
    this.detail.unitId = this.unitId;
    this.detail.categoryId = this.categoryId ? this.categoryId : this.detail['category_id'];
    this.hourlyPrice(-1);
    if (this.detail.selectedQuantity > (Number(this.detail.quantity) - Number(this.detail.purchased_quantity))) {
      this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
      return;
    }
    this.detail['selectedQuantity'] = this.detail['selectedQuantity'] || 1;
    let cart = new ProductModel();
    for (let data in cart) {
      cart[data] = this.detail[data];
    }
    cart['cartVariants'] = this.getCartVarients(this.productId);
    cart.productId = this.productId.toString();
    cart.image_path = cart.image_path.length ? cart.image_path[0] : null;
    this.cart.push(cart);
    this.util.setCart(this.cart);
    if (this.isBuyNow) {
      this.router.navigate(['/cart/list']);
    }
  }

  hourlyPrice(index: number) {
    if (this.detail['price_type']) {
      if (this.detail['is_product']) {
        this.timeInterval = 60;
      }
      if (this.detail['selectedQuantity'] * this.timeInterval >= (parseInt(this.detail['hourly_price'][this.detail['hourly_price'].length - 1]['max_hour']))) {
        this.disableAdd = true;
      } else {
        this.disableAdd = false;
      }
      this.detail['hourly_price'].forEach(element => {
        if (this.detail['selectedQuantity'] * this.timeInterval >= element['min_hour'] && this.detail['selectedQuantity'] * this.timeInterval < element['max_hour']) {
          this.detail['fixed_price'] = element['price_per_hour'];
          if (index > -1) {
            this.cart[index]['fixed_price'] = element['price_per_hour'];
          }
        }
      });
    }
  }

  setValueToDetail(data) {
    this.detail.quantity = data.quantity;
    this.detail.purchased_quantity = data.purchased_quantity;
    this.detail.display_price = data.display_price;
    this.detail.image_path = data.image_path;
    this.detail.fixed_price = Number(data.fixed_price).toFixed(2);
    this.detail.discount = data.discount;
    this.detail.product_desc = data.product_desc;
    this.detail.price_type = data.price_type;
    this.detail.handling_supplier = data.handling_supplier;
    this.detail.handling_admin = data.handling_admin;
    this.detail.delivery_charges = data.delivery_charges;
    this.detail.selectedQuantity = 0;
    this.detail.id = data.id;
    this.showQuantity = true;
    this.checkUintIdExist();
  }

  checkUintIdExist() {
    if (this.cart.length) {
      const value = this.cart.findIndex(x => x.unitId == this.unitId);
      if (value > -1) {
        this.detail.selectedQuantity = this.cart[value].selectedQuantity;
      }
    }
  }

  rateProduct() {
    if (this.loggedIn) {
      let obj = {
        productId: this.detail['id'],
        supplierBranchId: this.detail['supplier_branch_id']
      }
      this.router.navigate(['orders/rating'], { queryParams: obj });
    } else {
      this.message.alert('warning', `${this.translate.instant('Please Login To Continue')}!`);
    }
  }

  viewSupplier(detail) {
    this.router.navigate(['/supplier', 'supplier-detail'],
      {
        queryParams: {
          sup_id: detail['supplier_id'],
          branch_id: detail['supplier_branch_id'],
          cat_id: this.categoryId,
        }
      });
  }

  locationToggle() {
    this.util.locationToggle.next(true);
  }

  wishlist(status) {
    if (!this.loggedIn) {
      this.message.alert('warning', 'please login first');
      return;
    }
    let param_data = {
      status: +status,
      product_id: this.detail.id
    }
    this.http.postData(ApiUrl.addToWishlist, param_data, true)
      .subscribe(response => {
        if (!!response && response.data) {
          this.message.toast('success', `${this.localization.transform('product')} ${this.translate.instant('Has Been Successfully')} ${status ? this.translate.instant('Added To') : this.translate.instant('Removed From')} ${this.localization.transform('wishlist')}`);
          this.detail.is_favourite = status;
        }
      });
  }

  onBuyNow() {
    this.isBuyNow = true;
    this.checkAdd();
  }

  /********* Open Add On Dialog *********/

  openAddOnDialog(product) {
    const dialogRef = this.dialogService.open(AddOnComponent, {
      header: product['name'],
      width: '45%',
      showHeader: false,
      // contentStyle: { "max-height": "350px", "overflow": "auto" },
      transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      data: {
        product: product,
        addOnItems: product['adds_on']
      }
    })

    dialogRef.onClose.subscribe(() => {
      if (product.customization && product.customization.length) {
        this.router.navigate(['/cart/list']);
      }
    })
  }

  removeProduct(product) {
    if (product['customization'] && product['customization'].length) {
      this.openAddOnDialog(product);
    } else {
      this.cartService.removeFromCart(product)
    }
  }

  addProduct(product) {

    if (product['adds_on'] && product['adds_on'].length) {
      this.openAddOnDialog(product);
      return;
    }
    if (this.settings.show_variants_in_cart) {
      //   this.addTocart();
      // } else {
      let item = new ProductModel();
      for (let data in item) {
        item[data] = product[data];
      }
      item['cartVariants'] = this.getCartVarients(this.productId);
      item['productId'] = String(this.productId)
      item['category_id'] = this.detail.category_id
      this.cartService.addToCart(item);
    }
  }

  onImageClick(img) {
    this.image = img;
    this.productImage.nativeElement['dataset']['zoom'] = this.image;
  }

  toAgentList() {
    const url: any = this.router.url;
    this.util.setRedirectUrl(url);

    if (this.detail['price_type'] && !this.detail.selectedQuantity) {
      this.detail.selectedQuantity += this.detail.duration / this.timeInterval;
    }

    this.util.setLocalData('selected_service', this.detail, true);

    let params = {
      isPkg: '0',
      service_ids: this.detail.id
    };
    // params['date_time'] = moment().unix();
    this.router.navigate(['/cart/agent'], {
      queryParams: params
    });
  }

  onServiceAddOrRemove(service: any, value: number): void {
    if (value < 0 && service.selectedQuantity <= 0) {
      return;
    }

    if (service.selectedQuantity * this.timeInterval >= service.maxHour && value > 0) {
      this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
      return;
    }

    if (service['price_type']) {
      if (value > 0)
        service.selectedQuantity += service.duration / this.timeInterval;
      else
        service.selectedQuantity -= service.duration / this.timeInterval;
    } else {
      if (value > 0) {
        service.selectedQuantity = ++service.selectedQuantity;
      } else {
        service.selectedQuantity = --service.selectedQuantity;
      }
    }
    this.cartService.calculateProductHourlyPrice(service);
  }

  openQuestions(service): void {
    const dialogRef = this.dialogService.open(QuestionsComponent, {
      width: '60%',
      showHeader: false,
      transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      data: {
        cat_id: service['detailed_sub_category_id'] || service['sub_category_id'] || service['categories_id'] || service['category_id'],
      }
    });

    dialogRef.onClose.subscribe((navigate: boolean) => {
      if (navigate) {
        this.toAgentList();
      }
    });
  }

  onBookNow() {
    if (!this.loggedIn) {
      this.message.alert('info', `${this.translate.instant('Please Login First')}!`);
      return;
    }

    if (!this.util.getLocalData('ques_data') && this.detail.is_question) {
      // this.util.clearLocalData('ques_data');
      this.cartService.emptyCart();
      this.openQuestions(this.detail);
    } else {
      this.toAgentList();
    }
  }

  goToCart() {
    this.router.navigate(['/cart/list']);
  }

  onComparePrice() {
    this.canCompareProd = !this.canCompareProd;
    this.isShowCompareBtn = !this.isShowCompareBtn;
    this.compareProductList.push(Object.assign({}, this.detail));
  }

  selectForCompare(event) {
    if (event == null) {
      this.clearCompareData();
      this.showHideCompareBtn();
      return;
    }
    if (this.compareProductList.length >= 3 && event.event.target.checked) {
      this.message.toast("error", "You can compare only 3 products");
      event.event.preventDefault()
      return
    }
    var existProduct = this.compareProductList.some(x => x.product_id == event.product.product_id);
    if (!existProduct) {
      this.compareProductList.push(event.product);
      this.showHideCompareBtn();
    }
    else {
      this.compareProductList = this.compareProductList.filter(function (obj) {
        return obj.product_id != event.product.product_id
      });
      this.showHideCompareBtn();
    }
  }
  showHideCompareBtn() {
    if (this.compareProductList.length == 0) {
      this.isCompare = false;
    }
    if (this.compareProductList.length > 1) {
      this.isShowCompareBtn = true;
    }
    else {
      this.isShowCompareBtn = false;
    }
  }
  onCompareProducts() {
    if (this.compareProductList.length <= 0) {
      this.message.toast("error", "Please select product");
      return;
    }
    if (this.compareProductList.length < 2) {
      this.message.toast("error", "Please select atleast 1 products");
      return;
    }
    this.isCompare = true;
    let el = this.document.getElementById('compare_prod');
    el.scrollIntoView({ behavior: "smooth" });

  }
  compareAddCart(event) {
    this.detail = event;
    this.onBuyNow();
  }
  clearCompareData() {
    this.compareProductList = [];
    this.canCompareProd = false;
    this.isShowCompareBtn = false;
  }
  showImage(image) {
    this.imageToView = image;
    this.openImageViewer = true;
  }

  closeImageViewer(event) {
    this.openImageViewer = event;
  }
  trackByImage_pathFn(id, index) {
    return index;
  }
  trackByVariantDetailsFn(id, index) {
    return index;
  }
  trackByVDDetailsn(id, index) {
    return index;
  }
  trackByDataValuesFn(id, index) {
    return index;
  }
  trackBySPFn(id, index) {
    return index;
  }
  trackBySimilarProductFn(id, index) {
    return index;
  }
  trackByUtilDataFn(id, index) {
    return index;
  }
  trackByUtilImageDataFn(id, index) {
    return index;
  }
  trackByVariantsDFn(id, index) {
    return index;
  }
  trackByDetailDataFn(id, index) {
    return index;
  }
  trackByVariantsDetailsDataFn(id, index) {
    return index;
  }
  trackByDataValueFn(id, index) {
    return index;
  }
  trackByImgPathDataFn(id, index) {
    return index;
  }
  trackByVDFn(id, index) {
    return index;
  }
  trackByVariantsDetailsFn(id, index) {
    return index;
  }
  trackByValuesDataFn(id, index) {
    return index;
  }
  trackByCustomTabDescFn(id, index) {
    return index;
  }
  trackBySimilarDataFn(id, index) {
    return index;
  }
  trackByUtilImageFn(id, index) {
    return index;
  }
  trackByImagePathFn(id, index) {
    return index;
  }
  trackByVariantsDataFn(id, index) {
    return index;
  }
  trackByVariantsFn(id, index) {
    return index;
  }
  trackByValueDataFn(id, index) {
    return index;
  }
  trackBySettingsFn(id, index) {
    return index;
  }
  trackByProductFn(id, index) {
    return index;
  }
  trackByImgDataFn(id, index) {
    return index;
  }

  showSpecialInstruction(item) {
    this.special_instructions = item.special_instructions || this.special_instructions;
    this.is_special_instruction = true;
  }

  onProcessSpecialInstruction(event) {
    for (var i in this.cart) {
      if ((Number)(this.cart[(Number)(i)].productId) == this.detail.id) {
        this.cart[i]['special_instructions'] = event;
        this.is_special_instruction_added = true;
        this.special_instructions = event;
        break;
      }
    }
    this.util.setCart(this.cart);
    this.is_special_instruction = false;
  }

  getCurrency() {
    this.util.getSelectedCurrency.subscribe((res: any) => {
      if (res) {
        this.selected_currency = res;
        if (this.detail) {
          var obj = Object.assign({}, this.detailObj);
          obj.display_price = parseFloat(obj.display_price) * this.selected_currency.conversion_rate;
          obj.fixed_price = parseFloat(obj.fixed_price) * this.selected_currency.conversion_rate;
          this.detail = Object.assign({}, obj);
          this.currency = this.selected_currency.currency_name;
        }
      }
    })
  }



  ngOnDestroy() {
    if (!!this.subscription) this.subscription.unsubscribe();
    if (!!this.getDataSubscribe) this.getDataSubscribe.unsubscribe();
    if (!!this.styleSubscription) this.styleSubscription.unsubscribe();
    if (!!this.cartSubscription) this.cartSubscription.unsubscribe();
    if (!!this.userSubscription) this.userSubscription.unsubscribe();
    // $("#img").modal('hide');
    let componentInstance = this.dialogService.dialogComponentRef;
    if (componentInstance) {
      componentInstance.destroy()
    }
  }

}
