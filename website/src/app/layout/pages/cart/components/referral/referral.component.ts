import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { StyleVariables } from './../../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../../shared/models/appSettings.model';
import { HttpService } from './../../../../../services/http/http.service';
import { ApiUrl } from './../../../../../core/apiUrl';
import { GlobalVariable } from './../../../../../core/global';
import { MessagingService } from './../../../../../services/messaging/messaging.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Currency } from 'src/app/shared/models/apiKeys.model';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralComponent implements OnInit {

  @Input() style: StyleVariables;
  @Input() settings: AppSettings;
  @Output() referralAmount: EventEmitter<number> = new EventEmitter<number>(null);

  currency: string = '';
  referral_applied: boolean = false;
  referral_amount: number = 0;

  utilSubscription: Subscription;
  public selected_currency: Currency = new Currency();

  constructor(
    private http: HttpService,
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
    this.getReferralAmount();
    if (this.settings.is_multicurrency_enable) {
      this.getCurrency();
    }
  }

  getReferralAmount(): void {
    this.http.getData(ApiUrl.getReferralAmount, {})
      .subscribe(response => {
        if (!!response && response.data) {
          this.referral_amount = response.data.referalAmount;
          if (this.settings.enable_referral_bal_limit) {
            if (response.data.referalAmount > this.settings.referral_bal_limit_per_order) {
              this.referral_amount = this.settings.referral_bal_limit_per_order;
            }
          }
        }
      });
  }

  applyReferral(): void {
    this.referral_applied = !this.referral_applied;
    this.message.toast('success', `${this.translate.instant('Referral Amount')} ${this.referral_applied ? this.translate.instant('Applied') : this.translate.instant('Removed')} ${this.translate.instant('Successully')}`);
    this.referralAmount.emit(this.referral_applied ? this.referral_amount : 0);
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
