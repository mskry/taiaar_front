import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PluginService } from './service/pluginservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentBaseComponent } from '../payment-base.component';
import { GlobalVariable } from 'src/app/core/global';
import * as resJson from './constant/response-code.json'

@Component({
  selector: 'app-urway-gateway',
  templateUrl: './urway-gateway.component.html',
  styleUrls: ['./urway-gateway.component.scss']
})
export class UrwayGatewayComponent extends PaymentBaseComponent implements OnInit {
  showAddCard: boolean = true;

  constructor(private services: PluginService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {
    let keyArray = ['URWAY_TERMINALID', 'URWAY_PASSWORD', 'URWAY_MERCHANTKEY', 'URWAY_URL']

    let obj = {};
    for (let i = 0; i < this.gateway.key_value_front.length; i++) {
      let col = this.gateway.key_value_front[i];
      if (col.for_front == 1 && keyArray.includes(col.key)) {
        let keyName = '';
        if (col.key == 'URWAY_URL') {
          keyName = 'service_url';
        } else {
          keyName = (col.key.replace('URWAY_', '')).toLowerCase();
        }
        obj[keyName] = col.value;
      }
    }

    let keySet = this.services.setData(obj);

    // if(keySet) {
    //   setTimeout(() => {
    //     this.submitOrderDetail();
    //   }, 1200);
    // }

    // this.currency = GlobalVariable.CURRENCY;
    // COUNTRY GlobalVariable.COUNTRY_CODE

  }

  submitOrderDetail($event, status) {
    let payload = {
      'amount': this.order.amount,
      'email': this.order.user.email,
      'currency': ("" + GlobalVariable.CURRENCY_NAME).toUpperCase(),
      'trackid': Date.now().toString(),
      'country': ("" + GlobalVariable.COUNTRY).toUpperCase(),
      'firstName': this.order.user.firstName
    }

    var setCurrency = payload.currency;

    localStorage.setItem('getCurrency', setCurrency);

    let redirectURL = ""
    this.services.postData(JSON.stringify(payload)).subscribe(
      res => {
        let getResponse = JSON.parse(JSON.stringify(res));
        if (resJson[getResponse['responseCode']]) {
          redirectURL = getResponse['targetUrl'].replace('?', '') + "?paymentid=" + getResponse['payid'];
          this.router.navigate(['payment-status'], { queryParams: getResponse });
        }
        else {
          redirectURL = getResponse['targetUrl'].replace('?', '') + "?paymentid=" + getResponse['payid'];
          let data = {}
          data = {
            'paymentGatewayId': 'urway',
            'token': 'xxxx',
            'waitForSuccess': true,
            'paymentUrl': redirectURL
          }
          this.onSuccess.emit(data);
        }
      }
    );
  }

  onCardSelect($event) {
    this.onSuccess.emit($event);
  }

}
