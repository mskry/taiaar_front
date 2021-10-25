import { PaginationModel } from './../../../shared/models/pagination.model';
import { SeoService } from './../../../services/seo/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalVariable } from './../../../core/global';
import { Component, OnInit, OnDestroy, Inject, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StyleVariables } from './../../../core/theme/styleVariables.model';
import { UtilityService } from './../../../services/utility/utility.service';
import { HttpService } from './../../../services/http/http.service';
import { ApiUrl } from './../../../core/apiUrl';
import { AppSettings } from './../../../shared/models/appSettings.model';
import { MessagingService } from './../../../services/messaging/messaging.service';
import * as _ from 'underscore'
import { DateService } from './../../../services/date/date.service'
import { UserService } from './../../../services/user/user.service';
import { CartService } from './../../../../app/services/cart/cart.service';
import { WINDOW } from './../../../services/window/window.service';
import { DOCUMENT } from "@angular/common";
import { DialogService } from 'primeng/dynamicdialog';
import { LocalizationPipe } from './../../../shared/pipes/localization.pipe';
import * as moment from 'moment'
import { trigger, transition, style, animate } from '@angular/animations';
import { AddOnComponent } from '../../shared/product/components/add-on/add-on.component';
import { PrescriptionUploadComponent } from '../../shared/layout-shared/components/prescription-upload/prescription-upload.component';

@Component({
    selector: 'app-food-listing',
    templateUrl: './food-listing.component.html',
    styleUrls: ['./food-listing.component.scss'],
    animations: [
        trigger('fade', [
            transition('void => *', [
                style({ opacity: 0 }),
                animate('500ms ease-in-out', style({ opacity: 1 }))
            ])
        ])
    ]
})
export class FoodListingComponent implements OnInit, OnDestroy {

    styleSubscription: Subscription;
    settingsSubscription: Subscription;
    routeSubscription: Subscription;
    cartSubscription: Subscription;
    userSubscription: Subscription;
    getDataSubscription: Subscription;
    themeSubscription: Subscription;

    style: StyleVariables;
    settings: AppSettings;

    products: Array<any> = [];
    allProducts: Array<any> = [];
    supplierDetail: any = {};
    cart: Array<any> = [];

    currency: string = '';
    supplierId: string = '';
    branchId: string = '';
    search: string = '';
    tabOffset: number = 0;

    loggedIn: boolean = false;
    hoverIndex: number = -1;
    categoryIndex: number = 0;

    pagePosition: object = {};

    isDarkTheme: boolean = false;
    openChat: boolean = false;

    productstate: any = {
        hideSupplier: true
    }

    isLoading: boolean = true;

    category_names: string = '';
    tag_names: string = '';
    branchName: string = '';
    cat_nav_fixed: boolean = false;
    showBranches: boolean = false;
    // isBranch: boolean = false;
    isInfo : boolean = false;

    public schedulingData: {};
    public showScheduleTime: boolean;
    public currentUser: any = {};
    public isTbItem: boolean;

    public colClass = "col-md-12";
    public bannerImgHeight = "230px";

    public selected_category_id: number;

    clientCode: string = GlobalVariable.UNIQUE_ID;
    public category_list: any = [];

    pagination: PaginationModel;

    public is_dine_in: boolean = false;

    public isPromoCodeList: boolean = false;
    public supplier_ids: string = "";

    public isRatingReviews: boolean = false;
    public ratingReviews: any = [];

    public item_type: number = 0;
    public localTblBooking: any = null;

    public is_table_booking_try: boolean = false;
    public selected_supplier_for_table_booking: any = {};


    constructor(
        private translate: TranslateService,
        private util: UtilityService,
        private http: HttpService,
        private route: ActivatedRoute,
        private message: MessagingService,
        private user: UserService,
        public cartService: CartService,
        public dialogService: DialogService,
        private localization: LocalizationPipe,
        private dateService: DateService,
        private seo: SeoService,
        private router: Router,
        @Inject(DOCUMENT) private document,
        @Inject(WINDOW) private window: Window) {

        this.userSubscription = this.user.currentUser
            .subscribe(user => {
                this.currentUser = user;
                if (!!user && user['access_token']) {
                    this.loggedIn = true;
                    if (this.is_table_booking_try) {
                        this.openSchedulingModal(this.selected_supplier_for_table_booking);
                    }
                } else {
                    this.loggedIn = false;
                }
            });

        this.currency = GlobalVariable.CURRENCY;
        this.pagination = new PaginationModel();

    }

