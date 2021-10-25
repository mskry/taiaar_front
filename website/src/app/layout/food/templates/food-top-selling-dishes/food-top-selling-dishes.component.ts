import { GlobalVariable } from './../../../../core/global';

import { ApiUrl } from './../../../../core/apiUrl';
import { CartService } from './../../../../services/cart/cart.service';
import { Router } from '@angular/router';
import { HttpService } from './../../../../services/http/http.service';
import { UtilityService } from './../../../../services/utility/utility.service';
import { Subscription } from 'rxjs';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { AddOnComponent } from '../../../../layout/shared/product/components/add-on/add-on.component';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from '../../../../services/user/user.service';

@Component({
    selector: 'app-food-top-selling-dishes',
    templateUrl: './food-top-selling-dishes.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodTopSellingDishesComponent implements OnInit, OnDestroy {

    @Input() settings: AppSettings;
    @Input() style: StyleVariables;

    themeSubscription: Subscription;
    cartSubscription: Subscription;
    userSubscription: Subscription;

    cart: Array<any> = [];

    supplierId: string = "";
    topSellingDishes: Array<any> = [];
    count: number = 0;
    childIndex: number = -1;
    parentIndex: number = -1;
    isDarkTheme: boolean = false;
    isLoading: boolean = false;

    uniqueId: string = GlobalVariable.UNIQUE_ID;

    categoryData: Array<any> = [];
    category_length: number = 12;

    cat_fixed: boolean = false;

    loggedIn: boolean = false;

    productstate: any = {
        hideSupplier: true
    }

    currency

    slideConfig = {
        "slidesToShow": 2,
        "slidesToScroll": 1,
        "dots": true,
        "arrows": false,
        "infinite": false,
        "autoplay": true,
        "autoplaySpeed": 3000
    };

    public catShortValue: number;
    constructor(
        public util: UtilityService,
        private http: HttpService,
        private router: Router,
        private user: UserService,
        public cartService: CartService,
        public dialogService: DialogService,
    ) {
        this.currency = GlobalVariable.CURRENCY;
    }

    ngOnInit() {
        this.themeSubscription = this.util.getDarkTheme.subscribe((darkTheme) => {
            this.isDarkTheme = darkTheme;
        });
        this.cartSubscription = this.util.getCart.subscribe(cart => {
            if (cart) {
                this.cart = cart;
            }
        });
        this.userSubscription = this.user.currentUser
            .subscribe(user => {
                if (!!user && user['access_token']) {
                    this.loggedIn = true;
                    this.getData();
                } else {
                    this.loggedIn = false;
                }
            });

        this.getData();
    }

    getData() {
        // if (this.settings.selected_template == 3) {
        //     this.getCategories();
        //     this.getPopularProducts();
        // }
        this.getCategories();
        this.getPopularProducts();
    }

    getPopularProducts() {
        const queryParams: any = {
            latitude: this.util.handler.latitude,
            longitude: this.util.handler.longitude,
            languageId: this.util.handler.languageId,
            // type: this.settings.app_type,
            offset: 0,
            limit: 8
        }
        this.isLoading = true;
        this.http.getData(ApiUrl.getPopularProductV1, queryParams, true, true).subscribe((response) => {
            if (response && response.status == 200) {
                this.topSellingDishes = [];
                this.count = response.data.product.length;
                this.topSellingDishes = response.data.product.slice(0, 12);
            }
            this.isLoading = false;
        }, (err) => this.isLoading = false);
    }

    productList(supplier) {
        if (this.settings.app_type == 1) {
            this.router.navigate(["/", "products", "listing"], {
                queryParams: {
                    supplierId: supplier.id,
                    branchId: supplier.supplier_branch_id
                }
            });
        } else {
            let cat_ids: Array<any> = [];
            supplier["category"].forEach(element => {
                cat_ids.push(element.category_id);
            });
            this.router.navigate(['/', 'supplier', 'supplier-detail'], {
                queryParams: {
                    sup_id: supplier.id,
                    branch_id: supplier.supplier_branch_id,
                    cat_ids: cat_ids.join(),
                }
            });
        }
    }

    onSeeMore() {
        let params = {
            all: 1,
            top_selling: 1
        }
        if (this.settings.app_type == 1) {
            params['mode'] = this.catShortValue;
        }
        this.router.navigate(['/', 'products', 'view-more-products'], {
            queryParams: params
        });
    }

    supplierList(category: any) {
        let queryParams = {}
        if (this.settings.show_tags_for_suppliers) {
            queryParams = { tag_id: category.id, tag_name: category.name }
        }
        else {
            queryParams = { cat_id: category.id, cat_name: category.name }
        }
        if (category.menu_type == 1 && category.sub_category && category.sub_category.length) {
            queryParams['n_lvl'] = 1
        }
        this.router.navigate(['/', 'supplier', 'supplier-list'], { queryParams });
    }




    getCategories() {
        this.util.getLanguageCategoryData
            .subscribe(categories => {
                if (categories) {
                    if (this.settings.show_tags_for_suppliers) {
                        this.categoryData = (categories.supplier_tags).slice();
                    }
                    else {
                        const selectedCategory = this.util.getLocalData('selected_category', true);
                        if (this.settings.isCustomFlow && selectedCategory) {
                            const category = (categories.english).find((c) => c.type == selectedCategory.type && c.id == selectedCategory.id);
                            this.categoryData = category ? category['sub_category'] || [] : [];
                        } else {
                            this.categoryData = (categories.english).slice();
                        }
                    }
                }
            })
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
            this.cartService.addToCart(product);
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
    trackByDishFn(id, index) {
        return index;
      };
      trackBySuppFn(id, index) {
        return index;
      };
      trackByTopSellingFn(id, index) {
        return index;
      };
      trackByUtilfakeFn(id, index) {
        return index;
      };

    ngOnDestroy() {
        if (!!this.themeSubscription) this.themeSubscription.unsubscribe();
        if (!!this.cartSubscription) this.cartSubscription.unsubscribe();
        if (!!this.userSubscription) this.userSubscription.unsubscribe();

    }
}