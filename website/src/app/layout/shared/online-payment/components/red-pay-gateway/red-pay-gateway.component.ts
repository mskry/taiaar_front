import { GlobalVariable } from './../../../../../core/global';
import { WINDOW } from './../../../../../services/window/window.service';
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { UtilityService } from '../../../../../services/utility/utility.service';
import { ScriptService } from '../../../../../services/script/script.service';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { Subscription } from 'rxjs';
import { ScriptModel } from '../../../../../shared/models/script.model';
import { PaymentBaseComponent } from '../payment-base.component';
import { HttpService } from '../../../../../services/http/http.service';
import { ApiUrl } from 'src/app/core/apiUrl';
import { MessagingService } from 'src/app/services/messaging/messaging.service';

declare var $: any;

@Component({
    selector: 'app-red-pay-gateway',
    templateUrl: './red-pay-gateway.component.html',
    styleUrls: ['./red-pay-gateway.component.scss']
})
export class RedPayGatewayComponent extends PaymentBaseComponent implements OnInit, OnDestroy {


    style: StyleVariables;
    showAddCard: boolean = false;
    disabled: boolean = false;

    styleSubscription: Subscription;

    payment_objj = {

        "urlRedirect": "https://eps.banorte.com/secure3d/Solucion3DSecure.htm",
        "response": {
            "Card": "4242424242424242",
            "Expires": "12/23",
            "Total": "100.00",
            "CardType": "VISA",
            "MerchantId": "7786754",
            "MerchantName": "RED VOUCHER SYSTEMS",
            "MerchantCity": "CDMX",
            "ForwardPath": "https://appservicefrontdoor2.azurewebsites.net/api/Payment/webhookasync?additionalData=123",
            "Cert3D": "03", "Reference3D": "ceda5fd5-d6f3-4"
        }
    }


    constructor(
        private utilService: UtilityService,
        private scriptService: ScriptService,
        @Inject(WINDOW) private window: Window,
        @Inject(DOCUMENT) private document,
        private http: HttpService,
        private message: MessagingService,

    ) {
        super();
        this.style = new StyleVariables();
    }

    ngOnInit() {
        this.styleSubscription = this.utilService.getStyles.subscribe((style: StyleVariables) => {
            this.style = style;
        })

        //this.getPaymentUrl();

        this.postAndRedirect(this.payment_objj.urlRedirect, this.payment_objj.response);
    }

    getPaymentUrl() {
        var data = {
            amount: this.order.amount,
            currency: GlobalVariable.CURRENCY_NAME
        }
        this.http.postData(ApiUrl.getHyperPaymentUrl, data).subscribe((res: any) => {
            if (res.status == 200) {
                this.onSuccess.emit({
                    'paymentGatewayId': 'redpay',
                    'token': 'hyperpay',
                    'waitForSuccess': true,
                    'paymentUrl': ''
                });
                this.postAndRedirect(this.payment_objj.urlRedirect, this.payment_objj.response);
            }
            else {
                this.message.toast("error", "Payment could not processed");
            }
        })
    }


    postAndRedirect(url, postData) {
        var elements = new Array();
        for (var key in postData) {
            if (postData.hasOwnProperty(key)) {
                elements.push("<input type='hidden' name=" + key + " value=" + postData[key] + "></input>");
            }
        }
        var postForm = "<form method='POST' action=" + url + " id='frmPay'>" + elements + "</form>";

        $('body').html(postForm);
        $('#frmPay').submit();
    }




    ngOnDestroy(): void {
        if (this.styleSubscription) this.styleSubscription.unsubscribe();
    }

}
