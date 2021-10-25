import { LocalizationPipe } from './../../../../shared/pipes/localization.pipe';
import { ApiUrl } from './../../../../core/apiUrl';
import { MessagingService } from './../../../../services/messaging/messaging.service';
import { UserService } from './../../../../services/user/user.service';
import { HttpService } from './../../../../services/http/http.service';
import { GlobalVariable } from './../../../../core/global';
import { Router } from '@angular/router';
import { UtilityService } from './../../../../services/utility/utility.service';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-food-recommended-suppliers',
  templateUrl: './food-recommended-suppliers.component.html',
  styleUrls: ['./food-recommended-suppliers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodRecommendedSuppliersComponent implements OnInit, OnChanges {

  @Input() recommendedData: any;
  @Input() isLoading: boolean = false;
  @Input() style: StyleVariables;
  @Input() settings: AppSettings;

  loggedIn: boolean = false;
  currency: string = "";
  supplier: any;
  showSupplier: boolean = false;
  suppliers: Array<any> = [];
  parentIndex: number = -1;
  childIndex: number = -1;

  siteName: string = '';

  userSubscription: Subscription;
  orderTypeSubscription: Subscription;
  supplierDetail: any;

  slideConfig = {
    "slidesToShow": 2,
    "slidesToScroll": 1,
    "dots": true,
    "arrows": false,
    "infinite": false,
    "autoplay": true,
    "autoplaySpeed": 3000
  };

  schedulingData: any = {};
  showScheduleTime: boolean = false;
  currentUser: any = {};

  selected_order_type: number = 1;

  constructor(
    public util: UtilityService,
    private router: Router,
    private http: HttpService,
    private userService: UserService,
    private message: MessagingService,
    private translate: TranslateService,
    private localization: LocalizationPipe
  ) {
    this.siteName = GlobalVariable.SITE_NAME;
    this.style = new StyleVariables();
  }

  ngOnInit() {
    if (this.settings.selected_template == 2) {
      this.slideConfig.slidesToShow = GlobalVariable.IS_MOBILE ? 1 : 3;
    }
    if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
      this.slideConfig.slidesToShow = 3
    }
    this.getLoggedInUser();
    if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
      this.getOrderType();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.recommendedData && changes.recommendedData.currentValue) {
      this.getSuppliers();
    }
    //this.changeDetection.markForCheck()
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

  getSuppliers() {
    if (!this.recommendedData) { return }
    this.recommendedData.map((data: any) => {
      this.currency = GlobalVariable.CURRENCY;
      parseFloat(data["rating"]);
    });
    this.suppliers = this.recommendedData;
  }

  onSeeMore() {
    this.router.navigate(['/', 'supplier', 'supplier-list'], {
      queryParams: {
        'rec': 1
      }
    })
  }

  productList(supplier) {
    let queryParams = {
      supplierId: supplier.id || supplier.supplier_id
    }
    if (this.settings.branch_flow == 1 && supplier.is_multibranch == 1) {
      queryParams['is_branches'] = 1;
    }
    if (this.settings.app_type == 1) {
      this.router.navigate(['/', 'products', 'listing'], {
        queryParams: queryParams
      });
    }
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
          this.util.setSupplier(detail)
        }
      });
  }
  buySubsc() {
    if (!this.loggedIn) {
      this.util.setLocalData('redirectAfterLogin', 'account/subscriptions', false);
      this.util.authToggle.next(true);
    } else {
      this.router.navigate(['account/subscriptions']);
    }
  }
  rewards() {
    if (!this.loggedIn) {
      this.util.setLocalData('redirectAfterLogin', 'account/loyalty', false);
      this.util.authToggle.next(true);
    } else {
      this.router.navigate(['account/loyalty']);
    }
  }
  getOrderType() {
    this.orderTypeSubscription = this.util.getOrderTypeData.subscribe((res: any) => {
      if (res) {
        this.selected_order_type = (Number)(res);
      }
    })
  }
  
  getSupplierDetail() {
    this.util.getSupplier
      .subscribe(supplier => {
        if (supplier.id == this.supplier.id) {
          this.supplier == supplier
        }
      });
  }


  openSchedulingModal(supplier) {
    if (!this.loggedIn) {
      this.util.authToggle.next(true);
      return false;
    }
    this.supplierDetail = supplier;
    this.schedulingData = {
      supplier_id: (Number)(supplier.id),
      branch_id: supplier.supplier_branch_id,
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
      supplier_id: this.supplierDetail.id,
      branch_id: this.supplierDetail.supplier_branch_id
    }

    if (this.settings.table_book_mac_theme == 1) {
      table_booking_param['amount'] = data.table_booking_price;
      table_booking_param['seating_capacity'] = data.table_seating;
      table_booking_param['table_id'] = '0';
      if (data.table_booking_price) {
        table_booking_param = { ...table_booking_param, ...data['payment_details'] };
      }
    } else {
      table_booking_param['table_id'] = data.table_id;
    }

    if (data) {
      this.http.postData(ApiUrl.makeTableBookingRequest, table_booking_param).subscribe((res: any) => {
        if (res.status == 200) {
          this.message.alert("success", "Your Table Booking request has been placed successfully!");
          this.router.navigateByUrl('/account/table-bookings');
        }
      })
    }
    else {
      let queryParams = {
        supplierId: this.schedulingData.supplier_id,
        action: "tb_item"
      }
      if (this.settings.app_type == 1) {
        this.router.navigate(['/', 'products', 'listing'], {
          queryParams: queryParams
        });
      }
    }
  }

  trackBySuppFn(id, index) {
    return index;
  };
  trackByFakeSuppFn(id, index) {
    return index;
  };
  trackBySupplierFn(id, index) {
    return index;
  };
  trackBySuppFakeListFn(id, index) {
    return index;
  };
  trackBySuppliersFn(id, index) {
    return index;
  };
  trackByGenerateFakeFn(id, index) {
    return index;
  };
  trackBySupplrFn(id, index) {
    return index;
  };
  trackByCatFn(id, index) {
    return index;
  };
  trackBySupplierFakeFn(id, index) {
    return index;
  };
}
