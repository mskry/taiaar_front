import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';

import { UserService } from './../../../../services/user/user.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CartService } from './../../../../services/cart/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from './../../../../services/utility/utility.service';
import { Subscription } from 'rxjs';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { Component, OnInit, Input } from '@angular/core';
import { AddOnComponent } from './../../../../layout/shared/product/components/add-on/add-on.component';
import { FiltersModel } from 'src/app/shared/models/filters.model';
import { DataCacheService } from 'src/app/services/data-cache/data-cache.service';
import { skip } from 'rxjs/operators';
import { Settings } from 'http2';

@Component({
    selector: 'app-ecom-shop-now',
    templateUrl: './ecom-shop-now.component.html',
    styleUrls: ['./ecom-shop-now.component.scss']
})
export class EcomShopNowComponent implements OnInit {


    @Input() shopNow: any = [];
    @Input() settings: AppSettings;
    @Input() style: StyleVariables;


    isLoading: boolean = false;

    cart: Array<any> = [];
    categories: Array<any> = [];

    popularProducts: Array<any> = [];
    loggedIn: boolean = false;


    categorySubscription: Subscription;

    constructor(
        public utilityService: UtilityService,
        private router: Router,
        private route: ActivatedRoute

    ) {
        this.style = new StyleVariables();
    }

    ngOnInit(): void {

        this.categorySubscription = this.utilityService.getLanguageCategoryData.subscribe((data) => {
            if (data && data.english) {
                this.categories = data.english;
            }
        });
    }

    toProducts(cat) {
        let selectedCatPath: Array<string> = [];
        selectedCatPath.push(cat['name']);

        let seoValue = selectedCatPath.length ? selectedCatPath[selectedCatPath.length - 1].replace(/ &/g, '-') : '';
        let param_obj = {};
        Object.assign(param_obj, this.utilityService.handler);
        param_obj['subCatId'] = [cat.id];
        param_obj['category'] = cat.id;
        param_obj['product'] = this.route.snapshot.queryParamMap.get("product");
        param_obj['path'] = selectedCatPath;
        this.router.navigate(['/products', 'product-listing', seoValue], {
            queryParams: { f: this.utilityService.encryptData(param_obj) }
        });
    }


    ngOnDestroy(): void {
        if (this.categorySubscription) this.categorySubscription.unsubscribe();
    }

}
