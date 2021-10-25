import { GlobalVariable } from './../../../../../core/global';
import { ApiUrl } from './../../../../../core/apiUrl';
import { PaymentBaseComponent } from './../payment-base.component';
import { Component, OnInit, Inject } from '@angular/core';

/*** */
import { HttpService } from './../../../../../services/http/http.service';
import { WINDOW } from 'src/app/services/window/window.service';
import { MessagingService } from 'src/app/services/messaging/messaging.service';


@Component({
    selector: 'app-telr-gateway',
    template: `<app-processing-indicator *ngIf="isLoading"></app-processing-indicator>`,
    styles: []
})
export class TelrGatewayComponent extends PaymentBaseComponent implements OnInit {

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
        this.http.getData(ApiUrl.getTelrPaymentUrl, {
            amount: parseFloat(this.order.amount).toFixed(2),
            currency: GlobalVariable.CURRENCY_NAME,
            desc: 'Telr',
            success_url: this.window.origin + '/success',
            cancel_url: this.window.origin + '/failure'
        }).subscribe((response) => {
            this.isLoading = false;
            if (response && response.status == 200) {
                if (response.data.error && response.data.error.message) {
                    this.message.toast('error', response.data.error.message);
                    return;
                }
                this.onSuccess.emit({
                    'paymentGatewayId': 'telr',
                    'token': response.data['order']['ref'],
                    'waitForSuccess': true,
                    'paymentUrl': response.data['order']['url']
                });
            }
        }, (err) => {
            this.isLoading = false;
            this.onClose.emit(false);
        });
    }

}
