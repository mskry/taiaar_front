import { GlobalVariable } from './../../../../core/global';

import { ApiUrl } from './../../../../core/apiUrl';
import { CartService } from './../../../../services/cart/cart.service';
import { Router } from '@angular/router';
import { HttpService } from './../../../../services/http/http.service';
import { UtilityService } from './../../../../services/utility/utility.service';
import { Subscription } from 'rxjs';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AddOnComponent } from 'src/app/layout/shared/product/components/add-on/add-on.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-recommended-food',
  templateUrl: './recommended-food.component.html',
  styleUrls: ['./recommended-food.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendedFoodComponent implements OnInit, OnDestroy {

  @Input() settings: AppSettings;
  @Input() style: StyleVariables;
  themeSubscription: Subscription;
  userSubscription: Subscription;

  cartSubscription: Subscription;

  cart: Array<any> = [];

  supplierId: string = "";
  allSuppliers: Array<any> = [];

  isDarkTheme: boolean = false;
  isLoading: boolean = false;

  uniqueId: string = GlobalVariable.UNIQUE_ID;

  loggedIn: boolean = false;

  productstate: any = {
    hideSupplier: true
  }

  public catShortValue: number;
  constructor(
    public util: UtilityService,
    private http: HttpService,
    private router: Router,
    private user: UserService,
    public cartService: CartService,
    public dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.themeSubscription = this.util.getDarkTheme.subscribe((darkTheme) => {
      this.isDarkTheme = darkTheme;
    });

    this.cartSubscription = this.util.getCart.subscribe(cart => {
      if (cart) {
        this.cart = cart;
      }
    });
    this.userSubscription = this.user.currentUser
      .subscribe(user => {
        if (!!user && user['access_token']) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      });

    this.getData();
  }

  getData() {
    // if (this.settings.selected_template == 3 || this.settings.selected_template == 4) {
    //   this.getRecent();
    // }
    this.getRecent();
  }

  getRecent() {
    let params = {
      latitude: this.util.handler.latitude || 0,
      longitude: this.util.handler.longitude || 0,
      languageId: this.util.handler.languageId,
      offset: 0
    }

    this.http.getData(ApiUrl.recentlyViewed, params)
      .subscribe(response => {
        if (!!response && response.data) {
          this.allSuppliers = [];
          this.allSuppliers = response.data.recentActivity.slice(0, 12);
        }
      });
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
      rec_foods: 1
    }
    if (this.settings.app_type == 1) {
      params['mode'] = this.catShortValue;
    }
    this.router.navigate(['/', 'products', 'view-more-products'], {
      queryParams: params
    });
  }


  supplierList(category: any) {
    const queryParams = { cat_id: category.id, cat_name: category.name }
    if (category.menu_type == 1 && category.sub_category && category.sub_category.length) {
      queryParams['n_lvl'] = 1
    }
    this.router.navigate(['/', 'supplier', 'supplier-list'], { queryParams });
  }




  /********* Open Add On Dialog *********/

  openAddOnDialog(product) {
    const dialogRef = this.dialogService.open(AddOnComponent, {
      header: product['name'],
      width: '50%',
      style: { 'background-color': `${this.style.primaryColor} !important` },
      showHeader: false,
      // contentStyle: { "max-height": "350px", "overflow": "auto" },
      transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      data: {
        product: product,
        addOnItems: product['adds_on']
      }
    })

    dialogRef.onClose.subscribe(() => {
    })
  }

  addProduct(product) {
    if (product['is_product_adds_on'] !== 1) {
      this.cartService.addToCart(product);
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

  trackByProductSuppFn(id, index) {
    return index;
  };
  trackBySuppliersFn(id, index) {
    return index;
  };
  trackByProductFn(id, index) {
    return index;
  };
  trackByGenfakeFn(id, index) {
    return index;
  };
  trackByAllSuppFn(id, index) {
    return index;
  };
  trackByUtilfakeFn(id, index) {
    return index;
  };
  ngOnDestroy() {
    if (!!this.themeSubscription) this.themeSubscription.unsubscribe();
    if (!!this.userSubscription) this.userSubscription.unsubscribe();
    if (!!this.cartSubscription) this.cartSubscription.unsubscribe();

  }
}
