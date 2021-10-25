import { GlobalVariable } from '../../../../core/global';

import { ApiUrl } from '../../../../core/apiUrl';
import { skip } from 'rxjs/operators';
import { WINDOW } from '../../../../services/window/window.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http/http.service';
import { UtilityService } from '../../../../services/utility/utility.service';
import { DataCacheService } from '../../../../services/data-cache/data-cache.service';
import { Subscription } from 'rxjs';
import { StyleVariables } from '../../../../core/theme/styleVariables.model';
import { AppSettings } from '../../../../shared/models/appSettings.model';
import { Component, OnInit, Input, Inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-food-recommneded-supplier-mc',
  templateUrl: './food-recommneded-supplier-mc.component.html',
  styleUrls: ['./food-recommneded-supplier-mc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodRecommendedSuppliersMCComponent implements OnInit {

  @Input() settings: AppSettings;
  @Input() style: StyleVariables;
  themeSubscription: Subscription;
  pickupSubscription: Subscription;
  locationSubscription: Subscription;
  orderTypeSubscription: Subscription;


  supplierId: string = "";
  allSuppliers: Array<any> = [];
  count: number = 0;
  childIndex: number = -1;
  parentIndex: number = -1;
  isDarkTheme: boolean = false;
  isLoading: boolean = false;

  categoryData: Array<any> = [];
  category_length: number = 12;

  cat_fixed: boolean = false;
  sortBy: number = 0;
  uniqueId: string = GlobalVariable.UNIQUE_ID;

  public selected_order_type: number = 1;


  public catShortValue: number;
  constructor(
    private cacheService: DataCacheService,
    public util: UtilityService,
    private http: HttpService,
    private router: Router,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit() {
    this.makeSubscription();

    this.themeSubscription = this.util.getDarkTheme.subscribe((darkTheme) => {
      this.isDarkTheme = darkTheme;
    });

    this.locationSubscription = this.util.getUserLocation.pipe(skip(1)).subscribe((location) => {
      this.cacheService.removeKey(ApiUrl.getSpecialOffers);
      this.cacheService.removeKey(ApiUrl.getSpecialOffersV1);
      this.getRecommendedSuppliers();
    });
    if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
      this.getOrderType();
    }
    else {
      this.getRecommendedSuppliers();
    }

  }

  getOrderType() {
    this.orderTypeSubscription = this.util.getOrderTypeData.subscribe((res: any) => {
      if (res) {
        this.selected_order_type = (Number)(res);
        this.cacheService.removeKey(ApiUrl.getSpecialOffers);
        this.cacheService.removeKey(ApiUrl.getSpecialOffersV1);
        this.getRecommendedSuppliers();
      }
    })
  }

  @HostListener("window:scroll", ["$event"])
  onScroll() {
    if (Math.ceil(this.window.pageYOffset) >= 1460) this.cat_fixed = true;
    else this.cat_fixed = false;
  }

  makeSubscription() {
    this.pickupSubscription = this.util.getSelfPickup.pipe(skip(1)).subscribe(() => {
      this.cacheService.removeKey(ApiUrl.getSpecialOffers);
      this.cacheService.removeKey(ApiUrl.getSpecialOffersV1);
      this.getRecommendedSuppliers();
    });

    this.catShortValue = this.util.handler.selfPickup;
  }




  getRecommendedSuppliers() {
    this.isLoading = true;
    let params = {
      languageId: this.util.handler.languageId,
      latitude: this.util.handler.latitude,
      longitude: this.util.handler.longitude
    };
    if (this.settings.enable_rating_wise_sorting) {
      params['order_by'] = 1;
    }

    if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
      switch (this.selected_order_type) {
        case 0:
          params['filter_by'] = 1;
          break;
        case 1:
          params['filter_by'] = 2;
          break;
        case 2:
          params['filter_by'] = 3;
          break;
      }
    }

    this.http.getData(ApiUrl.getSpecialOffersV1, params, true, true).subscribe(response => {
      if (!!response && response.data) {
        this.allSuppliers = [];
        this.count = response.data.length;
        this.allSuppliers = response.data.SupplierInArabic;
        this.allSuppliers.map((data: any) => {
          parseFloat(data["rating"]);
          data["display_supplier_image"] = this.util.thumbnail(
            data["supplier_image"]
          );
          data["display_logo"] = this.util.thumbnail(data["logo"]);
        });
      }
      this.isLoading = false;
    }, (err) => this.isLoading = false);
  }




  getSuppliers() {
    this.isLoading = true;
    let param_data = {
      languageId: this.util.handler.languageId,
      latitude: this.util.handler.latitude,
      longitude: this.util.handler.longitude,
      sort_by: 2,
      offset: moment().format('Z'),
      skip: 0,
      limit: 6
    };

    if (this.settings.app_type == 1) {
      param_data['self_pickup'] = this.util.handler.selfPickup;
      switch (this.catShortValue) {
        case 0:
          param_data['self_pickup'] = 0;
          param_data['is_dine_in'] = 0;
          break;
        case 1:
          param_data['self_pickup'] = 1;
          param_data['is_dine_in'] = 0;
          break;
        case 2:
          param_data['is_dine_in'] = 1;
          param_data['self_pickup'] = 0;
          break;
      }
    }

    this.http.getData(ApiUrl.getHomeSuppliers, param_data, true, true)
      .subscribe(response => {
        if (!!response && response.data) {
          this.allSuppliers = [];
          this.count = response.data.length;
          this.allSuppliers = response.data;
        }
        this.isLoading = false;
      }, (err) => this.isLoading = false);
  }

  productList(supplier) {
    if (this.settings.app_type == 1) {
      this.router.navigate(["/", "products", "listing"], {
        queryParams: {
          supplierId: supplier.id,
          branchId: supplier.supplier_branch_id
        }
      });
    } else {
      let cat_ids: Array<any> = [];
      supplier["category"].forEach(element => {
        cat_ids.push(element.category_id);
      });
      this.router.navigate(['/', 'supplier', 'supplier-detail'], {
        queryParams: {
          sup_id: supplier.id,
          branch_id: supplier.supplier_branch_id,
          cat_ids: cat_ids.join(),
        }
      });
    }
  }

  onSeeMore() {
    let params = {
      all: 1,
      sort: this.sortBy,
    }
    if (this.settings.app_type == 1) {
      params['mode'] = this.catShortValue;
    }
    this.router.navigate(['/', 'supplier', 'supplier-list'], {
      queryParams: params
    });
  }


  supplierList(category: any) {
    const queryParams = { cat_id: category.id, cat_name: category.name }
    if (category.menu_type == 1 && category.sub_category && category.sub_category.length) {
      queryParams['n_lvl'] = 1
    }
    if (this.settings.show_tags_for_suppliers) {
      delete queryParams.cat_id;
      queryParams['tag_id'] = category.id;
    }
    if (this.settings.enable_rating_wise_sorting) {
      queryParams['sort'] = 2;
    }
    this.router.navigate(['/', 'supplier', 'supplier-list'], { queryParams });
  }
  trackByAllSuppFn(id, index) {
    return index;
  };
  trackBySuppFakeListFn(id, index) {
    return index;
  };
  ngOnDestroy() {
    if (!!this.themeSubscription) this.themeSubscription.unsubscribe();
    if (!!this.locationSubscription) this.locationSubscription.unsubscribe();
    if (!!this.pickupSubscription) this.pickupSubscription.unsubscribe();
  }
}
