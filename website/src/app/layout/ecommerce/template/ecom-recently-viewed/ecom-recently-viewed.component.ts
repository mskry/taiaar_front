import { Subscription } from 'rxjs';
import { CartService } from './../../../../services/cart/cart.service';
import { UtilityService } from './../../../../services/utility/utility.service';
import { Router } from '@angular/router';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ecom-recently-viewed',
  templateUrl: './ecom-recently-viewed.component.html',
  styleUrls: ['./ecom-recently-viewed.component.scss']
})
export class EcomRecentlyViewedComponent implements OnInit, OnDestroy {

  @Input() settings: AppSettings;
  @Input() style: StyleVariables;
  @Input() isLoading: boolean;
  @Input() recentlyViewed: Array<any>;

  cart: Array<any> = [];
  cartSubscription: Subscription;

  slideConfig = {
    'slidesToShow': 3,
    'slidesToScroll': 1,
    'dots': false,
    'arrows': true,
    'infinite': false
  };

  constructor(
    private router: Router,
    private utilityService: UtilityService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.cartSubscription = this.utilityService.getCart.subscribe(cart => {
      if (cart) {
        this.cart = cart;
        this.recentlyViewed = this.mapData(this.recentlyViewed);
      }
    });
  }

  addProduct(product) {
    this.cartService.addToCart(product);
  }

  removeProduct(product) {
    this.cartService.removeFromCart(product)
  }

  productDetail(data: any) {
    if (this.settings.app_type != 1) {
      let obj = {
        productId: data.parent_id || data.product_id,
        supplierBranchId: data.supplier_branch_id,
        category: data.category_id
      };
      data.name = data.name.replace(/ &/g, "-");
      obj = { ...this.utilityService.handler, ...obj };
      this.router.navigate(["/products", "product-detail", data.name], {
        queryParams: { f: this.utilityService.encryptData(obj) }
      });
    }
  }

  mapData(recentlyViewed: Array<any>): Array<any> {
    if (!recentlyViewed || !recentlyViewed.length) {
      return recentlyViewed;
    }

    recentlyViewed.map((offer: any) => {
      offer['avg_rating'] = Number.parseFloat(offer['avg_rating']).toFixed(1);
      offer['image'] = this.utilityService.thumbnail(offer['image_path']);
      offer["selectedQuantity"] = 0;
      if (this.cart.length) {
        this.cart.forEach(cartProduct => {
          if (cartProduct.productId == offer.product_id) {
            offer['selectedQuantity'] = cartProduct['selectedQuantity'];
          }
        });
      }
      this.utilityService.productPriceToFloat(offer);
      offer["discountPercentage"] = parseFloat((((offer.display_price - offer.fixed_price) / offer.display_price) * 100).toFixed(2));
      offer["discount"] = Math.round(offer.discountPercentage);
    });
    return recentlyViewed;
  }
  trackByRecentFn(id, index) {
    return index;
  }
  trackByUtilFn(id, index) {
    return index;
  }
  trackByRecentVFn(id, index) {
    return index;
  }
  trackByUtilitySFn(id, index) {
    return index;
  }
  trackByRvFn(id, index) {
    return index;
  }
  trackByGenFakeFn(id, index) {
    return index;
  }
  ngOnDestroy() {
    if (!!this.cartSubscription) this.cartSubscription.unsubscribe();
  }

}
