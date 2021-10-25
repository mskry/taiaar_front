import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AppSettings } from '../../../../../shared/models/appSettings.model';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { Subscription } from 'rxjs';
import { UtilityService } from '../../../../../services/utility/utility.service';
import { ScriptService } from '../../../../../services/script/script.service';
import { PaymentBaseComponent } from '../payment-base.component';
import { UserService } from './../../../../../services/user/user.service';
import { HttpService } from './../../../../../services/http/http.service';
import { WINDOW } from './../../../../../services/window/window.service';
import { DOCUMENT } from '@angular/common';

declare var Accept: any;

@Component({
    selector: 'app-pago-facil-gateway',
    templateUrl: './pago-facil-gateway.component.html',
})
export class PagoFacilGatewayComponent extends PaymentBaseComponent implements OnInit {

    settings: AppSettings;
    style: StyleVariables;

    styleSubscription: Subscription;
    settingSubscription: Subscription;
    public showAddCard: boolean = false;
    public cardNumber: string = "";
    public expMonth: string = "";
    public expYear: string = "";
    constructor(
        private util: UtilityService,
        private scriptService: ScriptService,
        private userService: UserService,
        private httpService: HttpService,
        @Inject(WINDOW) private window: Window,
        @Inject(DOCUMENT) private document
    ) {
        super();
    }

    ngOnInit() {
        this.styleSubscription = this.util.getStyles
            .subscribe(style => {
                this.style = style;
            });

        this.settingSubscription = this.util.getSettings
            .subscribe((settings: AppSettings) => {
                this.settings = settings;
            })
        this.showAddCard = true;

    }

    onCardSelect($event) {
        this.onSuccess.emit($event);
    }
}