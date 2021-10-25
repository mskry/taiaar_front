import { GlobalVariable } from './../../../../core/global';

import { ApiUrl } from './../../../../core/apiUrl';
import { CartService } from './../../../../services/cart/cart.service';
import { Router } from '@angular/router';
import { HttpService } from './../../../../services/http/http.service';
import { UtilityService } from './../../../../services/utility/utility.service';
import { Subscription } from 'rxjs';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AddOnComponent } from '../../../../layout/shared/product/components/add-on/add-on.component';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from '../../../../services/user/user.service';
import { MessagingService } from 'src/app/services/messaging/messaging.service';
import { LocalizationPipe } from 'src/app/shared/pipes/localization.pipe';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-food-recent-order',
    templateUrl: './food-recent-order.component.html',
})
export class FoodRecentOrderComponent implements OnInit, OnDestroy {

    @Input() settings: AppSettings;
    @Input() style: StyleVariables;

    themeSubscription: Subscription;
    cartSubscription: Subscription;
    userSubscription: Subscription;

    cart: Array<any> = [];

    supplierId: string = "";
    recentOrdersList: Array<any> = [];
    count: number = 0;

    isDarkTheme: boolean = false;
    isLoading: boolean = false;

    uniqueId: string = GlobalVariable.UNIQUE_ID;

    loggedIn: boolean = false;

    productstate: any = {
        hideSupplier: true
    }


    constructor(
        public util: UtilityService,
        private http: HttpService,
        private router: Router,
        private user: UserService,
        public cartService: CartService,
        public dialogService: DialogService,
        private message: MessagingService,
        private localization: LocalizationPipe,
        private translate: TranslateService,
    ) { }

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
    }

    getData() {
        this.getOrders();
    }

    getOrders() {
        this.isLoading = true; 
        let orderApi = ApiUrl.orders.getOrderHistory;

        let param_data = {
            languageId: this.util.handler.languageId,
            accessToken: this.user.getUserToken,
            offset: 0,
            limit: 6
        };
        this.http.postData(orderApi, param_data)
            .subscribe(response => {
                this.isLoading = false;
                if (!!response && response.data) {
                    this.count = response.data.count;
                    this.recentOrdersList = response.data.orderHistory;
                }
            }, (err) => this.isLoading = false);
    }


    onSeeMore() {
        let params = {
            all: 1,
            top_selling: 1
        }

        this.router.navigate(['/', 'orders', 'order-listing'], {
            queryParams: params
        });
    }


    cancelOrder(order: any) {
        this.message.confirm(`${this.translate.instant('Cancel This')} ${this.localization.transform('order')}`).then(data => {
            if (data.value) {
                let param_data = {
                    languageId: this.util.handler.languageId,
                    accessToken: this.user.getUserToken,
                    orderId: order['order_id'],
                    isScheduled: order['schedule_order']
                };
                this.http.postData(ApiUrl.orders.cancelOrder, param_data)
                    .subscribe(response => {
                        if (!!response && response.data) {
                            this.message.toast('success', `${this.localization.transform('order')} ${this.translate.instant('Cancelled Successfully')}`);
                            this.getOrders();
                        }
                    });
            }
        });
    }


    ngOnDestroy() {
        if (!!this.themeSubscription) this.themeSubscription.unsubscribe();
        if (!!this.cartSubscription) this.cartSubscription.unsubscribe();
        if (!!this.userSubscription) this.userSubscription.unsubscribe();

    }
}