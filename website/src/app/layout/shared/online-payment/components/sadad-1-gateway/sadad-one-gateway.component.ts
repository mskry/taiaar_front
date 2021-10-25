import { PaymentBaseComponent } from '../payment-base.component';
import { MessagingService } from '../../../../../services/messaging/messaging.service';
import { HttpService } from '../../../../../services/http/http.service';
import { Component, Inject, OnInit } from '@angular/core';
import { WINDOW } from '../../../../../services/window/window.service';
@Component({
  selector: 'app-sadad-one-gateway',
  templateUrl: './sadad-one-gateway.component.html',
})
export class SadadOneGatewayComponent extends PaymentBaseComponent implements OnInit {

  isLoading: boolean = false;

  constructor(
    private http: HttpService,
    @Inject(WINDOW) private window: Window,
    private message: MessagingService

  ) {
    super();
  }

  ngOnInit() {
    this.redirectingToSadadQa();
  }


  redirectingToSadadQa() {
    var marchent = this.gateway.key_value_front.find(x => x.key == "merchent_id");
    var secret = this.gateway.key_value_front.find(x => x.key == "secret_key");
    if (marchent.value && secret.value) {
      const url = `${this.window.origin}/sadad/index.php?order_id=${this.order.user.id + this.order.user.firstname}&item_name=RoyoOrder&email=${this.order.user.email}&phone_number=${this.order.address.phone_number}&MERCHANT_ID=${marchent.value}&SECRET_KEY=${secret.value}&amount=${this.order.amount}`;
      // this.window.open(url);
      this.onSuccess.emit({
        'paymentGatewayId': 'sadadqa',
        'token': 'sadadqa',
        'waitForSuccess': true,
        'paymentUrl': url
      });
    }
    else {
      this.message.toast("error", "Payment Gateway Error");
    }
  }



  onSubmitForm() {
    var form = document.getElementById('sadad_payment_form') as any;
    form.method = "post";
    form.action = "https://sadadqa.com/webpurchase";
    form.submit();
  }

}
