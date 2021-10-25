import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { UtilityService } from '../../../../../services/utility/utility.service';
import { ScriptService } from '../../../../../services/script/script.service';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { Subscription } from 'rxjs';
import { ScriptModel } from '../../../../../shared/models/script.model';
import { PaymentBaseComponent } from '../payment-base.component';
import { TranslateService } from '@ngx-translate/core';
import { WINDOW } from 'src/app/services/window/window.service';
declare const $: any;
declare const Stripe: any;
declare const StripeCheckout: any;

@Component({
  selector: 'app-stripe-3d-gateway',
  templateUrl: './stripe-3d-gateway.component.html',
  styleUrls: ['./stripe-3d-gateway.component.scss']
})
export class Stripe3DGatewayComponent extends PaymentBaseComponent implements OnInit, OnDestroy {

  style: StyleVariables;
  showAddCard: boolean = false;
  redirectingUrl: string = ''

  private stripe: any;
  private card: any;

  styleSubscription: Subscription;

  constructor(
    @Inject(WINDOW) private window: Window,
    private utilService: UtilityService,
    private scriptService: ScriptService,
    private translate: TranslateService
  ) {
    super();
    this.style = new StyleVariables();
  }

  ngOnInit() {
    this.subscribeStripe();
  }

  subscribeStripe() {

    const { key, value } = this.gateway.key_value_front.find((item) => item.for_front == 1);

    const stripeScript = new ScriptModel('stripe', 'https://js.stripe.com/v3/');

    this.scriptService.loadScript(stripeScript).then((script: ScriptModel) => {
      if (!script.isLoaded) {
        this.onError.emit('unable to load stripe script');
        return;
      }

      // Create Checkout's handler

    const newstripeScript = new ScriptModel('stripe', 'https://checkout.stripe.com/checkout.js');

      this.scriptService.loadScript(newstripeScript).then((script: ScriptModel) => {
        if (!script.isLoaded) {
          this.onError.emit('unable to load stripe script');
          return;
        }
      this.stripe = Stripe(value);
      const elements = this.stripe.elements();

        var handler = StripeCheckout.configure({
          key: value,
          image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
          locale: 'auto',
          allowRememberMe: false,
          token: ( (token) => {
            this.stripe = Stripe(value);
            this.stripe.createSource({
              type: 'card',
              token: token.id
            }).then((result) => {
                console.log(result)
                this.stripeCardResponseHandler(result.source.status ,result.source);
            })
            this.displayProcessing();
          })

          
        });
        // $('#customButton').on('click', function (e) {
          handler.open({
            name: 'Stripe.com',
            description: '2 widgets',
            amount: Math.round(this.order.amount) * 100,
            currency: 'usd'
          });
          // e.preventDefault();
        // });
      })
    })
  }



  stripeCardResponseHandler(status, response) {
    console.log(response)
    console.log(status)
    if (response.error) {
      var message = response.error.message;
      this.displayResult("Unexpected card source creation response status: " + status + ". Error: " + message);
      return;
    }

    // check if the card supports 3DS
    if (response.card.three_d_secure == 'not_supported') {
      this.displayResult("This card does not support 3D Secure.");
      return;
    }

    // since we're going to use an iframe in this example, the
    // return URL will only be displayed briefly before the iframe
    // is closed. Set it to a static page on your site that says
    // something like "Please wait while your transaction is processed"
    var returnURL = `${this.window.origin}/cart`;

    // create the 3DS source from the card source
    this.stripe.createSource({
      type: 'three_d_secure',
      amount: 1099,
      currency: "eur",
      three_d_secure: {
        card: response.id
      },
      redirect: {
        return_url: returnURL
      }
    },).then((result) => {
      console.log(result)
      this.stripe3DSecureResponseHandler(result.source.status ,result.source);
  });
  }

  displayProcessing() {
    console.log('In Display Processing')
    document.getElementById("processing").style.display = 'block';

    // document.getElementById("charge-form").style.display = 'none';
    document.getElementById("result").style.display = 'none';
  }

  displayResult(resultText) {
    document.getElementById("processing").style.display = 'none';

    document.getElementById("charge-form").style.display = 'block';
    document.getElementById("result").style.display = 'block';
    document.getElementById("result").innerText = resultText;
  }

  stripe3DSecureResponseHandler(status, response) {
    if (response.error) {
      var message = response.error.message;
      this.displayResult("Unexpected 3DS source creation response status: " + status + ". Error: " + message);
      return;
    }

    // check the 3DS source's status
    if (response.status == 'chargeable') {
      this.displayResult("This card does not support 3D Secure authentication, but liability will be shifted to the card issuer.");
      return;
    } else if (response.status != 'pending') {
      this.displayResult("Unexpected 3D Secure status: " + response.status);
      return;
    }

    // start polling the source (to detect the change from pending
    // to either chargeable or failed)
    this.stripe.retrieveSource({id: response.id, client_secret: response.client_secret})
    .then((result) => {
      this.stripe3DSStatusChangedHandler(result.source.status, result.source);
    })

    // open the redirect URL in an iframe
    // (in this example we're using Featherlight for convenience,
    // but this is of course not a requirement)
    this.redirectingUrl = response.redirect.url
    let a = document.createElement('a');
        //a.target = '_blank'
        a.href = response.redirect.url;
        a.click();

    console.log(response);
  }

  stripe3DSStatusChangedHandler(status, source) {
    if (source.status == 'chargeable') {
      $.featherlight.current().close();
      var msg = '3D Secure authentication succeeded: ' + source.id + '. In a real app you would send this source ID to your backend to create the charge.';
      this.displayResult(msg);
    } else if (source.status == 'failed') {
      $.featherlight.current().close();
      var msg = '3D Secure authentication failed.';
      this.displayResult(msg);
    } else if (source.status != 'pending') {
      $.featherlight.current().close();
      var msg = "Unexpected 3D Secure status: " + source.status;
      this.displayResult(msg);
    }
  }



  ngOnDestroy(): void {
    if (this.styleSubscription) this.styleSubscription.unsubscribe();
  }

}

