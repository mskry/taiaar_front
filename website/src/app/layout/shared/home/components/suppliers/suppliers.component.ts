import { DateService } from './../../../../../services/date/date.service';
import { ApiUrl } from './../../../../../core/apiUrl';
import { HttpService } from './../../../../../services/http/http.service';
import { UtilityService } from './../../../../../services/utility/utility.service';
import { DataCacheService } from './../../../../../services/data-cache/data-cache.service';
import { AppSettings } from './../../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../../core/theme/styleVariables.model';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { skip } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: "app-suppliers",
  templateUrl: "./suppliers.component.html",
  styleUrls: ["./suppliers.component.scss"]
})
export class SuppliersComponent implements OnInit, OnDestroy {
  styleSubscription: Subscription;
  settingsSubscription: Subscription;
  themeSubscription: Subscription;
  pickupSubscription: Subscription;
  locationSubscription: Subscription;
  categorySubscription: Subscription;

  style: StyleVariables;
  settings: AppSettings;
  supplierId: string = "";
  allSuppliers: Array<any> = [];
  categories: Array<any> = [];
  count: number = 0;
  childIndex: number = -1;
  parentIndex: number = -1;
  isDarkTheme: boolean = false;
  isLoading: boolean = false;
  sortBy: number = 0;
  public catShortValue: number;

  constructor(
    private cacheService: DataCacheService,
    public util: UtilityService,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private dateService: DateService,
  ) { }

  ngOnInit() {
    this.styleSubscription = this.util.getStyles.subscribe(
      (style: StyleVariables) => {
        this.style = style;
      }
    );

    this.catShortValue = this.util.handler.selfPickup;

    this.makeSubscription();

    this.themeSubscription = this.util.getDarkTheme.subscribe((darkTheme) => {
      this.isDarkTheme = darkTheme;
    });

    this.locationSubscription = this.util.getUserLocation.pipe(skip(1)).subscribe((location) => {
      this.cacheService.removeKey(ApiUrl.getHomeSuppliers);
      if (this.settings.is_custom_category_template == '1') {
        this.getRecSubcategory();
      }
      else {
        this.getSuppliers();
      }
    });

    this.categorySubscription = this.util.getLanguageCategoryData.subscribe((data) => {
      if (data && data.english) {
        this.categories = data.english;
        if (this.settings.is_custom_category_template == '1') {
          this.getRecSubcategory();
        }
        else {
          this.getSuppliers();
        }
      }
    })

  }

  makeSubscription() {
    this.settingsSubscription = this.util.getSettings.subscribe(
      (settings: AppSettings) => {
        if (settings) {
          this.settings = settings;
          this.pickupSubscription = this.util.getSelfPickup.pipe(skip(1)).subscribe(() => {
            this.cacheService.removeKey(ApiUrl.getHomeSuppliers);
            if (this.settings.is_custom_category_template == '1') {
              this.getRecSubcategory();
            }
            else {
              this.getSuppliers();
            }
          });
        }
      }
    );
  }

  onCatSortBy(catShortBy: number) {
    if (catShortBy == 0 || catShortBy == 1) {
      this.util.handler.selfPickup = catShortBy;
    }
    this.catShortValue = catShortBy;
    this.cacheService.removeKey(ApiUrl.getHomeSuppliers);
    this.getSuppliers();
  }

  getSuppliers() {
    this.isLoading = true;
    let param_data = {
      languageId: this.util.handler.languageId,
      latitude: this.util.handler.latitude,
      longitude: this.util.handler.longitude,
      sort_by: this.sortBy,
      offset: moment().format('Z'),
      skip: 0,
      limit: 6
    };

    if (this.settings.app_type == 1) {
      param_data['self_pickup'] = this.util.handler.selfPickup;
    }

    if (this.settings.isCustomFlow) {
      let categoryId = this.route.snapshot.queryParams['cat_flow_id'];
      param_data['categoryId'] = categoryId || (this.categories.find(c => c.type == this.settings.app_type)).id
    }

    this.http.getData(ApiUrl.getHomeSuppliers, param_data, true, !this.settings.isCustomFlow)
      .subscribe(response => {
        if (!!response && response.data) {
          this.allSuppliers = [];
          this.count = response.data.length;
          (response.data).map(data => {
            if(data.self_pickup == this.util.handler.selfPickup || data.self_pickup == 2) {
              data["display_supplier_image"] = this.util.thumbnail(
                data["supplier_image"]
              );
              data["display_logo"] = this.util.thumbnail(data["logo"]);
              this.todaySupplierTimings(data);
              this.allSuppliers.push(data);
            }
          });
          this.allSuppliers = this.allSuppliers.slice(0, 12);
        }
        this.isLoading = false;
      }, (err) => this.isLoading = false);
  }

