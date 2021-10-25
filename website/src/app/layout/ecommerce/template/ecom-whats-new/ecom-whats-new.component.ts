import { skip } from 'rxjs/operators';
import { DataCacheService } from './../../../../services/data-cache/data-cache.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalizationPipe } from 'src/app/shared/pipes/localization.pipe';
import { ApiUrl } from 'src/app/core/apiUrl';
import { MessagingService } from 'src/app/services/messaging/messaging.service';
import { UserService } from './../../../../services/user/user.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CartService } from './../../../../services/cart/cart.service';
import { UtilityService } from './../../../../services/utility/utility.service';
import { Subscription } from 'rxjs';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AddOnComponent } from 'src/app/layout/shared/product/components/add-on/add-on.component';

declare var $: any;

@Component({
    selector: 'app-ecom-whats-new',
    templateUrl: './ecom-whats-new.component.html',
    styleUrls: ['./ecom-whats-new.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EcomWhatsNewComponent implements OnInit {

    whatsNew: Array<any> = [];
    @Input() settings: AppSettings;
    @Input() style: StyleVariables;
    @Input() isLoading: boolean = false;

    getDataSubscribe: Subscription;
    cartSubscription: Subscription;
    userSubscription: Subscription;
    themeSubscription: Subscription;
    cart: Array<any> = [];
    locationSubscription: Subscription;

    loggedIn: boolean = false;
    isDarkTheme: boolean = false;

    timeInterval: number = 0;
    slideConfig = {
        'slidesToShow': 4,
        'slidesToScroll': 1,
        'dots': false,
        'arrows': true,
        'infinite': false
    };

    constructor(
        public utilityService: UtilityService,
        public cartService: CartService,
        public dialogService: DialogService,
        private user: UserService,
        private message: MessagingService,
        private localization: LocalizationPipe,
        private http: HttpService,
        private data_cache: DataCacheService,
        private translate: TranslateService,
        private router: Router
    ) {

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
        this.cartSubscription = this.utilityService.getCart.subscribe(cart => {
            if (cart) {
                this.cart = cart;
                this.mapProduct(this.whatsNew);
            }
        });

        this.locationSubscription = this.utilityService.getUserLocation.pipe(skip(1)).subscribe((location) => {
            this.data_cache.removeKey(ApiUrl.getPopularProduct);
            this.fetch();
        });

        this.fetch();
    }

    fetch() {
        const queryParams: any = {
            latitude: this.utilityService.handler.latitude,
            longitude: this.utilityService.handler.longitude,
            languageId: this.utilityService.handler.languageId,
            offset: 0,
            limit: 10
        }

        if (this.settings.isCustomFlow) {
            let category = this.utilityService.getLocalData('selected_category', true);
            queryParams.categoryId = category.id;
        }

        this.isLoading = true;

        this.http.getData(ApiUrl.getPopularProduct, queryParams, true, !this.settings.isCustomFlow).subscribe((serverResponse) => {
            if (serverResponse && serverResponse.status == 200) {
                this.mapProduct(serverResponse.data.product);
            }
            this.isLoading = false;
        }, (err) => this.isLoading = false);
    }

    mapProduct(products) {
        this.whatsNew = products.map((item) => {
            item['avg_rating'] = Number.parseFloat(item['avg_rating']).toFixed(1);
            item['image'] = this.utilityService.thumbnail(item['image_path']);
            item["selectedQuantity"] = 0;

            if (this.cart.length) {
                this.cart.forEach(cartProduct => {
                    if (cartProduct.productId == item.product_id) {
                        item['selectedQuantity'] = cartProduct['selectedQuantity'];
                    }
                });
            }

            if (item['price_type']) {
                item['maxHour'] = item['hourly_price'][item['hourly_price'].length - 1]['max_hour'] - this.settings.interval;
                if (item['discount'] && item['hourly_price'][0]['discount_price']) {
                    item['fixed_price'] = item['hourly_price'][0]['discount_price'];
                    item['display_price'] = item['hourly_price'][0]['price_per_hour'];
                    item["discountPercentage"] = parseFloat((((item.display_price - item.fixed_price) / item.display_price) * 100).toFixed(2));
                } else {
                    item['fixed_price'] = item['hourly_price'][0]['price_per_hour'];
                }
            } else {
                this.utilityService.productPriceToFloat(item);
                item["discountPercentage"] = parseFloat((((item.display_price - item.fixed_price) / item.display_price) * 100).toFixed(2));
                item["discount"] = Math.round(item.discountPercentage);
            }
            return item;
        });
    }


    wishlist(status, detail) {
        this.loggedIn = !!this.user.getUserToken;
        if (!this.loggedIn) {
            this.message.alert('warning', this.translate.instant('Please Login First'));
            return;
        }
        let param_data = {
            status: +status,
            supplierId: detail['supplier_id'],
            accessToken: this.user.getUserToken
        }

        const api = param_data.status == 1 ? ApiUrl.favourite.addToFavourites : ApiUrl.favourite.removeFromFavourites;

        this.http.postData(api, param_data, true)
            .subscribe(response => {
                if (!!response && response.data) {
                    this.message.toast('success', `${this.localization.transform('supplier')} ${this.translate.instant('Has Been Successfully')} ${status ? this.translate.instant('Added To') : this.translate.instant('Removed From')} ${this.localization.transform('wishlist')}`);
                    detail.Favourite = +status;
                }
            });
    }



    addProduct(product) {
        if (product['is_product_adds_on'] !== 1) {
            this.cartService.addToCart(product, this.whatsNew, true);
            return;
        }

        this.openAddOnDialog(product);
    }


    openAddOnDialog(product) {
        const dialogRef = this.dialogService.open(AddOnComponent, {
            header: product['name'],
            width: '50%',
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
                // this.router.navigate(['/', this.settings.app_type, 'cart']);
            }
        })
    }

    onSeeMore() {
        this.router.navigate(['/', 'products', 'all-discounted-products'])
    }

    productDetail(data: any) {
        if (this.settings.app_type != 1) {
            let obj = {
                productId: data.product_id,
                supplierBranchId: data.supplier_branch_id,
                category: data.category_id
            };
            data.name = data.name.replace(/ &/g, "-");
            obj = { ...this.utilityService.handler, ...obj };
            this.router.navigate(["/products", "product-detail", data.name], {
                queryParams: { f: this.utilityService.encryptData(obj) }
            });
        }
    }
}
