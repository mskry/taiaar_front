import { GlobalVariable } from './../../../../core/global';

import { ApiUrl } from './../../../../core/apiUrl';
import { skip } from 'rxjs/operators';
import { WINDOW } from './../../../../services/window/window.service';
import { CartService } from './../../../../services/cart/cart.service';
import { Router } from '@angular/router';
import { HttpService } from './../../../../services/http/http.service';
import { UtilityService } from './../../../../services/utility/utility.service';
import { DataCacheService } from './../../../../services/data-cache/data-cache.service';
import { Subscription } from 'rxjs';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { Component, OnInit, Input, Inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import * as moment from 'moment'

@Component({
    selector: 'app-food-highest-rating-restaurant',
    templateUrl: './food-highest-rating-restaurant.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodHighestRatingRestaurantComponent implements OnInit {

    @Input() settings: AppSettings;
    @Input() style: StyleVariables;
    themeSubscription: Subscription;
    pickupSubscription: Subscription;
    locationSubscription: Subscription;

    supplierId: string = "";
    allSuppliers: Array<any> = [];
    count: number = 0;
    childIndex: number = -1;
    parentIndex: number = -1;
    isDarkTheme: boolean = false;
    isLoading: boolean = false;

    categoryData: Array<any> = [];
    category_length: number = 12;

    cat_fixed: boolean = false;
    sortBy: number = 0;
    uniqueId: string = GlobalVariable.UNIQUE_ID;

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
        private cacheService: DataCacheService,
        public util: UtilityService,
        private http: HttpService,
        private router: Router,
        private cart: CartService,
        @Inject(WINDOW) private window: Window
    ) { }

    ngOnInit() {
        this.makeSubscription();

        this.themeSubscription = this.util.getDarkTheme.subscribe((darkTheme) => {
            this.isDarkTheme = darkTheme;
        });

        this.locationSubscription = this.util.getUserLocation.pipe(skip(1)).subscribe((location) => {
            this.cacheService.removeKey(ApiUrl.getHomeSuppliers);
            this.getSuppliers();
        });

        this.getSuppliers();

    }

    @HostListener("window:scroll", ["$event"])
    onScroll() {
        if (Math.ceil(this.window.pageYOffset) >= 1460) this.cat_fixed = true;
        else this.cat_fixed = false;
    }

    makeSubscription() {
        if ([1, 2, 3, 4].includes(this.settings.selected_template)) {
            this.getCategories();
        }
        this.pickupSubscription = this.util.getSelfPickup.pipe(skip(1)).subscribe(() => {
            this.cacheService.removeKey(ApiUrl.getHomeSuppliers);
            this.getSuppliers();
        });

        this.catShortValue = this.util.handler.selfPickup;
    }

    getSuppliers() {
        this.isLoading = true;
        let param_data = {
            languageId: this.util.handler.languageId,
            latitude: this.util.handler.latitude,
            longitude: this.util.handler.longitude,
            sort_by: 2,
            offset: moment().format('Z'),
            skip: 0,
            limit: 6
        };

        if (this.settings.app_type == 1) {
            param_data['self_pickup'] = this.util.handler.selfPickup;
            switch (this.catShortValue) {
                case 0:
                    param_data['self_pickup'] = 0;
                    param_data['is_dine_in'] = 0;
                    break;
                case 1:
                    param_data['self_pickup'] = 1;
                    param_data['is_dine_in'] = 0;
                    break;
                case 2:
                    param_data['is_dine_in'] = 1;
                    param_data['self_pickup'] = 0;
                    break;
            }
        }

        this.http.getData(ApiUrl.getHomeSuppliers, param_data, true, true)
            .subscribe(response => {
                if (!!response && response.data) {
                    this.allSuppliers = [];
                    this.count = response.data.length;
                    // (response.data).forEach(supplier => {
                    //   this.todaySupplierTimings(supplier);
                    // });
                    this.allSuppliers = response.data;
                }
                this.isLoading = false;
            }, (err) => this.isLoading = false);
    }

    // todaySupplierTimings(supplier) {
    //   if (supplier.timing && supplier.timing.length) {
    //     const today = this.dateService.getDay(moment().format('dddd').toLowerCase())
    //     const todayTimes = supplier.timing.find((i) => i.week_id == today);
    //     if (todayTimes) {
    //       let startTime = todayTimes.start_time.split(':');
    //       let endTime = todayTimes.end_time.split(':');
    //       const openingTime = moment().set('h', startTime[0]).set('m', startTime[1]).set('s', startTime[2]);
    //       const closeTime = moment().set('h', endTime[0]).set('m', endTime[1]).set('s', endTime[2]);
    //       supplier['todayTimes'] = {
    //         is_open: todayTimes.is_open,
    //         startTime: openingTime.format('LT'),
    //         endTime: closeTime.format('LT'),
    //         day: this.dateService.getDayName(today)
    //       };
    //       if (moment().isBefore(openingTime, 'm') || moment().isAfter(closeTime)) {
    //         supplier['todayTimes']['is_open'] = 0;
    //       }
    //     }
    //   }
    // }

    onSortBy(sortBy: number) {
        this.sortBy = sortBy;
        this.cacheService.removeKey(ApiUrl.getHomeSuppliers);
        this.getSuppliers();
    }
    onCatSortBy(catShortBy: number) {
        if (catShortBy == 0 || catShortBy == 1) {
            this.util.handler.selfPickup = catShortBy;
        }
        this.catShortValue = catShortBy;
        this.cacheService.removeKey(ApiUrl.getHomeSuppliers);
        this.getSuppliers();
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
            sort: this.sortBy,
        }
        if (this.settings.app_type == 1) {
            params['mode'] = this.catShortValue;
        }
        this.router.navigate(['/', 'supplier', 'supplier-list'], {
            queryParams: params
        });
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

    supplierList(category: any) {
        const queryParams = { cat_id: category.id, cat_name: category.name }
        if (category.menu_type == 1 && category.sub_category && category.sub_category.length) {
            queryParams['n_lvl'] = 1
        }
        if (this.settings.show_tags_for_suppliers) {
            delete queryParams.cat_id;
            queryParams['tag_id'] = category.id;
        }
        this.router.navigate(['/', 'supplier', 'supplier-list'], { queryParams });
    }

    set selfPickup(value: boolean) {
        this.util.setSelfPickup(Number(value));
        this.cart.emptyCart();
    }

    get selfPickup(): boolean {
        return this.util.handler.selfPickup == 1 ? true : false;
    }
    trackByAllSupliersFn(id, index) {
        return index;
    };
    trackByUtilGenFakeFn(id, index) {
        return index;
    };
    trackByAllSuppFn(id, index) {
        return index;
    };
    trackByUtilGenerateFn(id, index) {
        return index;
    };
    trackByCategoryDataFn(id, index) {
        return index;
    };
    trackByAllSuppliersFn(id, index) {
        return index;
    };
    trackByUtilGenerateFakeListFn(id, index) {
        return index;
    };
    trackByAllSupFn(id, index) {
        return index;
    };
    trackByUtilListFn(id, index) {
        return index;
    };

    ngOnDestroy() {
        if (!!this.themeSubscription) this.themeSubscription.unsubscribe();
        if (!!this.locationSubscription) this.locationSubscription.unsubscribe();
        if (!!this.pickupSubscription) this.pickupSubscription.unsubscribe();
    }
}
