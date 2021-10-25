/**************** MODULE **************/
import { SharedModule } from './../../shared/shared.module';
import { SupplierModule } from './../shared/supplier/supplier.module';
import { ProductModule } from './../shared/product/product.module';
import { HomeModule } from './../shared/home/home.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**************** COMPONENT **************/
import { FoodHomeComponent } from './food-home/food-home.component';
import { FoodListingComponent } from './food-listing/food-listing.component';
import { FoodSpecialOffersComponent } from './templates/food-special-offers/food-special-offers.component';
import { FoodRecommendedSuppliersComponent } from './templates/food-recommended-suppliers/food-recommended-suppliers.component';
import { FoodSuppliersComponent } from './templates/food-suppliers/food-suppliers.component';
import { FoodBannerComponent } from './templates/food-banner/food-banner.component';
import { LayoutSharedModule } from '../shared/layout-shared/layout-shared.module';
import { FoodHomeOptionsComponent } from './templates/food-home-options/food-home-options.component';
import { FoodFastDeliveryComponent } from './templates/food-fast-delivery/food-fast-delivery.component';
import { RecommendedFoodComponent } from './templates/recommended-food/recommended-food.component';
import { FoodBestSellerComponent } from './templates/food-best-seller/food-best-seller.component';
import { FoodTopSellingDishesComponent } from './templates/food-top-selling-dishes/food-top-selling-dishes.component';
import { FoodHighestRatingRestaurantComponent } from './templates/food-highest-rating-restaurant/food-highest-rating-restaurant.component';
import { FoodNewRestaurantComponent } from './templates/food-new-restaurant/food-new-restaurant.component';
import { FoodCatWiseVendorComponent } from "./templates/food-category-wise-vendor/food-category-wise-vendor.component";
import { FoodRecommendedSuppliersMCComponent } from './templates/food-recommneded-supplier-mc/food-recommneded-supplier-mc.component';
import { FoodRecentOrderComponent } from './templates/food-recent-order/food-recent-order.component';
import { FoodOrderComponent } from '../shared/supplier/components/supplier/templates/food-order/food-order.component';
import { DialogSharedModule } from '../shared/layout-shared/dialog-shared/dialog-shared.module';
import { CartModule } from '../pages/cart/cart.module';

const components = [
  FoodHomeComponent,
  FoodListingComponent,
  FoodSpecialOffersComponent,
  FoodRecommendedSuppliersComponent,
  FoodSuppliersComponent,
  FoodBannerComponent,
  FoodFastDeliveryComponent,
  RecommendedFoodComponent,
  FoodBestSellerComponent,
  FoodTopSellingDishesComponent,
  FoodHighestRatingRestaurantComponent,
  FoodNewRestaurantComponent,
  FoodCatWiseVendorComponent,
  FoodRecommendedSuppliersMCComponent,
  FoodRecentOrderComponent,
  FoodOrderComponent
]

@NgModule({
  declarations: [
    ...components,
    FoodHomeOptionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutSharedModule,
    HomeModule,
    ProductModule,
    SupplierModule,
    DialogSharedModule,
    CartModule

  ], exports: [
    ...components
  ]
})
export class FoodModule { }
