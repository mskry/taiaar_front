import { PaymentBaseComponent } from '../payment-base.component';
import { MessagingService } from '../../../../../services/messaging/messaging.service';
import { HttpService } from '../../../../../services/http/http.service';
import { Component, Inject, OnInit } from '@angular/core';
import { WINDOW } from '../../../../../services/window/window.service';
@Component({
    selector: 'app-transbank-gateway',
    template: '',
})
export class TransbankGatewayComponent extends PaymentBaseComponent implements OnInit {

    isLoading: boolean = false;

    constructor(
        private http: HttpService,
        @Inject(WINDOW) private window: Window,
        private message: MessagingService

    ) {
        super();
    }

    ngOnInit() {
        this.redirectingToTransbank();
    }


    redirectingToTransbank() {
        var marchent = this.gateway.key_value_front.find(x => x.key == "transbank_mode");
        var secret = this.gateway.key_value_front.find(x => x.key == "transbank_key");
        if (marchent.value && secret.value) {
            const url = `${this.window.origin}/transbank/index.php?amount=${this.order.amount}&order=${Math.floor(100000 + Math.random() * 900000)}&session=${Math.floor(100000 + Math.random() * 900000)}&return_url=${this.window.origin + '/transbank/result.php'}&final_url=${this.window.origin + '/transbank/result.php'}`;
            // this.window.open(url);
            this.onSuccess.emit({
                'paymentGatewayId': 'transbank',
                'token': 'transbank',
                'waitForSuccess': true,
                'paymentUrl': url
            });
        }
        else {
            this.message.toast("error", "Payment Gateway Error");
        }
    }

}