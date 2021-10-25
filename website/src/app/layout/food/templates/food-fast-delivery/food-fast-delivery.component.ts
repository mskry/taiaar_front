import { skip } from 'rxjs/operators';
import { DataCacheService } from './../../../../services/data-cache/data-cache.service';
import { Subscription } from 'rxjs';
import { LocalizationPipe } from '../../../../shared/pipes/localization.pipe';
import { ApiUrl } from '../../../../core/apiUrl';
import { MessagingService } from '../../../../services/messaging/messaging.service';
import { UserService } from '../../../../services/user/user.service';
import { HttpService } from '../../../../services/http/http.service';
import { GlobalVariable } from '../../../../core/global';
import { Router } from '@angular/router';
import { UtilityService } from '../../../../services/utility/utility.service';
import { AppSettings } from '../../../../shared/models/appSettings.model';
import { StyleVariables } from '../../../../core/theme/styleVariables.model';
import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-food-fast-delivery',
    templateUrl: './food-fast-delivery.component.html',
    styleUrls: ['./food-fast-delivery.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodFastDeliveryComponent implements OnInit, OnDestroy {

    @Input() isLoading: boolean = false;
    @Input() style: StyleVariables;
    @Input() settings: AppSettings;
    locationSubscription: Subscription;
    loggedIn: boolean = false;
    currency: string = "";
    supplier: any;
    showSupplier: boolean = false;
    suppliers: Array<any> = [];
    parentIndex: number = -1;
    childIndex: number = -1;

    siteName: string = '';
    count: number = 0;

    slideConfig = {
        "slidesToShow": 2,
        "slidesToScroll": 1,
        "dots": true,
        "arrows": false,
        "infinite": false,
        "autoplay": true,
        "autoplaySpeed": 3000
    };

    constructor(
        public util: UtilityService,
        private router: Router,
        private http: HttpService,
        private userService: UserService,
        private message: MessagingService,
        private translate: TranslateService,
        private localization: LocalizationPipe,
        private data_cache: DataCacheService
    ) {
        this.siteName = GlobalVariable.SITE_NAME;
        this.style = new StyleVariables();
    }

    ngOnInit() {

        if (this.settings.selected_template == 2) {
            this.slideConfig.slidesToShow = GlobalVariable.IS_MOBILE ? 1 : 3;
        }

        this.locationSubscription = this.util.getUserLocation.pipe(skip(1)).subscribe((location) => {
            this.data_cache.removeKey(ApiUrl.getFastestDeliverySuppliers);
            this.getFastDeliveryData();
          });

        this.getFastDeliveryData();
    }

    getFastDeliveryData() {
        var paramData = {
            latitude: this.util.handler.latitude,
            longitude: this.util.handler.longitude,
            languageId: this.util.handler.languageId,
            offset: 0,
        }

        this.http.getData(ApiUrl.getFastestDeliverySuppliers, paramData, true, true).subscribe((res: any) => {
            this.suppliers = [];
            this.count = res.data.length;
            this.suppliers = res.data.slice(0, 12);
        })
    }

    onSeeMore() {
        this.router.navigate(['/', 'supplier', 'supplier-list'], {
            queryParams: {
                'fast_delivery': 1
            }
        })
    }

    productList(supplier) {
        if (this.settings.app_type == 1) {
            this.router.navigate(['/', 'products', 'listing'], {
                queryParams: {
                    supplierId: supplier.id
                }
            });
        }
    }

    wishlist(status, detail) {
        this.loggedIn = !!this.userService.getUserToken;
        if (!this.loggedIn) {
            this.message.alert('warning', this.translate.instant('Please Login First'));
            return;
        }
        let param_data = {
            status: +status,
            supplierId: detail['id'],
            accessToken: this.userService.getUserToken
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
    trackBySuppFn(id, index) {
        return index;
    };
    trackByUtilSuppFn(id, index) {
        return index;
    };
    trackBySuppliersFn(id, index) {
        return index;
    };
    trackByUtilFakeFn(id, index) {
        return index;
    };

    ngOnDestroy() {
        if(this.locationSubscription) this.locationSubscription.unsubscribe();
    }

}
