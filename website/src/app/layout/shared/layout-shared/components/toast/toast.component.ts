import { Router } from '@angular/router';
import { AppSettings } from './../../../../../shared/models/appSettings.model';
import { UtilityService } from './../../../../../services/utility/utility.service';
import { LocalizationPipe } from './../../../../../shared/pipes/localization.pipe';
import { FcmService } from './../../../../../services/fcm/fcm.service';
import { IForegroundNotification } from './../../../../../core/models/foreground-notification.interface';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MessagingService } from 'src/app/services/messaging/messaging.service';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  @Input() settings: AppSettings;

  foregroundNotification: IForegroundNotification;
  message: any = null;
  isRatingReviews = true;
  // opneMessage: boolean = false;
  // order: any = null;

  constructor(
    private messageService: MessageService,
    private fcmService: FcmService,
    private messagingService: MessagingService,
    private localization: LocalizationPipe,
    private utilityService: UtilityService,
    private router: Router,
    private translate: TranslateService
    // private http: HttpService,
    // private util: UtilityService,
    // private user: UserService
  ) {
  }

  ngOnInit() {
    this.utilityService.getForegroundNotification.subscribe((data: IForegroundNotification) => {
      this.foregroundNotification = data;
    })

    this.fcmService.currentMessage.subscribe((payload) => {
      if (payload) {
        if (parseInt(payload.data.orderId, 0) > 0 && parseInt(payload.data.status, 0) === 5) {
          this.rateAgent(payload);
        }
        this.showMsg(payload);
      }
    });
  }

  showMsg(msg) {
    // if (!!msg.data.type && msg.data.type == 'chat' && !this.foregroundNotification.showChat) return;
    // if (!!msg.data.type && msg.data.type == 'chat') return;
    if (msg.data.type != 'chat') {
      this.messageService.add({ key: 'custom', severity: 'info', life: 4500, summary: `${this.localization.transform('order')} No. ${msg.data.orderId}`, detail: msg.notification.body });
    } else {
      this.message = msg;
      this.messageService.add({ key: 'custom', severity: 'info', life: 4500, summary: 'New Message', detail: `${this.translate.instant(msg.notification.body)}` });
    }
  }

  notificationClick() {
    if (this.message.data.agent_created_id) {
      // let obj = {
      //   languageId: parseInt(this.util.handler.languageId),
      //   accessToken: this.user.getUserToken,
      //   orderId: this.message.data.order_id,
      //   latitude: this.util.handler.latitude,
      //   longitude: this.util.handler.longitude
      // };
      // this.http.postData(ApiUrl.orders.getOrderDetail, obj)
      //   .subscribe(response => {
      //     if (!!response && response.data) {
      //       console.log(response)
      //       this.order = response.data.orderHistory[0];
      //       this.opneMessage = true;
      //       console.log(this.settings.chat_enable, this.opneMessage, this.order)

      //     }
      //   });
      if (this.message.data && this.message.data.is_admin == 1) {
        this.router.navigate(["/account/profile"], {
          queryParams: {
            message_id: this.message.data.message_id
          }
        });

      } else {
        if (this.message.data && this.message.data.order_id) {
          this.router.navigate(['/orders/order-detail'], {
            queryParams: { orderId: this.message.data.order_id,
              message_id: this.message.data.message_id
            }
          });
        } else if (this.message.data && this.message.data.id && this.message.data.message_id) {
          this.router.navigate(["/products", "listing"], {
            queryParams: {
              supplierId: this.message.data.id,
              message_id: this.message.data.message_id
            }
          });
        }

      }
    }
  }
  rateAgent(orderObj: any) {
    this.messagingService.rateAgent('agent', orderObj?.notification?.body, 'Do you want to rate the Agent', orderObj)
  }
  onReject() {
    this.messageService.clear('custom');
  }

}
