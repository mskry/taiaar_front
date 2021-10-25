import { ApiUrl } from './../../../../../core/apiUrl';
import { LocalizationPipe } from './../../../../../shared/pipes/localization.pipe';
import { UserService } from './../../../../../services/user/user.service';
import { HttpService } from './../../../../../services/http/http.service';
import { MessagingService } from './../../../../../services/messaging/messaging.service';
import { UtilityService } from './../../../../../services/utility/utility.service';
import { Slots } from './../../../../../shared/models/slots.model';
import { AppSettings } from './../../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../../core/theme/styleVariables.model';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, SimpleChange, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'underscore'
import { TranslateService } from '@ngx-translate/core';
declare const $;

@Component({
  selector: 'app-cart-date-time',
  templateUrl: './cart-date-time.component.html',
  styleUrls: ['./cart-date-time.component.scss']
})
export class CartDateTimeComponent implements OnInit, OnChanges, OnDestroy {

  @Input() dateTimeData: any;
  @Output() payNow: EventEmitter<any> = new EventEmitter<any>(null);

  styleSubscription: Subscription;
  settingsSubscription: Subscription;
  style: StyleVariables;
  timeInterval: number = 0;
  time: any;
  timeDropOff: any;
  date: any = new Date();
  min: any = new Date();
  minDropOff: any = new Date();
  data: any = {};
  cart: Array<any> = [];
  settings: AppSettings;
  addressDetail: any = {};
  priceObj: any = {};
  headers: Array<any> = [];
  is_slot_selection: boolean = false;
  slotData: Slots;
  hover: any = {
    index: -1,
    tab: null
  };
  slotTime: string = '';
  slotDropOffTime: string = '';
  noData: boolean = false;
  isLoading: boolean = false;

  public drop_off_date: any = new Date();
  public cart_date_time_obj: any = {};
  public is_pickup_date_selection: boolean = true;
  public is_dropoff_date_selection: boolean = false;
  public is_pickup_slot_selection: boolean;
  public is_dropoff_slot_selection: boolean;
  public is_all_done: boolean;

  constructor(
    private util: UtilityService,
    private router: Router,
    private message: MessagingService,
    private http: HttpService,
    private user: UserService,
    private localization: LocalizationPipe,
    private translate: TranslateService) {

    this.slotData = new Slots();
  }

  ngOnInit() {
    this.styleSubscription = this.util.getStyles
      .subscribe(styles => {
        this.style = styles;
      });

    this.settingsSubscription = this.util.getSettings
      .subscribe((settings: AppSettings) => {
        if (settings) {
          this.settings = settings;
          this.timeInterval = settings['interval'];
          this.calculateMinDateForDropOff();
        }
      });

    this.getAgentKeys();
  }

  ngOnChanges(changes: SimpleChanges) {
    const dateTimeData: SimpleChange = changes.dateTimeData;
    if (dateTimeData.currentValue.is_open) {
      this.cart = dateTimeData.currentValue.cart ? dateTimeData.currentValue.cart : [];
      $("#cartDateModal").modal('show');
      this.data = dateTimeData.currentValue.data;
      this.addressDetail = dateTimeData.currentValue.addressDetail;
      this.priceObj = dateTimeData.currentValue.priceObj;
      if (this.data['date_time']) {
        let date = moment.unix(this.data['date_time']);
        this.date = new Date(date.format('YYYY-MM-DD'));

      }
    }
  }

  calculateMinDateForDropOff() {
    if (this.settings.dropoff_buffer) {
      this.minDropOff.setDate(this.date.getDate() + Number(this.settings.dropoff_buffer));
      this.drop_off_date = this.minDropOff;
    }
  }

  getAgentKeys() {
    this.isLoading = true;
    this.http.postData(ApiUrl.agent.getAgentKeys, {})
      .subscribe(response => {
        if (!!response && response.data) {
          this.headers = response.data;
        }
        this.isLoading = false;
      }, (err) => this.isLoading = false);
  }

