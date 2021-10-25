import { AppSettings } from './../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { UtilityService } from './../../../../services/utility/utility.service';
import { Component, OnInit, Input, Inject, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { GlobalVariable } from 'src/app/core/global';
import { HttpService } from 'src/app/services/http/http.service';
import { ApiUrl } from 'src/app/core/apiUrl';
import { Currency } from 'src/app/shared/models/apiKeys.model';



@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html',
})
export class CurrencyComponent implements OnInit {

    @Input() style: StyleVariables;
    @Input() settings: AppSettings;
    selectedCurrency: Currency;
    currencyData: Array<Currency> = [];

    constructor(
        private util: UtilityService,
        private translate: TranslateService,
        @Inject(DOCUMENT) private document,
        private http: HttpService
    ) {

    }

    ngOnInit() {
        this.getCurrencyList();
    }


    getCurrencyList() {
        this.util.getMultiCurrency.subscribe((res: any) => {
            if (res) {
                this.currencyData = res;
                if (localStorage.getItem('selectedCurrency')) {
                    this.selectedCurrency = JSON.parse(localStorage.getItem('selectedCurrency'));
                }
            }
        })
    }



    currencySelect(currency: any) {
        this.selectedCurrency = currency;
        this.util.setSelectedCurrency(currency);
    }

}
