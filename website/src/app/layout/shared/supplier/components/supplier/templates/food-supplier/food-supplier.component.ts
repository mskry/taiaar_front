import { DateService } from './../../../../../../../services/date/date.service';
import { UtilityService } from './../../../../../../../services/utility/utility.service';
import { StyleConstants } from './../../../../../../../core/theme/styleConstants.model';
import { StyleVariables } from './../../../../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../../../../shared/models/appSettings.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagingService } from 'src/app/services/messaging/messaging.service';
import * as moment from 'moment'
import { UserService } from 'src/app/services/user/user.service';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-food-supplier',
  templateUrl: './food-supplier.component.html',
  styleUrls: ['./food-supplier.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class FoodSupplierComponent implements OnInit {

  @Input() supplier: any;
  @Input() darkTheme: boolean;

  @Input() settings: AppSettings;
  @Input() style: StyleVariables;
  @Input() isBranch: boolean = false;

  @Output() onFavourite: EventEmitter<any> = new EventEmitter<any>();

  btnStyle: StyleConstants;
  subCatId: Array<any> = [];


  cartSubscription: Subscription;
  userSubscription: Subscription;
  utilSubscription: Subscription;
  orderTypeSubscription: Subscription;
  supplierSubscription : Subscription


  cart: Array<any> = [];
  specialOffers: any = [];
  timeInterval: number = 0;
  productstate: any = {
    is_pointer: true
  }

  loggedIn: boolean;
  currentUser: any = {};
  prodDetail: any = {};
  schedulingData: any = {};
  showScheduleTime: boolean;

  selected_order_type: Number = 0;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilityService,
    private dateService: DateService,
    private userService: UserService,
    private message: MessagingService,
    private http: HttpService

  ) {
    this.style = new StyleVariables();
    this.btnStyle = new StyleConstants();
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(_params => {
        if (_params.f) {
          let params = this.util.decryptData(_params.f);
          this.subCatId = [params['subCatId']];
        }
      });

    if (this.settings.selected_template == 1 && this.settings.app_type == 1 && this.supplier.category && this.supplier.category.length) {
      let cat_names = [];
      if (this.settings.isCustomFlow) {
        let category = this.util.getLocalData('selected_category', true);
        if (!!category) {
          cat_names = [...new Set((this.supplier.category.filter(ct => ct.category_id == category.id)).map(el => el.category_name))];
        }
      } else {
        cat_names = [...new Set((this.supplier.category).map(el => el.category_name))];
      }

      this.supplier['category_names'] = (cat_names.splice(0, 4)).join(', ');
    }
    this.setBtnStyle();


    this.timeInterval = this.settings.interval;
    this.productstate.hideSupplier = !!this.settings.is_single_vendor;
    this.productstate.is_pointer = false;

    this.todaySupplierTimings(this.supplier);

    this.getLoggedInUser();
    this.getSupplierDetail()
    if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
      this.getOrderType();
    }

  }

  getSupplierDetail() {
    this.util.getSupplier
      .subscribe(supplier => {
        if (supplier && supplier.id == this.supplier.id) {
          this.supplier == supplier
        }
      });
  }


  getLoggedInUser() {
    this.userSubscription = this.userService.currentUser
      .subscribe(user => {
        if (!!user && user['access_token']) {
          this.loggedIn = true;
          this.currentUser = user;
        } else {
          this.loggedIn = false;
        }
      });
  }

  getOrderType() {
    this.orderTypeSubscription = this.util.getOrderTypeData.subscribe((res: any) => {
      if (res) {
        this.selected_order_type = (Number)(res);
      }
    })
  }

  todaySupplierTimings(supplier) {
    if (supplier.timing && supplier.timing.length) {
      const today = this.dateService.getDay(moment().format('dddd').toLowerCase())
      const todayTimes = supplier.timing.find((i) => i.week_id == today);
      if (todayTimes) {
        let startTime = todayTimes.start_time.split(':');
        let endTime = todayTimes.end_time.split(':');
        const openingTime = moment().set('h', startTime[0]).set('m', startTime[1]).set('s', startTime[2]);
        let closeTime;
        if(this.settings.enable_supplier_config_closing_day == 1 && (!!todayTimes.close_week_id || todayTimes.close_week_id == 0) && todayTimes.close_week_id!=todayTimes.week_id) {
          closeTime = moment().add(1, 'day').set('h', endTime[0]).set('m', endTime[1]).set('s', endTime[2]);
        } else {
          closeTime = moment().set('h', endTime[0]).set('m', endTime[1]).set('s', endTime[2]);
        }

        supplier['todayTimes'] = {
          is_open: todayTimes.is_open,
          startTime: openingTime.format('LT'),
          endTime: closeTime.format('LT'),
          day: this.dateService.getDayName(today)
        };
        if (moment().isBefore(openingTime, 'm') || moment().isAfter(closeTime)) {
          supplier['todayTimes']['is_open'] = 0;
        }
      }

      if (this.settings.enable_supplier_config_closing_day == 1){
        const closingSlotTimes = supplier.timing.find((i) => i.close_week_id == today);

        if(closingSlotTimes) {
          let endTime = todayTimes.end_time.split(':');
          const openingTime = moment().set('h', 0).set('m', 0).set('s', 0);
          let closeTime;
          // if(!!todayTimes.close_week_id && todayTimes.close_week_id!=todayTimes.week_id) {
            closeTime = moment().set('h', endTime[0]).set('m', endTime[1]).set('s', endTime[2]);
          if (moment().isAfter(openingTime, 'm') && moment().isBefore(closeTime)) {
            console.log('dwedewde');

            supplier['todayTimes']['is_open'] = 1;
          }
        }
      }
    }
  }

  onBtnHover() {
    this.btnStyle = {
      backgroundColor: this.style.baseColor,
      color: '#ffffff',
      borderColor: this.style.baseColor,
      transition: '1s'
    }
  }

  setBtnStyle() {
    this.btnStyle = {
      color: this.style.baseColor,
      borderColor: this.style.baseColor
    }
  }

  productList(supplier) {
    if (this.settings.is_single_vendor && this.settings.selected_template == 1) {
      let cat_ids: Array<any> = [];
      if (supplier.category && supplier.category.length) {
        supplier["category"].forEach(element => {
          cat_ids.push(element.category_id);
        });
      }
      let seoValue = supplier.name;
      let param_obj = {};
      Object.assign(param_obj, this.util.handler);
      param_obj["supplierId"] = [supplier.id];
      param_obj["showSupplier"] = true;
      param_obj['branch_id'] = supplier.supplier_branch_id;
      param_obj['categoryId'] = cat_ids.join();
      param_obj['subCatId'] = this.subCatId;
      this.router.navigate(["products/product-listing", seoValue], {
        queryParams: { f: this.util.encryptData(param_obj) }
      });
    } else {
      let queryParams = {
        supplierId: supplier.id || supplier.supplier_id,
      }
      if (this.settings.branch_flow == 1 && supplier.is_multi_branch == 1) {
        queryParams['is_branches'] = 1;
        // queryParams['branchId'] = supplier.supplier_branch_id;
        // queryParams['branchName'] = supplier.supplier_branch_name;
      } else if (supplier.supplier_branch_id && supplier.supplier_branch_name) {
        queryParams['branchId'] = supplier.supplier_branch_id;
        queryParams['branchName'] = supplier.supplier_branch_name;
      }
      this.router.navigate(["products/listing"], {
        queryParams: queryParams
      });
    }
  }


  openSchedulingModal(product) {
    if (!this.loggedIn) {
      this.util.authToggle.next(true);
      return false;
    }
    this.prodDetail = product;
    this.schedulingData = {
      supplier_id: product.supplier_id || product.id,
      branch_id: product.supplier_branch_id,
      date_order_type: 3,
      latitude: 0,
      longitude: 0,
      by_pass_tables_selection: this.settings.by_pass_tables_selection
    }
    this.showScheduleTime = true;
  }

  onSchedulingProcess(eventData: any) {
    this.createTableBooking(eventData);
  }

  createTableBooking(data) {
    var table_booking_param = {
      user_id: this.currentUser.id,
      // table_id: data.table_id,
      slot_id: data.slot_id,
      schedule_date: data.startTime,
      schedule_end_date: data.endTime,
      supplier_id: this.prodDetail.supplier_id,
      branch_id: this.prodDetail.supplier_branch_id
    }


    if(this.settings.table_book_mac_theme == 1){
      table_booking_param['amount'] =  data.table_booking_price;
      table_booking_param['seating_capacity'] =  data.table_seating;
      table_booking_param['table_id'] = '0';
      if(data.table_booking_price) {
          table_booking_param = {...table_booking_param, ...data['payment_details']};
      }
    } else {
        table_booking_param['table_id'] =  data.table_id;
    }

    this.http.postData(ApiUrl.makeTableBookingRequest, table_booking_param).subscribe((res: any) => {
      if (res.status == 200) {
        this.message.alert("success", "Your Table Booking request has been placed successfullyy!");
        this.router.navigateByUrl('/account/table-bookings');
      }
    })
  }

  addToWishList() {
    this.supplier.Favourite = this.supplier.Favourite == 0 ? 1 : 0
    this.onFavourite.emit();
  }

  trackBySTFn(id, index) {
    return index;
  }
  trackByCategoryFn(id, index) {
    return index;
  }
  trackBySupplierTagFn(id, index) {
    return index;
  }
  trackByCatsFn(id, index) {
    return index;
  }
  trackByTagsFn(id, index) {
    return index;
  }

  trackBySupplierCatFn(id, index) {
    return index;
  }

}