  getSlots() {
    let params = {
      date: moment(this.date).format('YYYY-MM-DD'),
      offset: moment().format('Z'),
    }
    this.noData = false;
    this.isLoading = true;
    this.http.getAgentData(ApiUrl.agent.getAllSlots, params, this.headers)
      .subscribe(response => {
        if (!!response && response.data) {
          let slots: Array<any> = response.data;
          if (moment(this.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            slots = _.filter(slots, (slot: any) => moment(moment(this.date).format('YYYY-MM-DD') + ' ' + slot).isAfter(moment(), 'minutes'));
          }
          slots = _.sortBy(slots, (o) => { return o; });
          if (slots.length) {
            this.slotData = new Slots();
            slots.forEach(time => {
              switch (true) {
                case this.getHours(time) >= 0 && this.getHours(time) < 12:
                  this.slotData.Morning.push(this.timeFormat(time));
                  break;
                case this.getHours(time) >= 12 && this.getHours(time) < 16:
                  this.slotData.Afternoon.push(this.timeFormat(time));
                  break;
                case this.getHours(time) >= 16 && this.getHours(time) < 21:
                  this.slotData.Evening.push(this.timeFormat(time));
                  break;
                case this.getHours(time) >= 21 && this.getHours(time) < 24:
                  this.slotData.Night.push(this.timeFormat(time));
                  break;
              }
            });
          } else {
            this.slotData = new Slots();
          }
          this.noData = true;
        }
        this.isLoading = false;
      }, (err) => this.isLoading = false);
  }

  getHours(time): number {
    return moment.duration(time).asHours();
  }

  timeFormat(time): string {
    return moment(time, ["HH:mm:ss"]).format('h:mm A');
  }

  selectSlot(slot) {
    this.slotTime = slot;
    this.time = moment(slot, ["h:mm A"]).format('HH:mm:ss');
  }
  selectDropOffSlot(slot) {
    this.slotDropOffTime = slot;
    this.timeDropOff = moment(slot, ["h:mm A"]).format('HH:mm:ss');
  }

  submit() {
    if (!this.time) {
      this.message.toast("error", "Please select the slot time");
      return;
    }
    if (this.settings.is_laundry_theme == '1' && !this.timeDropOff) {
      this.message.toast("error", "Please select the slot time");
      return;
    }
    if (this.cart.length) {
      let agent_list = this.cart.some(product => {
        return product['agent_list'] == 1;
      });
      if (agent_list && this.settings.hideAgentList == 0) {
        this.toAgentList();
      } else {
        this.cart_date_time_obj = {};
        this.cart_date_time_obj['date_time'] = moment(this.date).format('YYYY-MM-DD') + ' ' + this.time;
        if (this.settings.is_laundry_theme == '1') {
          this.cart_date_time_obj['drop_off_date'] = moment(this.drop_off_date).format('YYYY-MM-DD') + ' ' + this.timeDropOff;
        }
        // this.payNow.emit(this.cart_date_time_obj);
        if (this.dateTimeData.isOnlinePayment) {
          this.payNow.emit(this.cart_date_time_obj);
        } else {
          this.generateOrder();
        }
        $("#cartDateModal").modal('hide');
      }
    } else {
      this.toAgentList();
    }
  }

  toAgentList() {
    let date;
    // if (this.settings.service_booking_flow != 1) {
    //   if (!this.date || !this.time || this.time == 'Invalid Date') {
    //     this.message.toast('info', 'Please select slot');
    //     return;
    //   }
    //   date = moment(this.date).format('YYYY-MM-DD') + ' ' + this.time;
    // } else {
    if (!this.date) {
      this.message.toast('info', 'Please select slot');
      return;
    }
    date = moment(this.date).format('YYYY-MM-DD') + ' ' + this.time;
    // }

    let params = {};
    Object.assign(params, this.data);
    params['date_time'] = moment(date).unix();
    this.router.navigate(['/cart/agent'], {
      queryParams: params
    });
  }

  generateOrder() {
    let offset = moment().format('Z');
    let obj: any = {};
    obj.cartId = this.data.cart_id;
    obj.languageId = this.util.handler.languageId;
    obj.isPackage = '0';
    obj.paymentType = this.data.payType;
    obj.accessToken = this.user.getUserToken;
    obj.offset = offset;
    obj.date_time = this.cart_date_time_obj.date_time;
    obj.type = this.settings.app_type;
    if (this.settings.is_laundry_theme == '1') {
      obj.drop_off_date = this.cart_date_time_obj.drop_off_date
    }

    if (this.data.promo) {
      obj['promoCode'] = this.data.promo;
      obj['discountAmount'] = this.priceObj.discountAmount || this.priceObj.discount;
      obj['promoId'] = this.data.promoId;
    }

    if (this.data.paymentGatewayId) {
      obj['gateway_unique_id'] = this.data.paymentGatewayId;
      obj['payment_token'] = this.data.token;
    }

    if (this.settings.extra_instructions == 1) {
      obj['parking_instructions'] = this.data.parking_instruction;
      obj['area_to_focus'] = this.data.area_to_focus;
    }

    obj['duration'] = 0;
    this.cart.forEach(data => {
      if (data['price_type']) {
        obj['duration'] += (this.settings.interval * data['selectedQuantity']);
      } else {
        obj['duration'] += (data['duration'] * data['selectedQuantity']);
      }
    });

    this.isLoading = true;

    this.http.postData(ApiUrl.generateOrder, obj, false)
      .subscribe(response => {
        if (!!response && response.data) {
          this.router.navigate(['/orders/order-detail'], { queryParams: { orderId: response.data } });
          this.util.setCart([]);
          setTimeout(() => {
            this.message.alert('success', this.localization.transform('order') + `${this.translate.instant('Placed Successfully')}!`);
          }, 800);
          this.util.clearLocalData('cart_id');
          this.util.clearLocalData('ques_data');
        }
        this.isLoading = false;
      }, (err) => this.isLoading = false);
  }

  showDropOffCalender() {
    this.is_dropoff_date_selection = true;
    this.is_pickup_date_selection = false;
  }
  trackBySlotMorningFn(id, index) {
    return index;
  }
  trackBySlotAfternoonFn(id, index) {
    return index;
  }
  trackBySlotEveningFn(id, index) {
    return index;
  }
  trackBySlotNightFn(id, index) {
    return index;
  }
  trackByMorningFn(id, index) {
    return index;
  }
  trackByAfternoonFn(id, index) {
    return index;
  }
  trackByEveningFn(id, index) {
    return index;
  }
  trackByNightFn(id, index) {
    return index;
  }
  ngOnDestroy() {
    $("#cartDateModal").modal('hide');
    if (!!this.styleSubscription) this.styleSubscription.unsubscribe();
    if (!!this.settingsSubscription) this.settingsSubscription.unsubscribe();
  }

}
