import { GlobalVariable } from './../../../../core/global';

import { Router } from '@angular/router';
import { UtilityService } from './../../../../services/utility/utility.service';
import { Subscription } from 'rxjs';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-food-best-seller',
    templateUrl: './food-best-seller.component.html',
    styleUrls: ['./food-best-seller.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodBestSellerComponent implements OnInit {

    @Input() settings: AppSettings;
    @Input() style: StyleVariables;
    @Input('bestSellers')
    set bestSeller(bestSellers) {
        if (bestSellers) {
            this.bestSellers = bestSellers;
        }
    }
    themeSubscription: Subscription;
    supplierId: string = "";
    allSuppliers: Array<any> = [];
    bestSellers: Array<any> = [];

    isDarkTheme: boolean = false;
    isLoading: boolean = false;

    uniqueId: string = GlobalVariable.UNIQUE_ID;

    public catShortValue: number;
    constructor(
        public util: UtilityService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.themeSubscription = this.util.getDarkTheme.subscribe((darkTheme) => {
            this.isDarkTheme = darkTheme;
        });
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
            best_seller: 1
        }
        if (this.settings.app_type == 1) {
            params['mode'] = this.catShortValue;
        }
        this.router.navigate(['/', 'supplier', 'supplier-list'], {
            queryParams: params
        });
    }

    supplierList(category: any) {
        const queryParams = { cat_id: category.id, cat_name: category.name }
        if (category.menu_type == 1 && category.sub_category && category.sub_category.length) {
            queryParams['n_lvl'] = 1
        }
        this.router.navigate(['/', 'supplier', 'supplier-list'], { queryParams });
    }

    trackByBestSellerFn(id, index) {
        return index;
    };
    trackByGenFakeFn(id, index) {
        return index;
    };
    trackBySuppFn(id, index) {
        return index;
    };
    trackByUtilSuppFn(id, index) {
        return index;
    };
    trackBybestSellFn(id, index) {
        return index;
    };
    trackByUtilGenFn(id, index) {
        return index;
    };
    ngOnDestroy() {
        if (!!this.themeSubscription) this.themeSubscription.unsubscribe();
    }
}
