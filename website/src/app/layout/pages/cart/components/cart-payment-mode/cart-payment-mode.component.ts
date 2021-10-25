import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalVariable } from './../../../../../core/global';
import { Component, OnInit, OnDestroy, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { AppSettings } from '../../../../../shared/models/appSettings.model';

@Component({
  selector: 'app-cart-payment-mode',
  templateUrl: './cart-payment-mode.component.html',
  styleUrls: ['./cart-payment-mode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPaymentModeComponent implements OnInit, OnDestroy {

  paymentType: '0' | '1' | '4' = '0';
  isSkip = false;
  currency: string = ''
  routeSubscription: Subscription;
  @Input() selfPickup: any;
  @Input() appointmentOrderInCart: number = 0;
  @Input() style: StyleVariables;
  @Input() settings: AppSettings;
  @Input() walletAmount: number = 0;

  @Input() hidePaymentModeOption: boolean = false;

  @Output() paymentMode: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeInRequest: EventEmitter<boolean> = new EventEmitter<boolean>();

  uniqueId : string = ''
  constructor(private route: ActivatedRoute) {
    this.currency = GlobalVariable.CURRENCY;
    this.uniqueId = GlobalVariable.UNIQUE_ID
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams
      .subscribe(params => {
        if (params['p_mode']) {
          this.paymentType = params['p_mode'];
          this.paymentMode.emit(params['p_mode']);
        } else {
          if (this.settings.payment_method == '1') {
            this.paymentType = '1';
            this.paymentMode.emit(this.paymentType);
          } else {
            this.paymentMode.emit(this.paymentType);
          }
        }
      });
      if(GlobalVariable.UNIQUE_ID == 'homent_0753' && this.settings.skip_payment_option ==1) {
        this.isSkip = true
      }
  }
  
  skipPayment(paymentType) {
    if (paymentType) {
      this.isSkip = true;
    } else {
      this.isSkip = false;
    }
    this.paymentMode.emit(paymentType ? '5' : '0');
  }
  ngOnDestroy(): void {
    if (!!this.routeSubscription) this.routeSubscription.unsubscribe();
  }

}
