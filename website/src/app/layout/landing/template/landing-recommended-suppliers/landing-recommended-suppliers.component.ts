import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { ApiUrl } from './../../../../core/apiUrl';
import { MessagingService } from './../../../../services/messaging/messaging.service';
import { LocalizationPipe } from './../../../../shared/pipes/localization.pipe';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './../../../../services/user/user.service';
import { HttpService } from './../../../../services/http/http.service';
import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { UtilityService } from '../../../../services/utility/utility.service';

@Component({
  selector: 'app-landing-recommended-suppliers',
  templateUrl: './landing-recommended-suppliers.component.html',
  styleUrls: ['./landing-recommended-suppliers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingRecommendedSuppliersComponent implements OnInit {

  @Input('suppliers')
  set setSuppliers(suppliers) {
    this.isLoading = true;
    if (suppliers.length) {
      this.suppliers = suppliers;
      this.isLoading = false;
    }
  }


  @Input()
  settings: AppSettings;

  @Input()
  style: StyleVariables;

  @Output()
  onViewDetial: EventEmitter<any> = new EventEmitter<any>();
  loggedIn: boolean = false;

  public suppliers: Array<any> = [];
  public isLoading: boolean = false;

  constructor(
    private http: HttpService,
    private userService: UserService,
    private message: MessagingService,
    private translate: TranslateService,
    private localization: LocalizationPipe,
    private util: UtilityService,

  ) { }

  ngOnInit() {
  }
  trackBySuppliersFn(id, index) {
    return index;
  }

  wishlist(status, detail) {
    this.loggedIn = !!this.userService.getUserToken;
    if (!this.loggedIn) {
      this.message.alert('warning', this.translate.instant('Please Login First'));
      return;
    }
    let param_data = {
      status: +status,
      supplierId: detail['id'],
      accessToken: this.userService.getUserToken
    }

    const api = param_data.status == 1 ? ApiUrl.favourite.addToFavourites : ApiUrl.favourite.removeFromFavourites;

    this.http.postData(api, param_data, true)
      .subscribe(response => {
        if (!!response && response.data) {
          this.message.toast('success', `${this.localization.transform('supplier')} ${this.translate.instant('Has Been Successfully')} ${status ? this.translate.instant('Added To') : this.translate.instant('Removed From')} ${this.localization.transform('wishlist')}`);
          detail.Favourite = +status;
        }
      });
  }

}
