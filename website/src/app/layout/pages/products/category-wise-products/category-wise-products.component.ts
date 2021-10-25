import { DialogService } from 'primeng/dynamicdialog';
import { AddOnComponent } from 'src/app/layout/shared/product/components/add-on/add-on.component';
import { CartService } from 'src/app/services/cart/cart.service';
import { ApiUrl } from 'src/app/core/apiUrl';
import { FiltersModel } from 'src/app/shared/models/filters.model';
import { PaginationModel } from './../../../../shared/models/pagination.model';
import { StyleVariables } from 'src/app/core/theme/styleVariables.model';
import { AppSettings } from 'src/app/shared/models/appSettings.model';
import { Subscription } from 'rxjs';
import { UserService } from './../../../../services/user/user.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { HttpService } from 'src/app/services/http/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-category-wise-products',
  templateUrl: './category-wise-products.component.html',
  styleUrls: ['./category-wise-products.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CategoryWiseProductsComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  styleSubscription: Subscription;
  settingsSubscription: Subscription;
  cartSubscription: Subscription;
  routeSubscription: Subscription;

  loggedIn: boolean = false;
  settings: AppSettings;
  style: StyleVariables;
  productstate: any = {
    hideSupplier: false
  };
  cart: Array<any> = [];
  categoryId: any = '';
  subCategoryId: any = '';
  supplierIds: any;
  noData: boolean = false;
  isLoading: boolean = true;
  pagination: PaginationModel;
  filterData: FiltersModel;
  subCategoryIds: Array<any> = [];
  productList: Array<any> = [];
  selected_category: any = {};
  categories: Array<any> = [];
  selectedSorting: string = '';
  selected_subcat: any = '';
  subCategoryAr: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    public util: UtilityService,
    private user: UserService,
    private cartService: CartService,
    public dialogService: DialogService,
    private router: Router,

  ) {

    this.userSubscription = this.user.currentUser.subscribe(user => {
      if (!!user && user["access_token"]) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });

    this.pagination = new PaginationModel();
    this.filterData = new FiltersModel();

  }

  ngOnInit() {
    this.styleSubscription = this.util.getStyles
      .subscribe(style => {
        this.style = style;
      });

    this.settingsSubscription = this.util.getSettings
      .subscribe((settings: AppSettings) => {
        if (settings) {
          this.settings = settings;
          this.productstate.hideSupplier = !!this.settings.is_single_vendor;
          if(this.settings.pickit_home_theme == 1){
            this.filterData.low_to_high = 2
          }
        }
      });

    this.routeSubscription = this.route.queryParams
      .subscribe(_params => {
        if (_params.f) {
          let params = this.util.decryptData(_params.f);
          this.categoryId = params['category'] || params['categoryId'] || null;
          this.subCategoryId = params['subCategoryId'] || null;
          this.supplierIds = params.supplierId ? params.supplierId : [];  
          this.getCategories();
        }
      });

    this.cartSubscription = this.util.getCart.subscribe(cart => {
      if (cart) {
        this.cart = cart;
      }
    });

    this.setSelectedSorting();

    this.getCategories();
  }

  filterProducts(is_page_change: boolean) {
    this.isLoading = true;
    if (!is_page_change) {
      this.pagination.currentPage = 1;
      this.pagination.offset = 0;
    }

    this.noData = false;

    let param_data = { ...this.filterData };
    param_data['languageId'] = this.util.handler.languageId;
    param_data['offset'] = this.pagination.offset;
    param_data['limit'] = this.pagination.perPage;
    param_data['latitude'] = this.util.handler.latitude;
    param_data['longitude'] = this.util.handler.longitude;
    param_data['need_agent'] = 0;
    param_data['subCategoryId'] = this.subCategoryIds;
    param_data['is_availability'] = 0;

    if (this.supplierIds) param_data['supplier_ids'] = this.supplierIds;

    if (param_data['low_to_high'] == -1 && this.settings.no_default_product_sort == 1) {
      delete param_data['low_to_high'];
    }

    this.http.postData(ApiUrl.filterProducts, param_data, false)
      .subscribe((response: any) => {
        this.productList = [];
        if (!!response && response.data) {
          this.pagination.count = response.data.count;
          this.productList = response.data.product;
          this.productList.map(data => {
            this.util.productPriceToFloat(data);
            data['avg_rating'] = Number.parseFloat(data['avg_rating']).toFixed(1);
            data['discount_price'] = Math.round(((data.display_price - data.fixed_price) / data.display_price) * 100);
            data['selectedQuantity'] = 0;
            this.util.productPriceToFloat(data);
            data["discountPercentage"] = parseFloat((((data.display_price - data.fixed_price) / data.display_price) * 100).toFixed(2));
            data["discount"] = Math.round(data.discountPercentage);

            if (this.cart.length) {
              this.cart.forEach(cartProduct => {
                if (cartProduct.productId == data.product_id) {
                  data['selectedQuantity'] = cartProduct['selectedQuantity'];
                  if (data['price_type']) {
                    data['fixed_price'] = cartProduct['fixed_price'];
                  }
                  if (!!cartProduct['customization']) {
                    data['customization'] = cartProduct['customization'];
                  }
                }
              });
            }
          });
        }
        this.noData = true;
        this.isLoading = false;
      }, (err) => this.isLoading = false);
  }

  getSubCategories(cat) {
    cat.sub_category.forEach(el => {
      if (el.sub_category && el.sub_category.length) {
        this.getSubCategories(el)
      } else {
        this.subCategoryAr.push(el);
      }
    });
  }

  getCategories() {
    let param_data = {
      language_id: this.util.handler.languageId
    }
    this.http.getData(ApiUrl.getCategories, param_data, true)
      .subscribe(response => {
        if (!!response && response.data) {
          this.categories = response.data;
          this.selected_category = (response.data).find(el => el.id == this.categoryId);
          // if(this.selected_category.sub_category.length && this.subCategoryId) {
          //   this.selected_subcat = this.selected_category.sub_category.find(el => el.id == this.subCategoryId[0])
          // }
          this.filterCategories();
        }
      });
  }

  filterCategories() {
    this.subCategoryAr = [];
    const sub = this.categories.find(o => o.id == this.categoryId);
    if (!!sub) {
      this.getSubCategories(sub);
    }
    if (this.subCategoryAr.length) {
      this.subCategoryIds = this.subCategoryId ? [this.subCategoryId]:[this.subCategoryAr[0].id];
      this.selected_subcat = this.subCategoryId ? this.subCategoryId : this.subCategoryAr[0].id;
    } else {
      this.subCategoryIds = [this.categoryId];
    }
    this.filterProducts(false);
  }

  selectCategory(category) {
    this.selected_category = category;
    this.categoryId = category.id;
    let param_obj = {};
    Object.assign(param_obj, this.util.handler);
    param_obj['category'] = this.selected_category.id;
    param_obj['path'] = [category.name];
    param_obj['supplierId'] = this.settings.is_single_vendor == 1 ?  [this.settings.single_vendor_id]: [];
    this.router.navigate(['products', 'list'], {
      queryParams: { f: this.util.encryptData(param_obj) }
    });
    // this.filterCategories();
  }

  onSort(type: number) {
    if (this.filterData.low_to_high == type) {
      return;
    }
    this.filterData.low_to_high = type;
    this.setSelectedSorting();
    this.filterProducts(false);
  }

  pageChange(event) {
    this.pagination.currentPage = event;
    this.pagination.offset = event > 1 ? (event - 1) * this.pagination.perPage : 0;
    window.scroll(0,500)
    this.filterProducts(true);
  }

  selectSubCategory(subCatId: any, index: number) {
    this.subCategoryIds = [subCatId];
    this.selected_subcat = subCatId;
    this.pagination = new PaginationModel();
    let param_obj = {};
    Object.assign(param_obj, this.util.handler);
    param_obj['category'] = this.selected_category.id;
    param_obj['path'] = [this.selected_category.name];
    param_obj['supplierId'] = this.settings.is_single_vendor == 1 ?  [this.settings.single_vendor_id]: [];
    param_obj['subCategoryId'] = subCatId
    this.router.navigate(['products', 'list'], {
      queryParams: { f: this.util.encryptData(param_obj) }
    });
    this.filterProducts(false);
  }

  setSelectedSorting() {
    switch (this.filterData.low_to_high) {
      case -1:
        this.selectedSorting = 'Default';
        break;
      case 0:
        this.selectedSorting = 'High to Low';
        break;
      case 1:
        this.selectedSorting = 'Low to High';
        break;
      case 3:
        this.selectedSorting = 'Popularity';
        break;
        case 2:
        this.selectedSorting = 'Sequence Wise';
        break;
      default:
        this.selectedSorting = 'Low to High';
    }
  }

  addProduct(product) {
    if (product['is_product_adds_on'] !== 1) {
      this.cartService.addToCart(product, this.productList);
      return;
    }

    this.openAddOnDialog(product);
  }

  removeProduct(product) {
    if (product['customization'] && product['customization'].length) {
      this.openAddOnDialog(product);
    } else {
      this.cartService.removeFromCart(product)
    }
  }

  openAddOnDialog(product) {
    const dialogRef = this.dialogService.open(AddOnComponent, {
      header: product['name'],
      width: '50%',
      showHeader: false,
      // contentStyle: { "max-height": "350px", "overflow": "auto" },
      transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      data: {
        product: product,
        addOnItems: product['adds_on']
      }
    })

    dialogRef.onClose.subscribe(() => {
      if (product.customization && product.customization.length) {
        // this.router.navigate(['/', this.settings.app_type, 'cart']);
      }
    })
  }

  ngOnDestroy() {
    if (!!this.userSubscription) this.userSubscription.unsubscribe();
    if (!!this.styleSubscription) this.styleSubscription.unsubscribe();
    if (!!this.settingsSubscription) this.settingsSubscription.unsubscribe();
    if (!!this.cartSubscription) this.cartSubscription.unsubscribe();
    if (!!this.routeSubscription) this.routeSubscription.unsubscribe();
  }

}