    @HostListener("window:scroll", [])
    onWindowScroll() {
        if (this.settings.enable_rest_pagination_category_wise) {
            if (Math.ceil(this.window.pageYOffset) >= 500) this.cat_nav_fixed = true;
            else this.cat_nav_fixed = false;
            return
        }
        if (this.settings.selected_template == 1 && this.products.length > 1) {
            if (Math.ceil(this.window.pageYOffset) >= 500) this.cat_nav_fixed = true;
            else this.cat_nav_fixed = false;
        }

        for (let key in this.pagePosition) {
            this.pagePosition[key] = this.document.getElementById(key)
                ? this.pagePosition[key] < (this.document.getElementById(key).offsetTop - 180) ? this.document.getElementById(key).offsetTop - 180 : this.pagePosition[key]
                : null;
        }

        const positions = Object.keys(this.pagePosition);
        const lastIndex = positions.length - 1;
        let deduction_pixels = this.settings.selected_template == 1 ? -60 : 620;
        const offset = this.window.pageYOffset - deduction_pixels;

        for (let index = 0; index < positions.length; index++) {
            if (index === 0) {
                if (this.pagePosition[`${positions[index]}`] !== undefined &&
                    offset < this.pagePosition[`${positions[index + 1]}`]) {
                    this.categoryIndex = index;
                    break;
                } else { continue; }
            } else if (index === lastIndex) {
                if (this.pagePosition[`${positions[lastIndex]}`] &&
                    offset > this.pagePosition[`${positions[lastIndex]}`]) {
                    this.categoryIndex = lastIndex;
                    break;
                } else {
                    continue;
                }
            } else {
                if (this.pagePosition[`${positions[index]}`]
                    && offset > this.pagePosition[`${positions[index]}`] &&
                    offset < this.pagePosition[`${positions[index + 1]}`]) {
                    this.categoryIndex = index;
                    break;
                }
            }
        }
    }

    ngOnInit() {
        this.styleSubscription = this.util.getStyles
            .subscribe((style: StyleVariables) => {
                this.style = style;
            });

        this.getSettings();

        this.cartSubscription = this.util.getCart.subscribe(cart => {
            if (cart) {
                this.cart = cart;
            }
        });

        this.themeSubscription = this.util.getDarkTheme.subscribe((darkTheme) => {
            this.isDarkTheme = darkTheme;
        });

        this.subscribeRoute();
    }

    getSettings() {
        this.settingsSubscription = this.util.getSettings
            .subscribe((settings: AppSettings) => {
                if (settings) {
                    this.settings = settings;
                    console.log(this.settings.enable_product_tax_feature)
                }
            });
    }

    /********* Route Subscription **********/
    subscribeRoute() {
        this.routeSubscription = this.route.queryParams
            .subscribe(params => {
                console.log(params)
                this.supplierId = params.supplierId ? params.supplierId : '';
                this.branchId = params.branchId ? params.branchId : '';
                this.branchName = params.branchName ? params.branchName : '';
                if (this.branchId) {
                    this.showBranches = false;
                }
                if (params.action == "tb_item") {
                    this.isTbItem = true;
                }
                if(params.message_id) {
                    this.openChat = true
                }
                else {
                    if (localStorage.getItem('table_booking_details')) {
                        this.util.clearLocalData('table_booking_details');
                    }
                }
                if (params['is_branches'] == 1) {
                    this.showBranches = true;
                    this.isLoading = false;
                } else {
                    this.isLoading = true;
                    this.getSupplierCategoryList();
                    setTimeout(() => {
                        this.getData();
                    }, 2000);
                }
            });
    }

