import { HttpService } from './../../../../services/http/http.service';
import { ApiUrl } from './../../../../core/apiUrl';
import { UserService } from './../../../../services/user/user.service';
import { MessagingService } from './../../../../services/messaging/messaging.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalizationPipe } from './../../../../shared/pipes/localization.pipe';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-landing-near-by-suppliers',
  templateUrl: './landing-near-by-suppliers.component.html',
  styleUrls: ['./landing-near-by-suppliers.component.scss', '../landing-recommended-suppliers/landing-recommended-suppliers.component.scss'],
  
})
export class LandingNearBySuppliersComponent implements OnInit {

  @Input()
  suppliers: Array<any> = [];

  @Input()
  settings: AppSettings;

  @Input()
  style: StyleVariables;

  @Output()
  onViewDetial: EventEmitter<any> = new EventEmitter<any>();

  loggedIn: boolean = false;

  constructor(
    private http: HttpService,
    private userService: UserService,
    private message: MessagingService,
    private translate: TranslateService,
    private localization: LocalizationPipe
  ) { }

  ngOnInit() {
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
  trackBySuppliersFn(id, index) {
    return index;
  }
}
