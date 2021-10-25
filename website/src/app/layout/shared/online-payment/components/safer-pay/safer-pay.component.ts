import { GlobalVariable } from 'src/app/core/global';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { ScriptService } from './../../../../../services/script/script.service';
import { ScriptModel } from './../../../../../shared/models/script.model';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { PaymentBaseComponent } from './../payment-base.component';
import { Component, OnInit } from '@angular/core';
declare const SaferpayFields: any;

@Component({
  selector: 'app-safer-pay',
  templateUrl: './safer-pay.component.html',
  styleUrls: ['./safer-pay.component.scss']
})
export class SaferPayComponent extends PaymentBaseComponent implements OnInit {

  // saferPay_keys: any = {
  //   customer_id: '',
  //   api_key: ''
  // };

  isLoading: boolean = false;

  constructor(
    private util: UtilityService,
    // private scriptService: ScriptService,
    private http: HttpService
  ) {
    super();
  }

  ngOnInit() {

    // const keys = this.gateway.key_value_front.filter((item) => item.for_front == 1);

    // keys.forEach(el => {
    //   if(el.key === 'saferpay_api_key') {
    //     this.saferPay_keys.api_key = el.value;
    //   }
    //   if(el.key === 'saferpay_customer_id') {
    //     this.saferPay_keys.customer_id = el.value;
    //   }
    // });

    // const saferPayScript = new ScriptModel('saferpay', 'https://test.saferpay.com/Fields/lib/1/saferpay-fields.js');

    // this.scriptService.loadScript(saferPayScript).then((script: ScriptModel) => {
    //   if (!script.isLoaded) {
    //     this.onError.emit('unable to load saferpay script');
    //     return;
    //   }
    //   this.init();
    // });

    this.init();
  }

  init() {
    this.isLoading = true;

    let params = {
      amount: this.order.amount.toString(),
      currency: GlobalVariable.CURRENCY_NAME,
      languageId: this.util.handler.languageId.toString(),
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/failure`
    }

    this.http.postData(ApiUrl.saferpay_payment, params)
      .subscribe(response => {
        if (!!response && response.data) {
          this.onSuccess.emit({
            'paymentGatewayId': 'saferpay',
            'token': 'xxxx',
            'waitForSuccess': true,
            'paymentUrl': response.data.Redirect['RedirectUrl']
          });
        }
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });

    // SaferpayFields.init({
    //   apiKey: this.saferPay_keys.api_key,
    //   url: `https://test.saferpay.com/Fields/${this.saferPay_keys.customer_id}`,
    //   style: {
    //     '.form-control': 'border: none; border-bottom: solid 1px #ccc; border-radius: unset;'
    //   },
    //   paymentMethods: ["visa", "mastercard"],
    //   onSuccess: function () {
    //     //Callback on successful Init
    //   },
    //   onError: function (evt) {
    //     console.log('Error in init: ' + evt.message);
    //   },
    //   placeholders: {
    //     holdername: 'Card holder',
    //     cardnumber: '0000 0000 0000 0000',
    //     expiration: 'MM/YY',
    //     cvc: 'CVC'
    //   }
    // });
  }

  // submit() {
  //   SaferpayFields.submit({
  //     onSuccess: (evt) => {
  //       let self = this;
  //       self.onSuccess.emit({
  //         'paymentGatewayId': 'saferpay',
  //         'token': evt['token']
  //       });
  //     },
  //     onError: (evt) => {
  //       let self = this;
  //       self.onError.emit('transaction failed');
  //     }
  //   });
  // }

}