    updateProduct(product) {
        product['avg_rating'] = Number.parseFloat(product['avg_rating']).toFixed(1);
        if (product.display_price != product.fixed_price) {
            product["discount"] = Math.round(
                ((product.display_price - product.fixed_price) / product.display_price) * 100
            );
        }

        if(this.settings.enable_product_tax_feature == 1) {
          console.log(product.fixed_price, product.handling_admin)
          product.fixed_price +=  product.handling_admin;
        }

        product["selectedQuantity"] = 0;
        if (this.cart.length) {
            this.cart.forEach(cartProduct => {
                if (cartProduct.productId == product.product_id) {
                    product['selectedQuantity'] = cartProduct['selectedQuantity'];
                    product['customization'] = cartProduct['customization'];
                }
            });
        }
        this.util.productPriceToFloat(product);
        product["discount"] = Math.round(((product.display_price - product.fixed_price) / product.display_price) * 100);
        if (this.settings.loyality_discount_on_product_listing == 1) {
            if (!!product['perProductLoyalityDiscount']) {
                product['isProductLoyalityDiscount'] = 1;
                product.fixed_price = product.fixed_price - (product['perProductLoyalityDiscount'] || 0);
            } else {
                product['isProductLoyalityDiscount'] = 0;
            }
        }
    }

    getData() {
        if (this.settings.enable_rest_pagination_category_wise) {
            this.getDetailsWithPaging();
        }
        else {
            this.getDetails();
        }
    }

    changeItemType() {
        this.getData();
    }

    getDetails() {
        this.isLoading = true;
        let param_data = {
            languageId: this.util.handler.languageId,
            supplier_id: this.supplierId,
            latitude: this.util.handler.latitude,
            longitude: this.util.handler.longitude
        }

        if (this.settings.food_list_pagination == 1) {
            param_data['offset'] = this.pagination.offset;
            param_data['limit'] = this.pagination.perPage;
        }
        if (this.settings.enable_non_veg_filter) {
            param_data['is_non_veg'] = this.item_type ? 2 : 0;
        }

        let api = '';
        if (this.settings.branch_flow == 1 && this.branchId) {
            param_data['supplier_branch_id'] = this.branchId;
            api = ApiUrl.getSupplierBranchProduct;
        } else {
            api = ApiUrl.getSupplierDetailProduct;
        }
        this.http.getData(api, param_data)
            .subscribe(response => {
                if (!!response && response.data) {
                    if (this.settings.food_list_pagination == 1) {
                        this.pagination.count = response.data.count;
                    }
                    this.allProducts = response.data.product;
                    this.supplierDetail = response.data.supplier_detail;

                    if (this.settings.enable_promo_code_list == 1) {
                        this.supplier_ids += this.supplierDetail.id + ','
                    }

                    if (this.supplierDetail.supplier_image.length >= 3 && this.settings.is_enable_multiple_banner) {
                        this.colClass = "col-md-8";
                        this.bannerImgHeight = "400px"
                    }
                    // if (this.settings.branch_flow == 1 && this.supplierDetail.is_multi_branch) {
                    //     this.showBranches = true;
                    // }
                    this.seo.updateTitle(`${this.supplierDetail.name} | ${GlobalVariable.SITE_NAME}`);
                    this.seo.updateDescription(this.supplierDetail.address);
                    if (this.settings.app_type == 1 && ([1, 3, 4].includes(this.settings.selected_template)) && !this.settings.show_tags_for_suppliers) {
                        let cat_names = [];
                        (this.allProducts).forEach(ct => {
                            cat_names.push(ct.sub_cat_name)
                        });
                        this.category_names = (cat_names.splice(0, 6)).join(', ');
                    }
                    if (this.settings.app_type == 1 && this.settings.show_tags_for_suppliers) {
                        this.tag_names = this.supplierDetail.supplier_tags && this.supplierDetail.supplier_tags.length ? (this.supplierDetail.supplier_tags).map(el => { return el.name }).splice(0, 6).join(', ') : '';
                    }

                    if (this.supplierDetail['supplier_image'].length) {
                        this.supplierDetail['supp_image'] = this.supplierDetail['supplier_image'][0];
                        this.supplierDetail.isVideo = (this.supplierDetail['supplier_image'][0].split('.').pop()).includes('mp4');
                    }
                    this.todaySupplierTimings();
                    if (!this.showBranches) {
                        this.allProducts.forEach(data => {
                            if (data.detailed_category_name && data.detailed_category_name.length) {
                                data.detailed_category_name = _.uniq((data.detailed_category_name).slice(), 'detailed_sub_category_id');
                                data.detailed_category_name.forEach(cat => {
                                    cat['value'] = [];
                                    data.value.map(product => {
                                        if (product.detailed_sub_category_id == cat.detailed_sub_category_id) {
                                            this.updateProduct(product);
                                            cat['value'].push(product);
                                        }
                                    });
                                });
                            } else {
                                data.value.map(product => {
                                    this.updateProduct(product);
                                });
                            }
                        });

                        this.products = this.allProducts.slice();
                    }

                    this.initialPagePosition();
                    this.isLoading = false;

                    this.is_dine_in = (this.supplierDetail.is_dine_in && this.settings.is_table_booking && this.supplierDetail.is_scheduled && !this.isTbItem) ? true : false;
                }
            }, err => {
                this.isLoading = false;
            });
    }


