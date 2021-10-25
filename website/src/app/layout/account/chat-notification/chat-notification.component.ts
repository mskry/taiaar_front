import { Subscription } from 'rxjs';
import { AppSettings } from '../../../shared/models/appSettings.model';
import { StyleVariables } from '../../../core/theme/styleVariables.model';
import { PaginationModel } from '../../../shared/models/pagination.model';
import { UserService } from '../../../services/user/user.service';
import { ApiUrl } from '../../../core/apiUrl';
import { UtilityService } from '../../../services/utility/utility.service';
import { HttpService } from '../../../services/http/http.service';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { WINDOW } from '../../../services/window/window.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.scss']
})
export class ChatNotificationsComponent implements OnInit, OnDestroy {

  notificationList: Array<any> = [];

  settings: AppSettings;
  style: StyleVariables;
  pagination: PaginationModel;

  styleSubscription: Subscription;

  constructor(
    private httpService: HttpService,
    private utilityService: UtilityService,
    private userService: UserService,
    private router: Router,
    @Inject(WINDOW) private window: Window
  ) {
    this.pagination = new PaginationModel();
    this.pagination.perPage = 10;
    this.pagination.currentPage = 1;
    this.pagination.offset = 0;
  }


  ngOnInit() {
    this.styleSubscription = this.utilityService.getStyles
      .subscribe((style: StyleVariables) => {
        this.style = style;
      });

    this.fetch();
  }

  fetch() {
    const userData = this.utilityService.getLocalData('web_user', true);

    const payload: any = {
      'skip': this.pagination.offset,
      'limit': this.pagination.perPage,
      'user_created_at': userData.user_created_id
    }

    this.httpService.getData(ApiUrl.getChatNotification, payload).subscribe((response) => {
      if (response && response.data ) {
        this.notificationList = response.data.list;
      }
    })
  }

  /********* On Page Change **********/
  pageChange(event) {
    this.pagination.currentPage = event;
    this.pagination.offset = event > 1 ? (event - 1) * this.pagination.perPage : 0;
    this.fetch();
    this.window.scrollTo(0, 0);
  }

  navigateNotification(message) {
    if (message.is_admin == 1) {
      this.router.navigate(["/account/profile"], {
        queryParams: {
          message_id: message.message_id
        }
      });

    } else {
      if (message && message.supplier_id && message.message_id) {
        this.router.navigate(["/products", "listing"], {
          queryParams: {
            supplierId: message.supplier_id,
            message_id: message.message_id
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (!!this.styleSubscription) this.styleSubscription.unsubscribe();
  }
  trackByFn(id, index) {
    return index;
  }

}
