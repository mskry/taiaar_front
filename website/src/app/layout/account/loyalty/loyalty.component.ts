import { UtilityService } from 'src/app/services/utility/utility.service';
import { AppSettings } from 'src/app/shared/models/appSettings.model';
import { HttpService } from './../../../services/http/http.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiUrl } from './../../../core/apiUrl';
import { GlobalVariable } from './../../../core/global';
import { Currency } from 'src/app/shared/models/apiKeys.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss']
})
export class LoyaltyComponent implements OnInit, OnDestroy {

  loyaltyData: any = {};
  activity: Array<any> = [];
  nextLoyaltyLevel: Array<any> = [];
  currency: string = GlobalVariable.CURRENCY;
  settings: AppSettings;

  public selected_currency: Currency = new Currency();
  public utilSubscription: Subscription;

  constructor(
    private http: HttpService,
    private util: UtilityService
  ) { }

  ngOnInit() {
    this.util.getSettings.subscribe((settings: AppSettings) => {
      this.settings = settings;
    });
    this.getLoyalty();

    if (this.settings.is_multicurrency_enable) {
      this.getCurrency();
    }
  }

  getLoyalty(): void {
    this.http.getData(ApiUrl.loyalty.get, {})
      .subscribe(response => {
        if (!!response && response.data && response.data.loyalityLevel.length) {
          let loyaltyData = response.data.loyalityLevel[0];
          this.loyaltyData = { ...loyaltyData };
          this.loyaltyData['leftPointAmount'] = response.data.leftPointAmount;
          this.loyaltyData['totalEarningPoint'] = response.data.totalEarningPoint;
          this.loyaltyData['totalPointAmountEarned'] = response.data.totalPointAmountEarned;
          this.activity = response.data.earnedData;
          this.nextLoyaltyLevel = (response.data.nextLoyalityLevel).sort((a, b) => {
            if (a.total_loyality_points < b.total_loyality_points) {
              return -1;
            } else if (a.total_loyality_points > b.total_loyality_points) {
              return 1;
            } else {
              return 0;
            }
          });
        }
      });
  }

  getCurrency() {
    this.utilSubscription = this.util.getSelectedCurrency.subscribe((res: any) => {
      if (res) {
        this.selected_currency = res;
        this.currency = this.selected_currency.currency_name;
      }
    })
  }

  ngOnDestroy() {
    if (this.utilSubscription) {
      this.utilSubscription.unsubscribe();
    }
  }

}