    getSupplierCategoryList() {
        var param_data = {
            supplierId: this.supplierId
        }
        this.http.getData(ApiUrl.getSupplierCategoryList, param_data)
            .subscribe(response => {
                this.category_list = response.data;
                if (this.category_list.length) {
                    this.selected_category_id = this.category_list[0].category_id
                }
            })
    }

    selectCategory(cat, index) {
        this.selected_category_id = cat.category_id;
        this.categoryIndex = index;
        this.pagination = new PaginationModel();
        this.getData();
    }
    getDetailsWithPaging() {
        this.isLoading = true;
        let param_data = {
            languageId: this.util.handler.languageId,
            supplier_id: this.supplierId,
            latitude: this.util.handler.latitude,
            longitude: this.util.handler.longitude,
            limit: this.pagination.perPage,
            offset: this.pagination.offset
        }
        if (this.selected_category_id) {
            param_data['category_id'] = this.selected_category_id
        }
        if (this.settings.enable_non_veg_filter) {
            param_data['is_non_veg'] = this.item_type ? 2 : 0;
        }
        let api = '';
        // if (this.settings.branch_flow == 1 && this.branchId) {
        //     param_data['supplier_branch_id'] = this.branchId;
        //     api = ApiUrl.getSupplierBranchProduct;
        // } else {
        //     api = ApiUrl.getSupplierDetailProductV1;
        // }
        api = ApiUrl.getSupplierDetailProductV1;
        this.http.getData(api, param_data)
            .subscribe(response => {
                if (!!response && response.data) {
                    this.allProducts = response.data.product;
                    this.supplierDetail = response.data.supplier_detail;
                    if (this.settings.enable_promo_code_list == 1) {
                        this.supplier_ids += this.supplierDetail.id + ','
                    }
                    this.pagination.count = response.data.count;
                    if (this.supplierDetail.supplier_image.length >= 2 && this.settings.is_enable_multiple_banner) {
                        this.colClass = "col-md-8";
                        this.bannerImgHeight = "400px"
                    }
                    // if (this.settings.branch_flow == 1 && this.supplierDetail.is_multi_branch) {
                    //     this.showBranches = true;
                    // }
                    this.seo.updateTitle(`${this.supplierDetail.name} | ${GlobalVariable.SITE_NAME}`);
                    this.seo.updateDescription(this.supplierDetail.address);
                    if (this.settings.app_type == 1 && ([1, 3, 4].includes(this.settings.selected_template)) && !this.settings.show_tags_for_suppliers) {
                        let cat_names = [];
                        (this.allProducts).forEach(ct => {
                            cat_names.push(ct.sub_cat_name)
                        });
                        this.category_names = (cat_names.splice(0, 6)).join(', ');
                    }
                    if (this.settings.app_type == 1 && this.settings.show_tags_for_suppliers) {
                        this.tag_names = this.supplierDetail.supplier_tags && this.supplierDetail.supplier_tags.length ? (this.supplierDetail.supplier_tags).map(el => { return el.name }).splice(0, 6).join(', ') : '';
                    }
                    if (this.supplierDetail['supplier_image'].length) {
                        this.supplierDetail['supp_image'] = this.supplierDetail['supplier_image'][0];
                        this.supplierDetail.isVideo = (this.supplierDetail['supplier_image'][0].split('.').pop()).includes('mp4');
                    }
                    this.todaySupplierTimings();
                    if (!this.showBranches) {
                        this.allProducts.forEach(data => {
                            if (data.detailed_category_name && data.detailed_category_name.length) {
                                data.detailed_category_name = _.uniq((data.detailed_category_name).slice(), 'detailed_sub_category_id');
                                data.detailed_category_name.forEach(cat => {
                                    cat['value'] = [];
                                    data.value.map(product => {
                                        if (product.detailed_sub_category_id == cat.detailed_sub_category_id) {
                                            this.updateProduct(product);
                                            cat['value'].push(product);
                                        }
                                    });
                                });
                            } else {
                                data.value.map(product => {
                                    this.updateProduct(product);
                                });
                            }
                        });

                        this.products = this.allProducts.slice();
                    }

                    this.initialPagePosition();
                    this.isLoading = false;
                    this.is_dine_in = (this.supplierDetail.is_dine_in && this.settings.is_table_booking && this.supplierDetail.is_scheduled && !this.isTbItem) ? true : false;

                }
            }, err => {
                this.isLoading = false;
            });
    }



