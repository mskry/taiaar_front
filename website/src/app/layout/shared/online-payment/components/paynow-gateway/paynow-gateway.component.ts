import { GlobalVariable } from 'src/app/core/global';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { ScriptService } from './../../../../../services/script/script.service';
import { ScriptModel } from './../../../../../shared/models/script.model';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { PaymentBaseComponent } from './../payment-base.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paynow-gateway',
  templateUrl: './paynow-gateway.component.html',
  styleUrls: ['./paynow-gateway.component.scss']
})
export class PaynowGatewayComponent extends PaymentBaseComponent implements OnInit {

  isLoading: boolean = false;

  constructor(
    private util: UtilityService,
    // private scriptService: ScriptService,
    private http: HttpService
  ) {
    super();
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.isLoading = true;

    let params = {
      amount: this.order.amount.toString(),
      currency: GlobalVariable.CURRENCY_NAME,
      languageId: this.util.handler.languageId.toString(),
      return_url: `${window.location.origin}/checkout`,
      // success_url: `${window.location.origin}/success`,
      // cancel_url: `${window.location.origin}/failure`
    }

    this.http.postData(ApiUrl.paynow_payment, params)
      .subscribe(response => {
        if (!!response && response.data) {
          this.onSuccess.emit({
            'paymentGatewayId': 'paynow',
            'token': 'xxxx',
            'waitForSuccess': true,
            'paymentUrl': response.data['redirectUrl']
          });
        }
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });
  }


} 
