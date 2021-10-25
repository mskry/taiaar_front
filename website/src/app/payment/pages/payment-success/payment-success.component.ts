import { MessagingService } from './../../../services/messaging/messaging.service';
import { UtilityService } from './../../../services/utility/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from './../../../core/apiUrl';
import { HttpService } from './../../../services/http/http.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {

  orderId: any = '';
  isLoading: boolean = false;
  userSubscription: Subscription;
  user: any
  payload: any = {}
  constructor(
    private utilityService: UtilityService,
    private message: MessagingService,
    private httpService: HttpService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    @Inject(LOCAL_STORAGE) private localStorage: any,

  ) {
    this.checkError();
  }

  ngOnInit() {
    this.userSubscription = this.userService.currentUser.subscribe((user) => {
      if (!!user) {
        this.user = user;
      }
    });
    this.payload = this.utilityService.getLocalData('gop', true);
    if (['urway'].includes(this.payload['gateway_unique_id'])) {
      this.addCardDetails()
    } else {
      this.generateOrder(this.payload)
    }
  }

  generateOrder(payload) {

    if (payload) {
      switch (payload['gateway_unique_id']) {
        case 'myfatoorah':
          payload['payment_token'] = this.route.snapshot.queryParams['paymentId'];
          break;

        case 'tap':
          payload['payment_token'] = this.route.snapshot.queryParams['tap_id'];
          break;

        case 'converge':
          payload['payment_token'] = this.route.snapshot.queryParams['ssl_txn_id'];
          break;

        case 'windcave':
          payload['payment_token'] = this.route.snapshot.queryParams['result'];
          break;

        case 'mpaisa':
          payload['payment_token'] = this.route.snapshot.queryParams['tID'];
          break;
        case 'telr':
          payload['payment_token'] = this.route.snapshot.queryParams['tran_id'];
          break;
        case 'hyperpay':
          payload['payment_token'] = this.route.snapshot.queryParams['id'];
          break;
        case 'thawani':
          payload['payment_token'] = this.route.snapshot.queryParams['id'];
          break;
        case 'sadadqa':
          payload['payment_token'] = this.route.snapshot.queryParams['tran_id'];
          break;
        case 'transbank':
          var res = JSON.stringify(this.route.snapshot.queryParams['response'])
          payload['payment_token'] = res['buyOrder'];
          break;
        case 'paymaya':
          payload['payment_token'] = this.route.snapshot.queryParams['ref_id'];
          break;
        case 'saferpay':
          payload['payment_token'] = this.route.snapshot.queryParams['requestId'];
        case 'urway':
          payload['payment_token'] = this.route.snapshot.queryParams['cardToken'];
          break;
        case 'paynow':
          payload['payment_token'] = this.route.snapshot.queryParams['referenceId'];
          break;
      }

      let transactionType = this.utilityService.getLocalData('transactionType')
      if (transactionType == 'wallet') {
        this.isLoading = true;
        this.httpService.postData(ApiUrl.addWalletMoney, payload).subscribe((response) => {
          this.router.navigate(['/', 'account', 'my-wallet']).then(() => {
            if (response && response.status == 200) {
              this.message.toast('success', 'money added');
            } else {
              this.message.toast('success', 'payment failed');
            }
            this.utilityService.setLocalData('transactionType', null);
            this.utilityService.setLocalData('gop', null);
          });
        }, (err) => {
          this.router.navigate(['/', 'account', 'my-wallet']).then(() => {
            this.message.toast('success', 'payment failed');
            this.utilityService.setLocalData('transactionType', null);
            this.utilityService.setLocalData('gop', null);
          });
        })
      } else if (transactionType == 'subscription') {
        this.httpService.postData(ApiUrl.buySubscription, payload).subscribe((response) => {
          if (response) {
            this.router.navigate(['/', 'account', 'subscriptions']).then(() => {
              if (response && response.status == 200) {
                this.message.toast('success', 'subscription added');
              } else {
                this.message.toast('success', 'payment failed');
              }
              this.utilityService.setLocalData('transactionType', null);
              this.utilityService.setLocalData('gop', null);
            });
          }
          this.isLoading = false;
        }, (err) => this.router.navigate(['/', 'account', 'subscriptions']).then(() => {
          this.message.toast('success', 'payment failed');
          this.utilityService.setLocalData('transactionType', null);
          this.utilityService.setLocalData('gop', null);
        }))
      }
      else {
        this.httpService.postData(ApiUrl.generateOrder, payload, false)
          .subscribe(response => {
            if (!!response && response.data) {
              this.orderId = response.data;
              localStorage.removeItem('gop');
              this.utilityService.setCart([]);
              setTimeout(() => {
                this.onViewOrder();
              }, 2000);
            }
          });
      }


    }
  }

  addCardDetails() {
    const payload: any = {
      gateway_unique_id: this.payload['gateway_unique_id'],
      user_id: this.user.id,
      card_number: this.route.snapshot.queryParams['maskedPAN'],
      card_holder_name: 'TEst',
      card_type: '',
      cvc: '123',
      exp_year: '22',
      exp_month: '11',
      card_nonce:this.route.snapshot.queryParams['cardToken']
    };
    this.isLoading = true;
    this.httpService.postData(ApiUrl.addCard, payload)
      .subscribe(response => {
        if (!!response && response.data) {
          this.message.toast('success', `Card Added Successfully'`);
          this.user.customer_payment_id = this.user.id;
          this.localStorage.setItem('web_user', JSON.stringify(this.user));

          this.generateOrder(this.payload)
        } else {
          this.router.navigate(['/cart/list']);
        }
        this.isLoading = false
      }, err => {
        this.isLoading = false;
      });
  }

  onViewOrder(): void {
    this.router.navigate(['/orders/order-detail'], { queryParams: { orderId: this.orderId } });
  }

  checkError() {
    if (this.route.snapshot.queryParams['rCode'] == 111) {
      return this.router.navigate(['/', 'failure']);
    }
  }

}