  todaySupplierTimings(supplier) {
    if (supplier.timing && supplier.timing.length) {
      const today = this.dateService.getDay(moment().format('dddd').toLowerCase())
      const todayTimes = supplier.timing.find((i) => i.week_id == today);
      if (todayTimes) {
        let startTime = todayTimes.start_time.split(':');
        let endTime = todayTimes.end_time.split(':');
        const openingTime = moment().set('h', startTime[0]).set('m', startTime[1]).set('s', startTime[2]);
        const closeTime = moment().set('h', endTime[0]).set('m', endTime[1]).set('s', endTime[2]);
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
    }
  }

  getRecSubcategory() {
    this.isLoading = true;
    let param_data = {
      languageId: this.util.handler.languageId,
      latitude: this.util.handler.latitude,
      longitude: this.util.handler.longitude,
    };

    if (this.settings.isCustomFlow) {
      let categoryId = this.route.snapshot.queryParams['cat_flow_id'];
      param_data['category_id'] = categoryId || (this.categories.find(c => c.type == this.settings.app_type)).id
    }

    this.http.getData(ApiUrl.getRecSubcategory, param_data, true, !this.settings.isCustomFlow)
      .subscribe(response => {
        if (!!response && response.data) {
          this.allSuppliers = [];
          this.count = response.data.supplier_with_subcategory.length;
          this.allSuppliers = response.data.supplier_with_subcategory.slice(0, 12);
          this.allSuppliers.map(data => {
            data["display_supplier_image"] = this.util.thumbnail(
              data["supplier_image"]
            );
            data["display_logo"] = this.util.thumbnail(data["logo"]);
          });
        }
        this.isLoading = false;
      }, (err) => this.isLoading = false);

  }


  onSortBy(sortBy: number) {
    this.sortBy = sortBy;
    this.cacheService.removeKey(ApiUrl.getHomeSuppliers);
    this.getSuppliers();
  }

  onLogoLoad(supplier) {
    supplier["display_logo"] = supplier["logo"];
  }

  onImageLoad(supplier) {
    supplier["display_supplier_image"] = supplier["supplier_image"];
  }

  productList(supplier) {
    if (this.settings.app_type == 1) {
      this.router.navigate(["/products", "listing"], {
        queryParams: {
          supplierId: supplier.id
        }
      });
    } else {
      let cat_ids: Array<any> = [];
      supplier["category"].forEach(element => {
        cat_ids.push(element.category_id);
      });
      this.router.navigate(['/supplier', 'supplier-detail'], {
        queryParams: {
          sup_id: supplier.id,
          branch_id: supplier.supplier_branch_id,
          cat_ids: cat_ids.join(),
        }
      });
    }
  }

  onSeeMore() {
    this.router.navigate(['/supplier', 'supplier-list'], {
      queryParams: {
        all: 1,
        sort: this.sortBy,
        cat_flow_id: this.route.snapshot.queryParams['cat_flow_id'] ? this.route.snapshot.queryParams['cat_flow_id'] : ''
      }
    })
  }
  trackBySuppliersFn(id, index) {
    return index;
  }
  trackByUtilSupplierFn(id, index) {
    return index;
  }
  trackByAllSuppliersFn(id, index) {
    return index;
  }
  trackBySubCatFn(id, index) {
    return index;
  }
  trackByFakelistFn(id, index) {
    return index;
  }
  ngOnDestroy() {
    if (!!this.styleSubscription) this.styleSubscription.unsubscribe();
    if (!!this.settingsSubscription) this.settingsSubscription.unsubscribe();
    if (!!this.themeSubscription) this.themeSubscription.unsubscribe();
    if (!!this.locationSubscription) this.locationSubscription.unsubscribe();
    if (!!this.pickupSubscription) this.pickupSubscription.unsubscribe();
    if (!!this.categorySubscription) this.categorySubscription.unsubscribe();
  }
}