    pageChange(event) {
        this.pagination.currentPage = event;
        this.pagination.offset = event > 1 ? (event - 1) * this.pagination.perPage : 0;
        this.getData();
    }




    todaySupplierTimings() {
        if (this.supplierDetail.timing && this.supplierDetail.timing.length) {
            const today = this.dateService.getDay(moment().format('dddd').toLowerCase());
            const todayTimes = this.supplierDetail.timing.find((i) => i.week_id == today);

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

                this.supplierDetail['todayTimes'] = {
                    is_open: todayTimes.is_open,
                    startTime: openingTime.format('LT'),
                    endTime: closeTime.format('LT'),
                    day: this.dateService.getDayName(today)
                }

                if (moment().isBefore(openingTime, 'm') || moment().isAfter(closeTime)) {
                    this.supplierDetail['todayTimes']['is_open'] = 0;
                }

                this.productstate.hideQuantity = this.supplierDetail['todayTimes']['is_open'] == 0 ? true : false;
            }
            if (this.settings.enable_supplier_config_closing_day == 1) {
              const closingSlotTimes = this.supplierDetail.timing.find((i) => i.close_week_id == today);

              if (closingSlotTimes) {
                  let endTime = todayTimes.end_time.split(':');
                  const openingTime = moment().set('h', 0).set('m', 0).set('s', 0);
                  let closeTime;
                  // if(!!todayTimes.close_week_id && todayTimes.close_week_id!=todayTimes.week_id) {
                  closeTime = moment().set('h', endTime[0]).set('m', endTime[1]).set('s', endTime[2]);
                  if (moment().isAfter(openingTime, 'm') && moment().isBefore(closeTime)) {
                      this.supplierDetail['todayTimes']['is_open'] = 1;

                      this.productstate.hideQuantity = this.supplierDetail['todayTimes']['is_open'] == 0 ? true : false;

                  }
              }
          }
        }
    }

    initialPagePosition() {
        if (this.products && this.products.length) {
            for (let i = 0; i < this.products.length; i++) {
                this.pagePosition[`${i}`] = 0;
            }
        }
    }

    categorySelect(index) {
        let el = this.document.getElementById(index);

        if (this.settings.selected_template == 1) {
            // this.categoryIndex = index;
            this.window.scrollTo({
                top: el.offsetTop - 80,
                behavior: 'smooth'
            });
        } else {
            el.scrollIntoView({ behavior: "smooth" });
            window.scrollTo(0,window.pageYOffset + el.getBoundingClientRect().top - document.getElementById('header_app').getBoundingClientRect().height*2  )

        }
        // this.categoryIndex = index;
        // this.window.scrollTo(0, this.pagePosition[index] + 650);
    }

    searchProduct(search) {
        if (!!search && search.trim()) {
            let regex: RegExp = new RegExp(search, "i");
            this.products = [];
            _.each(this.allProducts, data => {
                let arr = _.filter(data.value, product => {
                    return product['name'].match(regex) || product['supplier_name'].match(regex);
                });
                if (arr && arr.length)
                    this.products.push({ sub_cat_name: data.sub_cat_name, value: arr });
            });
        } else {
            this.products = this.allProducts.slice();
        }
    }

    addRemoveFavourites(is_favourite) {
        if (!this.loggedIn) {
            this.message.alert('warning', this.translate.instant('Please Login To Continue'));
            return;
        }
        let url: string = '';
        if (is_favourite) {
            url = ApiUrl.favourite.removeFromFavourites
        } else {
            url = ApiUrl.favourite.addToFavourites
        }
        let form_data = {
            supplierId: this.supplierId,
            accessToken: this.user.getUserToken
        }
        this.http.postData(url, form_data, true)
            .subscribe(response => {
                if (!!response && response.data) {
                    this.message.toast('success', `${this.localization.transform('supplier')} ${is_favourite ? this.translate.instant('Removed From') : this.translate.instant('Added To')} ${this.translate.instant('Favourites')}`);
                    this.supplierDetail['Favourite'] = !is_favourite;
                }
            });
    }

    /********* Open Add On Dialog *********/

    openAddOnDialog(product) {
        const dialogRef = this.dialogService.open(AddOnComponent, {
            header: product['name'],
            width: '50%',
            style: { 'background-color': `${this.style.primaryColor} !important` },
            showHeader: false,
            // contentStyle: { "max-height": "350px", "overflow": "auto" },
            transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
            data: {
                product: product,
                addOnItems: product['adds_on']
            }
        })

        dialogRef.onClose.subscribe(() => {
        })
    }

    addProduct(product) {
        if (product['is_product_adds_on'] !== 1) {
            this.cartService.addToCart(product, this.products);
            return;
        }

        this.openAddOnDialog(product);
    }

    removeProduct(product) {
        if (product['customization'] && product['customization'].length) {
            this.openAddOnDialog(product);
        } else {
            this.cartService.removeFromCart(product)
        }
    }

    public generateFakeList(count: number): Array<number> {
        const indexes = [];
        for (let i = 0; i < count; i++) {
            indexes.push(i);
        }
        return indexes;
    }

    prescriptionUpload() {
        const dialogRef = this.dialogService.open(PrescriptionUploadComponent, {
            dismissableMask: true,
            width: '60%',
            showHeader: false,
            transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
            data: {
                supplier_branch_id: this.supplierDetail.supplier_branch_id,
            }
        });
    }

    wishlist(status, detail) {
        // this.loggedIn = !!this.userService.getUserToken;
        if (!this.loggedIn) {
            this.message.alert('warning', this.translate.instant('Please Login First'));
            return;
        }
        let param_data = {
            status: +status,
            supplierId: detail['id'],
            accessToken: this.user.getUserToken
        }

        const api = param_data.status == 1 ? ApiUrl.favourite.addToFavourites : ApiUrl.favourite.removeFromFavourites;

        this.http.postData(api, param_data, true)
            .subscribe(response => {
                if (!!response && response.data) {
                    this.message.toast('success', `${this.localization.transform('supplier')} ${this.translate.instant('Has Been Successfully')} ${status ? this.translate.instant('Added To') : this.translate.instant('Removed From')} ${this.translate.instant('Wishlist')}`);
                    this.supplierDetail.Favourite = status;
                }
            });
    }

    openSchedulingModal(supplier) {
        if (!this.loggedIn) {
            this.selected_supplier_for_table_booking = supplier;
            this.is_table_booking_try = true;
            this.util.authToggle.next(true);
            return false;
        }
        this.is_table_booking_try = false;
        this.schedulingData = {
            supplier_id: supplier.id,
            branch_id: supplier.supplier_branch_id,
            date_order_type: 3,
            latitude: 0,
            longitude: 0,
            by_pass_tables_selection: this.settings.by_pass_tables_selection
        }
        this.showScheduleTime = true;
    }



    onSchedulingProcess(eventData: any) {
        if (this.settings.table_book_mac_theme == 1) {
            this.addFoodItemToTable(eventData)
          } else  {
            this.createTableBooking(eventData);
          }
        // this.localTblBooking = eventData;

        if (localStorage.getItem('table_booking_details')) {
            console.log('enter');
            this.localTblBooking = JSON.parse(localStorage.getItem('table_booking_details'));
            console.log('localTblBooking', this.localTblBooking, typeof this.localTblBooking);

        }
    }

  addFoodItemToTable(tb) {
    // var obj = {
    //   table_request_id: tb.id,
    //   table_id: tb.table_id,
    //   table_name: tb.table_name,
    //   table_seating: tb.seating_capacity || 0,
    //   table_slot: tb.schedule_date
    // }
    // localStorage.setItem('table_booking_details', JSON.stringify(obj));
    this.router.navigate(["products/listing"], {
      queryParams: {
        supplierId: this.supplierDetail.id,
        action: 'tb_item'
      }
    });
  }


    createTableBooking(data) {
        if (data) {
            var table_booking_param = {
                user_id: this.currentUser.id,
                // table_booking_price: data.table_booking_price,
                slot_id: data.slot_id,
                schedule_date: data.startTime,
                schedule_end_date: data.endTime,
                supplier_id: this.supplierDetail.id,
                branch_id: this.supplierDetail.supplier_branch_id
            }
            this.isTbItem = true;

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
        }
    }

    selectBranch(supplier) {
        if (supplier.data) {
            this.branchId = supplier.data.supplier_branch_id;
            this.branchName = supplier.data.supplier_branch_name;
            this.showBranches = false;
        }
        if (supplier.load) {
            this.getData();
        }
    }

    viewBranches() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                supplierId: this.supplierId,
                is_branches: 1,
            }
        });
    }

    // pageChange(event) {
    //     this.pagination.currentPage = event;
    //     this.pagination.offset = event > 1 ? (event - 1) * this.pagination.perPage : 0;
    //     this.getDetails();
    //     this.window.scrollTo(0, 350);
    //   }

    trackByProductFn(id, index) {
        return index;
    };
    trackByCategoryFn(id, index) {
        return index;
    };
    trackByPrdtsFn(id, index) {
        return index;
    };
    trackByDetailCatFn(id, index) {
        return index;
    };
    trackBydPNameFn(id, index) {
        return index;
    };
    trackByDproductFn(id, index) {
        return index;
    };
    trackByPdtsFn(id, index) {
        return index;
    };
    trackBypDataFn(id, index) {
        return index;
    };
    trackByCatNameFn(id, index) {
        return index;
    };
    trackBySuppFn(id, index) {
        return index;
    };
    trackByPItemFn(id, index) {
        return index;
    };
    trackByCatListFn(id, index) {
        return index;
    };
    trackByProdFn(id, index) {
        return index;
    };
    trackByProdCatDetailFn(id, index) {
        return index;
    };
    trackByProdCatWiseFn(id, index) {
        return index;
    };
    trackByProdCatValFn(id, index) {
        return index;
    };
    trackByCatValNameFn(id, index) {
        return index;
    };
    trackByGenFFn3(id, index) {
        return index;
    };
    trackByGenFFn2(id, index) {
        return index;
    };

    trackByGenFFn(id, index) {
        return index;
    };
    trackByProdCatValueFn(id, index) {
        return index;
    };
    trackByCatNFn(id, index) {
        return index;
    };
    trackByPPPfn(id, index) {
        return index;
    };
    trackByGenFListFn(id, index) {
        return index;
    };
    trackByGenFakeList(id, index) {
        return index;
    };
    openPromoCodeList() {
        this.isPromoCodeList = true;
    }
    onItemSelectEvt(event) {
        this.isPromoCodeList = false;
    }

    openReviews(supplier) {
        this.ratingReviews = supplier.ratingAndReviews;
        this.isRatingReviews = true;
    }

    onCloseEvent(event) {
        this.isRatingReviews = event;
    }

    ngOnDestroy() {
        if (!!this.styleSubscription) this.styleSubscription.unsubscribe();
        if (!!this.settingsSubscription) this.settingsSubscription.unsubscribe();
        if (!!this.getDataSubscription) this.getDataSubscription.unsubscribe();
        if (!!this.routeSubscription) this.routeSubscription.unsubscribe();
        if (!!this.cartSubscription) this.cartSubscription.unsubscribe();
        if (!!this.userSubscription) this.userSubscription.unsubscribe();
        if (!!this.themeSubscription) this.themeSubscription.unsubscribe();
        let componentInstance = this.dialogService.dialogComponentRef;
        if (componentInstance) {
            componentInstance.destroy()
        }
    }

}
