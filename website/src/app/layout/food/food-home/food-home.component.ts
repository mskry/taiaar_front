import { SeoService } from './../../../services/seo/seo.service';
import { ApiUrl } from './../../../core/apiUrl';
import { GlobalVariable } from './../../../core/global';
import { DataCacheService } from './../../../services/data-cache/data-cache.service';
import { CartService } from './../../../services/cart/cart.service';
import { UserService } from './../../../services/user/user.service';
import { HttpService } from './../../../services/http/http.service';
import { UtilityService } from './../../../services/utility/utility.service';
import { AppSettings } from './../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../core/theme/styleVariables.model';
import { Component, OnInit, ViewChild, Inject, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '@ng-toolkit/universal';
import { skip } from 'rxjs/operators';
import { SingleVendorComponent } from '../../shared/home/components/single-vendor/single-vendor.component';

@Component({
  selector: 'app-food-home',
  templateUrl: './food-home.component.html',
  styleUrls: ['./food-home.component.scss']
})
export class FoodHomeComponent implements OnInit, OnDestroy {
  @ViewChild(SingleVendorComponent, { static: false }) single_vendor: SingleVendorComponent;

  settingsSubscription: Subscription;
  offerSubscription: Subscription;
  styleSubscription: Subscription;
  selfPickSubscription: Subscription;
  locationSubscription: Subscription;
  categorySubscription: Subscription;
  orderTypeSubscription: Subscription;
  zoneGeofenceSubscription: Subscription;


  settings: AppSettings;
  homeData: any;
  categories: Array<any> = [];
  homeCategoryList: Array<any> = [];
  topBanner: any = [];
  bannerImage: string = "";
  style: StyleVariables;
  selectedTab: number = 1;

  siteName: string = '';

  tabOffset: number = 0;
  one: number = 0;
  two: number = 0;
  three: number = 0;
  four: number = 0;

  showBrands: boolean = false;
  isLoading: boolean = true;

  loggedIn: boolean = false;

  clientCode: string = GlobalVariable.UNIQUE_ID;

  recommendedData: any;

  selected_order_type: number = 1;

  public zoneGeofences: any;
  public is_serving_area: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private util: UtilityService,
    private http: HttpService,
    private cart: CartService,
    private data_cache: DataCacheService,
    private userService: UserService,
    private seo: SeoService,
    @Inject(DOCUMENT) private document,
    @Inject(WINDOW) private window: Window) {

    this.siteName = GlobalVariable.SITE_NAME;

    this.settingsSubscription = this.util.getSettings.subscribe(
      (settings: AppSettings) => {
        if (settings) {
          this.settings = settings;
        }
      }
    );
  }

  @HostListener('window:resize', [])
  onResize() {
    if (!!this.settings && [1, 2].includes(this.settings.app_type)) {
      this.tabOffset = 0;
      this.one = 0;
      this.two = 0;
      this.three = 0;
      this.four = 0;
    }
  }

  @HostListener("window:scroll", [])
  onWindowScroll(refresh) {
    if (!!this.settings && [1, 2].includes(this.settings['app_type'])) {
      if (refresh) {
        this.window.scrollTo(0, 0);
      }

      this.one = this.document.getElementById("1")
        ? this.one < (this.document.getElementById("1").offsetTop + 300) ? this.document.getElementById("1").offsetTop + 300 : this.one
        : null;
      this.two = this.document.getElementById("2")
        ? this.two < (this.document.getElementById("2").offsetTop + 300) ? this.document.getElementById("2").offsetTop + 300 : this.two
        : null;

      const offset = this.window.pageYOffset;

      if (!!this.one && offset < this.two) {
        this.selectedTab = 1;
      } else if (!!this.two && offset > this.two) {
        this.selectedTab = 2;
      }
    }

  }

  ngOnInit() {
    this.styleSubscription = this.util.getStyles.subscribe(
      (style: StyleVariables) => {
        this.style = style;
      }
    );

    this.categorySubscription = this.util.getLanguageCategoryData.subscribe((data) => {
      if (data && data.english) {
        this.categories = data.english;
        if (this.settings.isCustomFlow) {
          let categoryId = this.route.snapshot.queryParams['cat_flow_id'];
          if (categoryId) {
            let category = this.categories.find(c => c.type == this.settings.app_type && categoryId == c.id);
            if (category) this.homeCategoryList = category.sub_category;
          }
        } else {
          this.homeCategoryList = this.categories;
        }
        if (this.settings.enable_zone_geofence) {
          this.getZoneGeofences();
        }
        else {
          if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
            this.getOrderType();
          }
          else {
            this.getHomeData();
          }
        }
      }
    })

    this.locationSubscription = this.util.getUserLocation.pipe(skip(1)).subscribe((location) => {
      this.data_cache.removeKey(ApiUrl.getSpecialOffers);
      this.data_cache.removeKey(ApiUrl.getSpecialOffersV1);
      this.data_cache.removeKey(ApiUrl.getSpecialOffersV2);
      if (this.settings.enable_zone_geofence) {
        this.getZoneGeofences();
      }
      else {
        this.getHomeData();
      }
      if (this.settings.app_type == 1 && this.settings.is_single_vendor) {
        this.data_cache.removeKey(ApiUrl.getSupplierDetailProduct);
        this.single_vendor.getDetails();
      }
    })
  }




  getZoneGeofences() {
    this.zoneGeofenceSubscription = this.util.getZoneGeofences.subscribe((res: any) => {
      if (res && res.length) {
        this.is_serving_area = true;
        this.getHomeDataWithZoneGeofence();
      }
      else {
        this.is_serving_area = false;
      }
    })
  }




  getHomeData() {
    this.isLoading = true;
    const params: any = {
      languageId: this.util.handler.languageId,
      latitude: this.util.handler.latitude || 0,
      longitude: this.util.handler.longitude || 0
    };

    if (this.settings.isCustomFlow) {
      let categoryId = this.route.snapshot.queryParams['cat_flow_id'];
      params.categoryId = categoryId || (this.categories.find(c => c.type == this.settings.app_type)).id;

      if (categoryId) {
        let catData = this.categories.find(c => c.type == this.settings.app_type && categoryId == c.id);
        this.seo.updateTitle(`${catData.name} | ${GlobalVariable.SITE_NAME}`);
      }

    } else {
      this.seo.setDefault();
    }

    var api = '';
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
    if (this.settings.selected_template == 4 && this.settings.enable_rating_wise_sorting) {
      api = ApiUrl.getSpecialOffersV1;
      params['order_by'] = 1;
    }
    else {
      api = ApiUrl.getSpecialOffers;
    }

    this.http.getData(api, params, true, !this.settings.isCustomFlow)
      .subscribe(response => {
        if (!!response && response.data) {
          this.homeData = response.data;
          if ([3].includes(this.settings.selected_template)) {
            this.recommendedData = this.homeData.bestSellersSuppliers;
          }
          else {
            this.recommendedData = this.homeData.SupplierInArabic;
          }
        } else {
          this.isLoading = false;
          this.getHomeData()
        }
      }, err => this.isLoading = false);
  }



  getHomeDataWithZoneGeofence() {
    this.isLoading = true;
    const params: any = {
      languageId: this.util.handler.languageId,
      latitude: this.util.handler.latitude || 0,
      longitude: this.util.handler.longitude || 0
    };

    if (this.settings.isCustomFlow) {
      let categoryId = this.route.snapshot.queryParams['cat_flow_id'];
      params.categoryId = categoryId || (this.categories.find(c => c.type == this.settings.app_type)).id;

      if (categoryId) {
        let catData = this.categories.find(c => c.type == this.settings.app_type && categoryId == c.id);
        this.seo.updateTitle(`${catData.name} | ${GlobalVariable.SITE_NAME}`);
      }

    } else {
      this.seo.setDefault();
    }

    var api = '';
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

    api = ApiUrl.getSpecialOffersV2;

    this.http.getData(api, params, true, !this.settings.isCustomFlow)
      .subscribe(response => {
        if (!!response && response.data) {
          this.homeData = response.data;
          if ([3].includes(this.settings.selected_template)) {
            this.recommendedData = this.homeData.bestSellersSuppliers;
          }
          else {
            this.recommendedData = this.homeData.SupplierInArabic;
          }
        }
        this.isLoading = false;
      }, err => this.isLoading = false);
  }




  getOrderType() {
    this.orderTypeSubscription = this.util.getOrderTypeData.subscribe((res: any) => {
      if (res) {
        this.selected_order_type = (Number)(res);
        this.data_cache.removeKey(ApiUrl.getSpecialOffers);
        this.data_cache.removeKey(ApiUrl.getSpecialOffersV1);
        this.data_cache.removeKey(ApiUrl.getSpecialOffersV2);
        this.getHomeData();
      }
    })
  }

  set selfPickup(value: boolean) {
    this.util.setSelfPickup(Number(value));
    this.cart.emptyCart();
  }

  get selfPickup(): boolean {
    return this.util.handler.selfPickup == 1 ? true : false;
  }

  scrollTo(elementId) {
    // let element = document.getElementById(elementId);
    // element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    // this.window.scrollTo(0,element.offsetTop)
    // this.window.scrollTo(0,document.body.offsetHeight + document.getElementById(elementId).offsetTop)
    window.scrollTo(0,window.pageYOffset + document.getElementById(elementId).getBoundingClientRect().top - document.getElementById('header_app').getBoundingClientRect().height  )


  }

  onCategorySelect(category: any) {
    const queryParams = { cat_id: category.id, cat_name: category.name }
    if (category.menu_type == 1 && category.sub_category && category.sub_category.length) {
      queryParams['n_lvl'] = 1;
    }
    this.router.navigate(['/', 'supplier', 'supplier-list'], { queryParams });
  }

  buySubsc() {
    this.loggedIn = !!this.userService.getUserToken;
    if (!this.loggedIn) {
      this.util.setLocalData('redirectAfterLogin', 'account/subscriptions', false);
      this.util.authToggle.next(true);
    } else {
      this.router.navigate(['account/subscriptions']);
    }
  }

  rewards() {
    this.loggedIn = !!this.userService.getUserToken;
    if (!this.loggedIn) {
      this.util.setLocalData('redirectAfterLogin', 'account/loyalty', false);
      this.util.authToggle.next(true);
    } else {
      this.router.navigate(['account/loyalty']);
    }
  }

  trackByCatFn(id, index) {
    return index;
  };
  trackByHomeCatFn(id, index) {
    return index;
  };
  trackBySectionFn(id, index) {
    return index;
  };
  trackByhomeScreenFn(id, index) {
    return index;
  };
  ngOnDestroy() {
    if (!!this.settingsSubscription) this.settingsSubscription.unsubscribe();
    if (!!this.offerSubscription) this.offerSubscription.unsubscribe();
    if (!!this.styleSubscription) this.styleSubscription.unsubscribe();
    if (!!this.selfPickSubscription) this.selfPickSubscription.unsubscribe();
    if (!!this.locationSubscription) this.locationSubscription.unsubscribe();
    if (!!this.categorySubscription) this.categorySubscription.unsubscribe();
    if (!!this.orderTypeSubscription) this.orderTypeSubscription.unsubscribe();
    if (!!this.zoneGeofenceSubscription) this.zoneGeofenceSubscription.unsubscribe();

  }

}
