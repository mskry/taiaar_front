import { GlobalVariable } from './../../../../../core/global';
import { ApiUrl } from './../../../../../core/apiUrl';
import { PaymentBaseComponent } from './../payment-base.component';
import { Component, OnInit, Inject } from '@angular/core';

/*** */
import { HttpService } from './../../../../../services/http/http.service';
import { WINDOW } from 'src/app/services/window/window.service';
import { MessagingService } from 'src/app/services/messaging/messaging.service';


@Component({
    selector: 'app-paymaya-gateway',
    template: `<app-processing-indicator *ngIf="isLoading"></app-processing-indicator>`,
    styles: []
})
export class PaymayaGatewayComponent extends PaymentBaseComponent implements OnInit {

    isLoading: boolean = false;

    constructor(
        private http: HttpService,
        @Inject(WINDOW) private window: Window,
        private message: MessagingService
    ) {
        super();
    }

    ngOnInit() {
        this.isLoading = true;
        this.http.postData(ApiUrl.getPaymayaUrl, {
            amount: parseFloat(this.order.amount).toFixed(2),
            currency: GlobalVariable.CURRENCY_NAME,
            userId: this.order.user.id,
            failureUrl: this.window.origin + '/failure',
            successUrl: this.window.origin + '/success'
        }).subscribe((response) => {
            this.isLoading = false;
            if (response && response.status == 200) {
                this.onSuccess.emit({
                    'paymentGatewayId': 'paymaya',
                    'token': response.data['checkoutId'],
                    'waitForSuccess': true,
                    'paymentUrl': response.data['redirectUrl']
                });
            }
        }, (err) => {
            this.isLoading = false;
            this.onClose.emit(false);
        });
    }

}
