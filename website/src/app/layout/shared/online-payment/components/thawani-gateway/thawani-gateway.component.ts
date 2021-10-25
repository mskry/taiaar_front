import { GlobalVariable } from './../../../../../core/global';
import { WINDOW } from './../../../../../services/window/window.service';
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { PaymentBaseComponent } from '../payment-base.component';
import { HttpService } from '../../../../../services/http/http.service';
import { ApiUrl } from 'src/app/core/apiUrl';
import { MessagingService } from 'src/app/services/messaging/messaging.service';

declare var $: any;

@Component({
    selector: 'app-thawani-gateway',
    template: `<app-processing-indicator *ngIf="isLoading"></app-processing-indicator>`,
})
export class ThawaniGatewayComponent extends PaymentBaseComponent implements OnInit, OnDestroy {

    isLoading: boolean = false;


    constructor(
        private http: HttpService,
        private message: MessagingService,
        @Inject(WINDOW) private window: Window,


    ) {
        super();
    }

    ngOnInit() {
        this.getPaymentUrl();
    }

    getPaymentUrl() {
        this.isLoading = true;
        var data = {
            amount: this.order.amount,
            name: this.order.user.firstname,
            email: this.order.user.email,
            success_url: this.window.origin + '/success',
            cancel_url: this.window.origin + '/failure',
        }
        this.http.getData(ApiUrl.getThawaniPaymentUrl, data).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status == 200) {
                this.onSuccess.emit({
                    'paymentGatewayId': 'thawani',
                    'token': 'thawani',
                    'waitForSuccess': true,
                    'paymentUrl': res.data
                });
            }
            else {
                this.message.toast("error", "Payment could not processed");
            }
        })
    }


    ngOnDestroy(): void {

    }

}
