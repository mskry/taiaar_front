import { ApiUrl } from './../../../../../core/apiUrl';
import { HttpService } from './../../../../../services/http/http.service';
import { MessagingService } from './../../../../../services/messaging/messaging.service';
import { AppSettings } from './../../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../../core/theme/styleVariables.model';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'underscore';
import { UserService } from 'src/app/services/user/user.service';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { GlobalVariable } from 'src/app/core/global';

declare const $;

@Component({
  selector: 'app-cart-schedule-time',
  templateUrl: './cart-schedule-time.component.html',
  styleUrls: ['./cart-schedule-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartScheduleTimeComponent implements OnInit {

  dataLoaded: boolean = true;
  is_slot_selection: boolean = false;
  date: Date;
  minDate: Date;
  maxDate: Date;

  hover: any = {
    index: -1,
    tab: null
  };

  @Input() style: StyleVariables;
  @Input() settings: AppSettings;
  @Input() schedulingData: any = {};
  @Input() table_flow: number = 0;

  @Output() onScheduling: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  slotData: Array<any> = [];
  selectedSlot: any = {};
  availabilities: any = {};

  userSubscription: Subscription;
  public currentUser: any = {};
  public loggedIn: boolean = false;

  public isShowTable: boolean;
  public tableRequestData: any = {};

  public sittingCapacitiesList: any = [];

  public capacity_selected: boolean = false;
  public selected_capacity: any = 0;
  public table_with_capacity: any = {};

  public isPayOnline: boolean = false;
  public paymentOrderModel: any = {};
  paymentGateways: Array<any>;
  gatewaySubscription: Subscription;
  gateway_selected: any = {}



  constructor(
    private message: MessagingService,
    private http: HttpService,
    private userService: UserService,
    private util: UtilityService,
    private ref: ChangeDetectorRef
  ) {
    this.ref.detach();
    setInterval(() => { this.ref.detectChanges(); }, 500);
  }

  ngOnInit() {
    this.date = new Date();
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.date.getDate() + 29);
    if (this.settings && this.settings.min_next_day_scheduling) {
      this.minDate.setDate(this.date.getDate() + 1);
      this.date = this.minDate
    }

    this.getAvailabilities();

    if (this.table_flow) {
      if (!this.settings.table_book_mac_theme) {
        this.getUserTableSittingCapacity();
      }
    }

    if (this.settings.table_book_mac_theme == 1) {
      this.selected_capacity = null;
    }

    this.getCurrentUser();

  }

  getCurrentUser() {
    this.userSubscription = this.userService.currentUser
      .subscribe(user => {
        this.currentUser = user;
        if (!!user && user['access_token']) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      });
    this.gatewaySubscription = this.util.getKeys.subscribe(({ paymentGateways }) => {
      if (paymentGateways && paymentGateways.length) {
        this.paymentGateways = paymentGateways.filter((gateway) => gateway.is_active == 1);
      }
    });

  }

  ngOnChanges() {
    $("#cartScheduleModal").modal('show');
  }

  getSlots(date: Date) {
    this.dataLoaded = false;
    this.is_slot_selection = true;
    this.slotData = [];

    let params = {
      supplier_id: this.schedulingData.supplier_id,
      date: moment(date).format('YYYY-MM-DD'),
      date_order_type: this.schedulingData.date_order_type,
      latitude: this.schedulingData.latitude,
      longitude: this.schedulingData.longitude
    }

    this.http.getData(ApiUrl.getSupplierSlots, params)
      .subscribe(response => {
        if (!!response && response.data) {
          (response.data).forEach(slot => {
            this.availabilities.supplier_timings.forEach(sl => {
              this.availabilities.supplier_available_dates.forEach(el => {
                if (moment(date).format('YYYY-MM-DD') === moment(el.from_date).format('YYYY-MM-DD')) {
                  this.mapSlots(slot, el, sl, date, false);
                }
              });
              this.availabilities.weeks_data.forEach(el => {
                if (el.status == 1 && moment(date).day() == el.day_id) {
                  this.mapSlots(slot, el, sl, date, true);
                }
              });
            });
          });
          this.slotData = _.uniq(this.slotData.slice(), false, slot => { return slot.startTime && slot.endTime });
        }
        this.dataLoaded = true;
      });
  }


  getSlotsRange(date: Date) {
    this.dataLoaded = false;
    this.is_slot_selection = true;
    this.slotData = [];

    let params = {
      supplier_id: this.schedulingData.supplier_id,
      date: moment(date).format('YYYY-MM-DD'),
      date_order_type: this.schedulingData.date_order_type,
      latitude: this.schedulingData.latitude,
      longitude: this.schedulingData.longitude
    }

    this.http.getData(ApiUrl.getSupplierSlotsV2, params)
      .subscribe(response => {
        if (!!response && response.data) {
          (response.data).forEach(slot => {
            this.availabilities.supplier_timings.forEach(sl => {
              this.availabilities.supplier_available_dates.forEach(el => {
                if (moment(date).format('YYYY-MM-DD') === moment(el.from_date).format('YYYY-MM-DD')) {
                  this.mapSlotsRange(slot, el, sl, date, false);
                }
              });
              this.availabilities.weeks_data.forEach(el => {
                if (el.status == 1 && moment(date).day() == el.day_id) {
                  this.mapSlotsRange(slot, el, sl, date, true);
                }
              });
            });
          });
          this.slotData = _.uniq(this.slotData.slice(), false, slot => { return slot.startTime && slot.endTime });
          this.slotData = this.slotData.map(slot => {
            slot.slotTime = moment(slot.startTime).format('HH:mm:ss') + ' - ' + moment(slot.endTime).format('HH:mm:ss')
            return slot
          })
          console.log(this.slotData)
        }
        this.dataLoaded = true;
      });
  }




  getSlotsWithCapacity(date?: Date) {
    this.dataLoaded = false;
    this.is_slot_selection = true;
    this.slotData = [];

    let params = {
      date: moment(this.date).format('YYYY-MM-DD'),
      date_order_type: this.schedulingData.date_order_type,
      latitude: this.schedulingData.latitude,
      longitude: this.schedulingData.longitude,
      supplier_id: (Number)(this.schedulingData.supplier_id),
      seating_capacity: (Number)(this.selected_capacity),
      branch_id: (Number)(this.schedulingData.branch_id) || 0
    }

    this.http.getData(ApiUrl.getSupplierSlotsV1, params)
      .subscribe(response => {
        if (!!response && response.data) {

          if (this.settings.table_book_mac_theme == 1) {
            this.table_with_capacity.table_booking_price = response.data.table_booking_price || 0;
          } else {
            this.table_with_capacity = response.data.availableTables[0];
          }

          console.log('this.availabilities', this.availabilities);

          this.capacity_selected = true;
          (response.data.slots).forEach(slot => {
            this.availabilities.supplier_timings.forEach(sl => {
              this.availabilities.supplier_available_dates.forEach(el => {
                if (moment(date).format('YYYY-MM-DD') === moment(el.from_date).format('YYYY-MM-DD')) {
                  this.mapSlots(slot, el, sl, date, false);
                }
              });
              this.availabilities.weeks_data.forEach(el => {
                if (el.status == 1 && moment(date).day() == el.day_id) {
                  this.mapSlots(slot, el, sl, date, true);
                }
              });
            });
          });
          this.slotData = _.uniq(this.slotData.slice(), false, slot => { return slot.startTime && slot.endTime });
        }
        this.dataLoaded = true;
      });
  }




  mapSlots(slot, el, sl, date, is_week) {
    let format = 'hh:mm:ss';
    let selectDateSlot = moment(date).format('YYYY-MM-DD') + ' ' + slot;
    let time = moment(slot, format);
    let beforeTime = moment(sl.start_time, format);
    let afterTime = moment(sl.end_time, format);


    let toDate = new Date();

    if (this.settings.display_slot_with_difference && this.availabilities.schedule_time_buffer) {
      toDate.setHours(toDate.getHours() + this.availabilities.schedule_time_buffer);
    }
    if (((el.id == sl.date_id && !is_week) || ((el.day_id == sl.day_id) && is_week)) && beforeTime <= time && time <= afterTime && moment(selectDateSlot) >= moment(toDate)) {
      let date_time = moment(date).format('YYYY-MM-DD') + ' ' + moment(slot, ["h:mm A"]).format('HH:mm:ss');
      this.slotData.push({
        time: this.timeFormat(slot),
        price: sl.price,
        slot_id: sl.id,
        startTime: date_time,
        endTime: moment(date_time).add(this.availabilities.supplier_slots_interval, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      });
    }
  }

  mapSlotsRange(slot, el, sl, date, is_week) {
    let format = 'hh:mm:ss';
    let selectDateSlot = moment(date).format('YYYY-MM-DD') + ' ' + slot.start_time;
    let time = moment(slot.start_time, format);
    let beforeTime = moment(sl.start_time, format);
    let afterTime = moment(sl.end_time, format);


    let toDate = new Date();

    if (this.settings.display_slot_with_difference && this.availabilities.schedule_time_buffer) {
      toDate.setHours(toDate.getHours() + this.availabilities.schedule_time_buffer);
    }
    if (((el.id == sl.date_id && !is_week) || ((el.day_id == sl.day_id) && is_week)) && beforeTime <= time && time <= afterTime && moment(selectDateSlot) >= moment(toDate)) {
      let date_time = moment(date).format('YYYY-MM-DD') + ' ' + moment(slot.start_time, ["h:mm A"]).format('HH:mm:ss');
      let end_time = moment(date).format('YYYY-MM-DD') + ' ' + moment(slot.end_time, ["h:mm A"]).format('HH:mm:ss');
      this.slotData.push({
        time: this.timeFormat(slot.start_time),
        price: sl.price,
        slot_id: sl.id,
        startTime: date_time,
        endTime: end_time
      });
    }
  }

  getAvailabilities() {
    let params = {
      supplier_id: this.schedulingData.supplier_id,
      date_order_type: this.schedulingData.date_order_type,
      latitude: this.schedulingData.latitude,
      longitude: this.schedulingData.longitude
    }

    this.http.getData(ApiUrl.getSupplierAvailabilities, params)
      .subscribe(response => {
        if (!!response && response.data) {
          this.availabilities = response.data;
        }
      });
  }


  timeFormat(time): string {
    return moment(time, ["HH:mm:ss"]).format('h:mm A');
  }

  submit() {
    if (!!this.selectedSlot && !this.selectedSlot.time) {
      this.message.toast('info', 'Please select slot');
    } else {
      if (this.schedulingData.date_order_type === 3) {
        if (this.schedulingData.by_pass_tables_selection === "1") {
          this.emitTableBookingEvent(0);
        }
        else {
          this.isShowTable = true;
          this.is_slot_selection = false;
        }
      }
      else {
        this.onScheduling.emit(this.selectedSlot);
        $("#cartScheduleModal").modal('hide');
      }
    }
  }

  submitWithCapacity() {
    if (!!this.selectedSlot && !this.selectedSlot.time) {
      this.message.toast('info', 'Please select slot');
    } else {

      this.holdSupplierSlot();

      // this.message.confirm(`Do you want to add item`).then(data => {
      //   if (data.value) {
      //     var obj = {
      //       table_request_id: 0,
      //       table_id: this.table_with_capacity.id,
      //       table_name: this.table_with_capacity.table_name,
      //       table_booking_price: this.table_with_capacity.table_booking_price
      //     }
      //     localStorage.setItem('table_booking_details', JSON.stringify(obj));
      //     this.emitTableBookingEventWithCapacity(false);
      //   }
      //   else {
      //     this.openPaymentGateways();
      //     this.resetChecks();

      //   $("#cartScheduleModal").modal('hide');
      //   }
      // });
    }
  }


  selectSlot(slot: any) {
    this.selectedSlot = slot;
    this.tableRequestData = this.schedulingData;
    this.tableRequestData.slot_id = this.selectedSlot.slot_id;
  }

  selectSlotWithCapcity(slot: any) {
    this.selectedSlot = slot;
    this.tableRequestData = this.schedulingData;
    this.tableRequestData.slot_id = this.selectedSlot.slot_id;
  }


  onTableSelection(event) {
    console.log('table event', event);

    if (!event) {
      this.isShowTable = false;
      this.is_slot_selection = true;
    }
    else {
      this.emitTableBookingEvent(event.id);
    }
  }

  emitTableBookingEvent(table_id) {
    var table_booking_param = this.selectedSlot;
    table_booking_param['table_id'] = table_id;
    this.onScheduling.emit(table_booking_param);
    $("#cartScheduleModal").modal('hide');
  }
  emitTableBookingEventWithCapacity(withPayment?: boolean, paymentDetails?: any) {
    var table_booking_param = {};
    if (withPayment) {

      table_booking_param = { ...this.selectedSlot };
      table_booking_param['table_booking_price'] = this.table_with_capacity.table_booking_price;

      if (this.settings.table_book_mac_theme == 1) {
        table_booking_param['payment_details'] = { ...paymentDetails };
        table_booking_param['table_seating'] = (Number)(this.selected_capacity);
      } else {
        table_booking_param['table_id'] = this.table_with_capacity.id;
      }
      this.selectedSlot = {};
      this.selected_capacity = 0;
    }
    else {
      table_booking_param = withPayment;
    }
    this.onScheduling.emit(table_booking_param);
    console.log(table_booking_param);

    $("#cartScheduleModal").modal('hide');
  }

  trackBySlotDataFn(id, index) {
    return index;
  }

  openPaymentGateways() {
    this.isPayOnline = true;
    this.paymentOrderModel = {
      amount: parseInt(this.table_with_capacity.table_booking_price),
      user: this.currentUser,
      address: {}
    }
  }

  onDismiss() {
    $("#cartScheduleModal").modal('hide');
    this.is_slot_selection = false;
    this.onClose.emit(true);
  }




  getUserTableSittingCapacity() {
    var params = {
      supplier_id: this.schedulingData.supplier_id,
      branch_id: this.schedulingData.branch_id,
    }
    this.http.getData(ApiUrl.getUserTableSittingCapacity, params)
      .subscribe(response => {
        if (!!response && response.data) {
          this.sittingCapacitiesList = response.data;
          this.selected_capacity = this.sittingCapacitiesList[0];
        }
      });
  }

  proceedWithCapacity() {
    if (this.selected_capacity > 0) {
      this.capacity_selected = true;
    }
    // this.getSlotsWithCapacity();
  }


  onPaymentError(err) {
    this.message.toast('error', err);
    this.isPayOnline = false;
  }

  // onPaymentSuccess(transaction) {
  //   if (transaction.paymentGatewayId != 'hyperpay') {
  //     this.isPayOnline = false;
  //   }
  //   this.emitTableBookingEventWithCapacity(true);
  // }


  onPaymentSuccess(transaction) {
    if (transaction.paymentGatewayId != 'hyperpay') {
      this.isPayOnline = false;
    }
    const payload: any = {};
    //   user_id: this.user.id,
    //   amount: this.paymentOrderModel.amount,
    //   languageId: `${this.util.handler.languageId}`
    // };

    if (this.settings.table_book_mac_theme == 1) {
      if (transaction && !transaction.card_details) {
        payload['gateway_unique_id'] = transaction.paymentGatewayId;
        payload['currency'] = GlobalVariable.CURRENCY_NAME;
        if (transaction.token) {
          payload['payment_token'] = transaction.token;
        } else if (transaction.mobile_no) {
          payload['mobile_no'] = transaction.mobile_no;
        } else {
          if (transaction.paymentGatewayId != "authorize_net") {
            payload['customer_payment_id'] = transaction.customer_payment_id;
            payload['card_id'] = transaction.card_id;
          } if (transaction.paymentGatewayId == "authorize_net") {
            payload['authnet_profile_id'] = this.paymentOrderModel.user.authnet_profile_id;
            payload['authnet_payment_profile_id'] = transaction.card_id;
          }
        }
      }
      else {
        payload['gateway_unique_id'] = transaction.card_details.paymentGatewayId;
        payload['currency'] = GlobalVariable.CURRENCY_NAME;
        payload['payment_token'] = transaction.card_details.card_number;
        payload['cvt'] = transaction.card_details.cvc;
        payload['cp'] = transaction.card_details.p_code;
        payload['expMonth'] = transaction.card_details.exp_month;
        payload['expYear'] = transaction.card_details.exp_year;
      }
    }

    this.emitTableBookingEventWithCapacity(true, payload);

  }



  holdSupplierSlot() {
    console.log(this.date);
    var params = {
      supplier_id: this.schedulingData.supplier_id,
      branch_id: this.schedulingData.branch_id,
      // dateTime: this.date,
      slotDate: moment(this.selectedSlot.startTime).format('YYYY-MM-DD'),
      slotTime: moment(this.selectedSlot.startTime).format('HH:mm:ss'),
      offset: moment().format('Z'),
      // slot_price: this.selectedSlot.slot_price || this.selectedSlot.price
    }

    console.log(params, this.selectedSlot);

    this.http.postData(ApiUrl.holdSupplierSlot, params)
      .subscribe(response => {
        if (!!response && response.data) {
          this.resetChecks();

          this.message.confirm(`Would you like to pre-order`, '', false, true).then(data => {
            if (data.value) {

              var obj = {
                table_request_id: 0,
                table_booking_price: this.table_with_capacity.table_booking_price,
                table_slot: this.selectedSlot.startTime,
                table_slot_endTime: moment(this.selectedSlot.startTime).add(this.availabilities.supplier_slots_interval, 'minutes').format('YYYY-MM-DD HH:mm:ss')
              }
              if (this.settings.table_book_mac_theme == 0) {
                obj['table_id'] = this.table_with_capacity.id;
                obj['table_name'] = this.table_with_capacity.table_name;
              } else {
                obj['table_id'] = this.table_with_capacity.id;
                obj['table_seating'] = (Number)(this.selected_capacity);
              }
              localStorage.setItem('table_booking_details', JSON.stringify(obj));
              this.emitTableBookingEventWithCapacity(false);
            }
            else {
              if (!this.table_with_capacity.table_booking_price) {
                this.emitTableBookingEventWithCapacity(true, {});
              } else {
                this.openPaymentGateways();
                $("#cartScheduleModal").modal('hide');
              }
            }

            this.resetChecks();
          });
        }
      });
  }

  resetChecks() {
    // this.selectedSlot = {};
    this.capacity_selected = false;
    this.is_slot_selection = false;
    // this.selected_capacity = 0; // this.sittingCapacitiesList[0];
    this.date = new Date();
  }

}
