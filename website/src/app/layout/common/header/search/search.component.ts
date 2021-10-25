import { GlobalVariable } from './../../../../core/global';
import { ApiUrl } from './../../../../core/apiUrl';
import { HttpService } from './../../../../services/http/http.service';
import { Component, OnInit, Input, Inject, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AppSettings } from '../../../../shared/models/appSettings.model';
import { UtilityService } from '../../../../services/utility/utility.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { StyleVariables } from '../../../../core/theme/styleVariables.model';
import { FirebaseAnalyticsService } from '../../../../services/firebase-analytics/firebase-analytics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {


  @Input() settings: AppSettings;
  @Input() style: StyleVariables;
  @Input() searchBy: number = 0;
  @Output() searched = new EventEmitter<boolean>(false);

  searchText: string = '';
  allParams: any = {};
  localSearchedData: Array<string> = [];


  srchTextToShow: string = "Table Booking";

  tags: Array<any> = [];
  selectedTags: Array<any> = [];
  isMobile: boolean = GlobalVariable.IS_MOBILE;

  orderTypeSubscription: Subscription;
  selected_order_type: number = 2;
  show_header_custom_search: boolean = false;


  constructor(
    private utilityService: UtilityService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private firebaseAnalyticsSvc: FirebaseAnalyticsService,
    @Inject(DOCUMENT) private document
  ) {
    this.style = new StyleVariables();
  }

  ngOnInit() {
    if (this.settings.search_by == 2 && this.settings.is_unify_search == 0) {
      this.searchBy = 1;
    }
    let localSearchData = this.utilityService.getLocalData('product-search', true);
    if (localSearchData) this.localSearchedData = localSearchData;

    this.subscribeRoute();
    if (this.settings.selected_template == 4 && this.settings.app_type == 1) {
      this.getOrderType();
      this.setOrderType(this.selected_order_type);
    }

    if (this.settings.enable_custom_header_contant) {
      this.router.events.subscribe((val: any) => {
        if (val.route) {
          if (val.route.path == '/' || val.route.path == '' || val.route.path == 'cart') {
            this.show_header_custom_search = true;
          }
          else {
            this.show_header_custom_search = false;
          }
        }
        else {
          if (val.url == '/' || val.url == '' || val.url == 'cart') {
            this.show_header_custom_search = true;
          }
          else {
            this.show_header_custom_search = false;
          }
        }
      });
    }

  }

  getOrderType() {
    this.orderTypeSubscription = this.utilityService.getOrderTypeData.subscribe((res: any) => {
      if (res) {
        this.selected_order_type = (Number)(res);
      }
    })
  }

  subscribeRoute() {
    this.route.queryParams
      .subscribe(params => {
        if (params.f) {
          this.allParams = this.utilityService.decryptData(params.f);
          this.searchText = this.allParams.product ? this.allParams.product : null;
        } else {
          this.allParams = {};
          if (this.settings.is_unify_search == 1) {
            this.searchText = params.search;
          } else {
            if (params.search) {
              this.searchText = params.search;
            } else {
              this.searchText = '';
            }
          }
        }
      });
  }


  searchProduct(searchedVal: string) {
    let searchResults = [];
    if (searchedVal.trim()) {
      if (!this.allParams['supplierId'] || !this.allParams['subCatId']) {
        this.utilityService.clearLocalData('pickUp_DT');
      }
      if (this.localSearchedData) {
        if (!this.localSearchedData.includes(searchedVal)) {
          if (this.localSearchedData.length > 2) {
            this.localSearchedData.pop();
          }
          this.localSearchedData.unshift(searchedVal);
        }
        searchResults = [...this.localSearchedData];
      } else {
        searchResults.push(searchedVal);
      }

      this.utilityService.setLocalData('product-search', searchResults, true);

      if (this.settings.is_unify_search == 1) {
        this.router.navigate(['/products/search'], {
          queryParams: { search: searchedVal }
        });
      } else {
        if (this.settings.app_type == 8) this.allParams['agent'] = 1;

        this.allParams.product = searchedVal;
        if (this.settings.selected_template != 4) {
          if (this.searchBy === 1) {
            this.firebaseAnalyticsSvc.firebaseAnalyticsEvents('search_restaurant', 'search_restaurant');
            this.router.navigate(['/supplier', 'supplier-list'], {
              queryParams: {
                all: 1,
                search: searchedVal,
                searchBy: this.searchBy
              }
            });
          } else {
            this.firebaseAnalyticsSvc.firebaseAnalyticsEvents('search_plate', 'search_plate');
            this.router.navigate(['/products', 'product-listing', searchedVal.replace(/ &/g, '-')], {
              queryParams: { f: this.utilityService.encryptData(this.allParams), searchBy: this.searchBy }
            });
          }
        }
        else {
          this.firebaseAnalyticsSvc.firebaseAnalyticsEvents('search_restaurant', 'search_restaurant');
          this.router.navigate(['/supplier', 'supplier-list'], {
            queryParams: {
              all: 1,
              search: searchedVal,
              searchBy: this.searchBy
            }
          });
        }
      }

      if (!!this.document.getElementById('recentSearch')) {
        this.document.getElementById('recentSearch').classList.remove("show");
      }
      if (GlobalVariable.IS_MOBILE) {
        this.searched.emit(false);
      }
    }
  }

  onTagSearch($event) {

    const params: any = {
      limit: 10,
      offset: 0,
      latitude: this.utilityService.handler.latitude,
      longitude: this.utilityService.handler.longitude,
      languageId: this.utilityService.handler.languageId,
      tags: $event.query
    }
    this.httpService.getData(ApiUrl.tagSearch, params).subscribe((response) => {
      if (response && response.data) {
        this.tags = response.data.product;
      }
    })
  }

  onSearch() {
    const queryParams: any = {
      tags: (this.tags.map(tag => tag.name)).toString(),
      tag_search: 1
    }
    this.router.navigate(['/supplier', 'supplier-list'], { queryParams: queryParams })
  }

  cancelSearch() {
    if (this.router.url.startsWith(`/`)) {
      this.searchText = '';
    } else {
      this.allParams.product = null;
      this.router.navigate(['/products', 'product-listing', 'all-product'], {
        queryParams: { f: this.utilityService.encryptData(this.allParams) }
      });
      this.tags = [];
    }
  }

  navigate(url) {
    this.router.navigate([url]);
  }


  trackByFn(id, index) {
    return index;
  }
  trackBySearchFn(id, index) {
    return index;
  }
  setOrderType(type?: number) {
    switch (type) {
      case 0:
        this.searchBy = 0;
        this.searchText = '';
        this.srchTextToShow = 'Delivery';
        this.utilityService.setOrderTypeData("0");
        break;
      case 1:
        this.searchBy = 1;
        this.searchText = '';
        this.srchTextToShow = 'Pick Up';
        this.utilityService.setOrderTypeData("1");
        break;
      case 2:
        this.searchBy = 2;
        this.searchText = '';
        this.srchTextToShow = 'Table Booking';
        this.utilityService.setOrderTypeData("2");
        break;
    }
  }

  ngOnDestroy() {
    // if (!!this.orderTypeSubscription) this.orderTypeSubscription.unsubscribe();

  }
}
