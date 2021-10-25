import { HttpService } from './../../../../../../services/http/http.service';
import { ApiUrl } from './../../../../../../core/apiUrl';
import { TranslateService } from '@ngx-translate/core';
import { LocalizationPipe } from './../../../../../../shared/pipes/localization.pipe';
import { GlobalVariable } from './../../../../../../core/global';
import { CartService } from './../../../../../../services/cart/cart.service';
import { MessagingService } from './../../../../../../services/messaging/messaging.service';
import { UtilityService } from './../../../../../../services/utility/utility.service';
import { AppSettings } from './../../../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../../../core/theme/styleVariables.model';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { DescriptionComponent } from './../../description/description.component';
import { ProductInfoComponent } from './../../product-info/product-info.component';
import { Input, Output, EventEmitter, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../../../services/user/user.service';
import { Currency } from '../../../../../../shared/models/apiKeys.model';

@Component({
    selector: 'app-base-product',
    template: '',
    styleUrls: []
})
export class BaseProduct {

    @Input() product: any;

    @Input() style: StyleVariables;

    @Input() settings: AppSettings;

    @Input() darkTheme: boolean;

    @Input() loggedIn: boolean = false;

    @Input() state: any = {};

    @Input() canCompare: boolean = false;

    // @Input() isEditOrder: boolean = false;

    @Input() is_dine_in: boolean = false;

    @Output() add: EventEmitter<any> = new EventEmitter<any>();

    @Output() remove: EventEmitter<any> = new EventEmitter<any>();

    @Output() onFavourite: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output() onSelectProduct: EventEmitter<any> = new EventEmitter<any>();


    currency: string = "";

    isOutOfStock: boolean = false;

    timeInterval: number = 0;

    is_mobile: boolean = GlobalVariable.IS_MOBILE;

    public userSvcSubscription: Subscription;
    cartSubscription: Subscription;
    orderTypeSubscription: Subscription;
    tableBookingDataForPreOrder: Subscription;


    public is_user_subscribed: boolean;
    public is_logged_in: boolean = false;

    public is_out_network_show: boolean = false;
    public currentUser: any;
    public out_network_props: boolean = false;
    public isImageInProcess: boolean;
    siteName: string = ''

    public uniqueSuppliers: any = [];

    public prodDetail: any = {};
    schedulingData: any = {};
    showScheduleTime: boolean = false;

    public localTblBooking: any;

    selected_order_type: number = 1;

    public is_product_allergy: boolean = false;
    public allergy: string = '';
    public is_special_instruction: boolean = false;
    public is_special_instruction_added: boolean = false;
    public special_instructions: string = '';

    public selected_currency: Currency = new Currency();

    public productObj: any = {};

    public cartItems: any = [];



    constructor(
        public http: HttpService,
        public util: UtilityService,
        public router: Router,
        public message: MessagingService,
        public cartService: CartService,
        public dialogService: DialogService,
        public localization: LocalizationPipe,
        public translate: TranslateService,
        public userSvc: UserService
    ) {
        this.style = new StyleVariables();
        this.siteName = GlobalVariable.SITE_NAME;
    }

    ngOnInit(): void {
        this.currency = GlobalVariable.CURRENCY;
        this.userSvcSubscription = this.userSvc.currentUser.subscribe((res: any) => {
            if (res) {
                this.is_user_subscribed = res.is_subscribed;
                this.is_logged_in = res.access_token ? true : false;
                this.currentUser = res.access_token ? res : {};
            }
        })
        this.productObj = this.product;
        this.getUniqueSuppliers();
        if (localStorage.getItem('table_booking_details')) {
            this.localTblBooking = localStorage.getItem('table_booking_details');
        }
        if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
            this.getOrderType();
        }
        if (this.settings.is_multicurrency_enable) {
            this.getCurrency();
        }

        if(this.settings.enable_product_tax_feature == 1) {
          this.product.fixed_price = (this.product.fixed_price*1) + this.product.handling_admin
        }

    }

    ngOnChanges(): void {
        let quantity = Number(this.product.quantity);
        let purchaseQuantity = Number(this.product.purchased_quantity);

        if (purchaseQuantity >= quantity || this.product.item_unavailable == 1) {
            this.isOutOfStock = true;
        }
    }

    getCurrency() {
        this.util.getSelectedCurrency.subscribe((res: any) => {
            if (res) {
                this.selected_currency = res;
                // if (this.product) {
                //     var obj = Object.assign({}, this.productObj);
                //     obj.display_price = (parseInt(obj.display_price) * this.selected_currency.conversion_rate).toFixed(this.settings?.price_decimal_length || 2);
                //     obj.fixed_price = (parseInt(obj.fixed_price) * this.selected_currency.conversion_rate).toFixed(this.settings?.price_decimal_length || 2);
                //     this.product = Object.assign({}, obj);
                this.currency = this.selected_currency.currency_name;
                // }
            }
        })
    }

    /******************** On Original Image Load *********************/
    onImageLoad(product): void {
        product.image = product.image_path || product['product_image'];
    }

    /******************** Product Detail *********************/
    productDetail(data: any) {
        if (this.settings.app_type != 1 || this.settings.product_detail == 1) {
            let obj = {
                productId: data.parent_id || data.product_id,
                supplierBranchId: data.supplier_branch_id,
                category: data.category_id
            };
            data.name = data.name.replace(/ &/g, "-");
            obj = { ...this.util.handler, ...obj };
            this.onSelectProduct.emit(null);
            this.router.navigate(["/", "products", "product-detail", data.name], {
                queryParams: { f: this.util.encryptData(obj) }
            });
        }
    }

    /******************** Decrease Quantity *********************/
    decreaseValue(): void {
        if (this.product.selectedQuantity <= 0) {
            return;
        }
        this.remove.emit(this.product);
        if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
            this.message.toast('success', this.translate.instant('Item removed from cart.'));
        }

        if (this.settings.enable_in_out_network) {
            if (this.product.is_out_network) {
                this.out_network_props = false;
            }
        }
        if (this.settings.enable_product_special_instruction) {
            if (this.product.selectedQuantity == 0) {
                this.is_special_instruction_added = false;
                this.special_instructions = '';
            }
        }
    }

    /******************** Increase Quantity *********************/
    increaseValue(from_temp?): void {
        if (this.settings.enable_bypassing_cart && !from_temp) {
            if (this.product.selectedQuantity > 0) {
                this.router.navigate(['/cart/list']);
            }
            else {
                this.addToCart();
            }
            return
        }
        if (this.product.is_liquor == 1 && this.product.selectedQuantity == 0 && !this.product.adds_on.length) {
            this.productInfo();
        }
        if (this.settings.enable_category_age_limit) {
            if (!this.is_logged_in) {
                this.util.authToggle.next(true);
                return;
            }
            if (this.product.age_limit) {
                var ageDifMs = Date.now() - new Date(this.currentUser.dateOfBirth).getTime();
                var ageDate = new Date(ageDifMs);
                var userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                if (userAge < this.product.age_limit) {
                    this.message.alert('info', this.translate.instant(`Your Age Should be ${this.product.age_limit} or more!`));
                    return
                }
            }
        }
        if (this.settings.enable_in_out_network) {
            if (this.product.is_out_network) {
                if (!this.out_network_props) {
                    this.is_out_network_show = true;
                    return;
                }
                if (this.product.selectedQuantity >= 1) {
                    this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
                    return
                }
            }
            if (this.uniqueSuppliers.length >= 4 && !this.uniqueSuppliers.includes(this.product.supplier_id)) {
                this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
                return
            }
        }
        if (this.settings.is_enable_subscription_required) {
            if (!this.is_logged_in) {
                this.util.authToggle.next(true);
                return;
            }
            if (!this.is_user_subscribed && this.product.is_subscription_required) {
                this.message.alert("info", "You must subscribe to buy this product!");
                return;
            }
        }
        if (this.settings.enable_item_purchase_limit) {
            if ((Number)(this.product.purchase_limit) > 0) {
                if (this.product.selectedQuantity >= (Number)(this.product.purchase_limit)) {
                    this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
                    return;
                }
            }
        }
        if (this.product.selectedQuantity >= (Number(this.product.quantity) - Number(this.product.purchased_quantity))) {
            this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
            return;
        }

        if (this.product['self_pickup'] && this.util.handler.selfPickup !== this.product['self_pickup'] && this.product['self_pickup'] !== 2 && this.settings.app_type == 1 && this.settings.is_single_vendor == 0) {
            this.message.alert('info', `${this.translate.instant('This')} ${this.localization.transform('product')} ${this.translate.instant('Is Not Available For')}  ${this.util.handler.selfPickup ? this.translate.instant('Self Pickup') : this.translate.instant('Delivery')}`);
            return;
        }
        let variant = []
        let item = {
            unid: '',
            variant_id: '',
            variant_name: '',
            variant_value: '',
            product_desc: '',
            product_id: '',
            product_name: ''
        }
        this.product['cartVariants'] = []
        if (this.product.variant && this.product.variant.length) {
            this.product.variant.forEach(vari => {
                item.unid = vari.id,
                    item.variant_id = vari.vaiant_id
                item.variant_name = vari.name
                item.variant_value = vari.value
                item.product_desc = this.product.product_desc
                item.product_id = this.product.product_id
                item.product_name = this.product.name
                this.product['cartVariants'].push(item);

            })
        }

        this.add.emit(this.product);
        if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
            this.message.toast('success', this.translate.instant('Item added to cart.'));
        }
        this.addProductToDataLayer();
    }

    addProductToDataLayer() {
        const prodToAddInDL = {

        }
        // this.util.addToDatalayer()
    }

    /******************** Add Item To Cart *********************/
    addToCart(): void {
        if (this.product['price_type']) {
            this.product.selectedQuantity += this.product.duration / this.settings.interval;
        }
        // this.product.image_path = this.product.image_path.length ? this.product.image_path : [this.product.image_path]
        this.cartService.addToCart(this.product, null, true);
    }

    porductDescription() {
        const dialogRef = this.dialogService.open(DescriptionComponent, {
            dismissableMask: true,
            width: this.is_mobile ? '85%' : '40%',
            showHeader: false,
            transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
            data: {
                title: this.siteName == 'Little Caesars' ? (this.product.name ? this.product.name : '') : '',
                description: this.product.product_desc,
            }
        });
    }

    productInfo() {
        const dialogRef = this.dialogService.open(ProductInfoComponent, {
            dismissableMask: true,
            width: this.is_mobile ? '65%' : '20%',
            showHeader: false,
            transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
            data: {
                description: 'Bottle Deposit: ' + this.currency + this.settings.liquor_bottle_tax,
            }
        });
    }

    wishlist(status, detail) {
        if (!this.loggedIn) {
            this.message.alert('warning', this.translate.instant('Please Login First'));
            return;
        }
        let param_data = {
            status: +status,
            product_id: detail['product_id']
        }
        this.http.postData(ApiUrl.addToWishlist, param_data, true)
            .subscribe(response => {
                if (!!response && response.data) {
                    this.message.toast('success', `${this.localization.transform('product')} ${this.translate.instant('Has Been Successfully')} ${status ? this.translate.instant('Added To') : this.translate.instant('Removed From')} ${this.translate.instant('Wishlist')}`);
                    this.product.is_favourite = status;
                    this.onFavourite.emit(this.product.is_favourite);
                }
            });
    }

    quantityUpdate(event) {
        this.cartService.quantityInput(event, this.product);
    }

    handleImageProcess(event) {
        this.isImageInProcess = event;
    }

    onProcessOutNetEvent(event) {
        if (event) {
            if (this.isImageInProcess) {
                return;
            }
            this.product.product_dimensions = event.product_dimensions;
            this.product.product_owner_name = event.product_owner_name;
            this.product.product_upload_reciept = event.product_upload_reciept;
            this.product.product_reference_id = event.product_reference_id;
            this.out_network_props = true;
            this.increaseValue();
        }
        this.is_out_network_show = false;
    }


    getUniqueSuppliers() {
        this.cartSubscription = this.util.getCart
            .subscribe(cart => {
                if (cart) {
                    this.cartItems = cart;
                    this.uniqueSuppliers = Object.assign([], cart).reduce((unique, item) =>
                        unique.includes(item.supplier_id) ? unique : [...unique, item.supplier_id], []
                    )
                }
            })
        if (this.cartSubscription) { this.cartSubscription.unsubscribe() }
    }


    getOrderType() {
        this.orderTypeSubscription = this.util.getOrderTypeData.subscribe((res: any) => {
            if (res) {
                this.selected_order_type = (Number)(res);
            }
        })
    }


    openSchedulingModal(product) {
        if (!this.loggedIn) {
            this.util.authToggle.next(true);
            return false;
        }
        if (this.localTblBooking) {
            this.increaseValue();
            return;
        }
        this.prodDetail = product;
        this.schedulingData = {
            supplier_id: product.supplier_id,
            branch_id: product.supplier_branch_id,
            date_order_type: 3,
            latitude: 0,
            longitude: 0,
            by_pass_tables_selection: this.settings.by_pass_tables_selection
        }
        this.showScheduleTime = true; 
    }

    onSchedulingProcess(eventData: any) {
        this.createTableBooking(eventData);
    }

    createTableBooking(data) {
        var table_booking_param = {
            user_id: this.currentUser.id,
            // table_id: data.table_id,
            slot_id: data.slot_id,
            schedule_date: data.startTime,
            schedule_end_date: data.endTime,
            supplier_id: this.prodDetail.supplier_id,
            branch_id: this.prodDetail.supplier_branch_id
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
        if (data) {
            this.http.postData(ApiUrl.makeTableBookingRequest, table_booking_param).subscribe((res: any) => {
                if (res.status == 200) {
                    this.message.alert("success", "Your Table Booking request has been placed successfully!");
                    this.router.navigateByUrl('/account/table-bookings'); 
                }
            })
        }
        else {
            if (localStorage.getItem('table_booking_details')) {
                this.localTblBooking = localStorage.getItem('table_booking_details');
            }
            this.router.navigate(["products/listing"], {
                queryParams: {
                  supplierId: this.product.supplier_id,
                  action: 'tb_item'
                }
              });
        }
    }

    showProductAllergy(item) {
        this.allergy = item.allergy_description || 'No Allergy Found';
        this.is_product_allergy = true;
    }
    showSpecialInstruction(item) {
        this.special_instructions = item.special_instructions || this.special_instructions;
        this.is_special_instruction = true;
    }

    onCloseProductAllergy(event) {
        this.is_product_allergy = event;
        this.is_special_instruction = event;
    }

    onProcessSpecialInstruction(event) {
        for (var i in this.cartItems) {
            if ((Number)(this.cartItems[i].productId) == this.product.product_id) {
                this.cartItems[i]['special_instructions'] = event;
                this.is_special_instruction_added = true;
                this.special_instructions = event;
                break;
            }
        }
        this.util.setCart(this.cartItems);
        this.is_special_instruction = false;
    }




}
