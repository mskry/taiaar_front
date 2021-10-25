import { CartPriceModel } from './../../../../../shared/models/cart-price.model';
import { TranslateService } from '@ngx-translate/core';
import { MessagingService } from './../../../../../services/messaging/messaging.service';
import { AppSettings } from './../../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../../core/theme/styleVariables.model';
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { GlobalVariable } from './../../../../../core/global';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { Subscription } from 'rxjs';
import { Currency } from 'src/app/shared/models/apiKeys.model';

@Component({
  selector: 'app-loyalty-discount',
  templateUrl: './loyalty-discount.component.html',
  styleUrls: ['./loyalty-discount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoyaltyDiscountComponent implements OnInit, OnDestroy {

  @Input() style: StyleVariables;
  @Input() settings: AppSettings;
  @Input() loyalty_amount: number = 0;
  @Input() priceObj: CartPriceModel;
  @Input() loyalty_points: number = 0;
  @Output() loyaltylAmount: EventEmitter<number> = new EventEmitter<number>(null);

  currency: string = '';
  loyalty_applied: boolean = false;
  applied_admount: number = 0;

  utilSubscription: Subscription;
  public selected_currency: Currency = new Currency();


  constructor(
    private message: MessagingService,
    private translate: TranslateService,
    private util: UtilityService,
    private ref: ChangeDetectorRef,
  ) {

    this.currency = GlobalVariable.CURRENCY;
    this.ref.detach();
    setInterval(() => { this.ref.detectChanges(); }, 2000);
  }

  ngOnInit(): void {
    if (this.settings.is_multicurrency_enable) {
      this.getCurrency();
    }
  }

  applyReferral(): void {
    if (this.settings.enable_min_loyality_points) {
      if (this.loyalty_points >= this.settings.min_loyalty_points_to_redeem) {
        this.setLoyaltyPoints();
        return
      }
      else {
        this.message.toast('info', `Loyalty Points Must Be Greater Than Or Equal To ${this.settings.min_loyalty_points_to_redeem}`);
        return;
      }
    }
    this.setLoyaltyPoints();
  }

  setLoyaltyPoints() {
    this.loyalty_applied = !this.loyalty_applied;
    this.message.toast('success', `Loyalty Points Discount ${this.loyalty_applied ? this.translate.instant('Applied') : this.translate.instant('Removed')} ${this.translate.instant('Successully')}`);
    if (this.loyalty_applied) {
      this.applied_admount = this.loyalty_amount > this.priceObj.netTotal ? this.priceObj.netTotal : this.loyalty_amount;
    } else {
      this.applied_admount = 0;
    }
    this.loyaltylAmount.emit(this.applied_admount);
  }


  getCurrency() {
    this.utilSubscription = this.util.getSelectedCurrency.subscribe((res: any) => {
      if (res) {
        this.selected_currency = Object.assign({}, res);
        if (this.selected_currency.currency_name) {
          this.currency = this.selected_currency.currency_name;
        }
      }
    })
  }

  ngOnDestroy(): void {
    if (this.utilSubscription) {
      this.utilSubscription.unsubscribe();
    }
  }
}
