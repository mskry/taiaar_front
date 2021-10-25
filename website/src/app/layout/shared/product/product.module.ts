import { OutNetworkProductComponent } from './../layout-shared/components/out-network-product/out-network-product.component';
import { ProductListingComponent } from './../../pages/products/product-listing/product-listing.component';
import { BaseProduct } from './components/product/template/base-product.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './components/product/product.component';
import { ProductSkeletonComponent } from './components/product-skeleton/product-skeleton.component';
import { FoodComponent } from './components/product/template/food/food.component';
import { EcommerceComponent } from './components/product/template/ecommerce/ecommerce.component';
import { DescriptionComponent } from './components/description/description.component';
import { AddOnComponent } from './components/add-on/add-on.component';
import { LayoutSharedModule } from '../layout-shared/layout-shared.module';
import { HomeServiceComponent } from './components/product/template/home-service/home-service.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';

const components = [
  ProductComponent,
  ProductSkeletonComponent,
  FoodComponent,
  EcommerceComponent,
  DescriptionComponent,
  AddOnComponent,
  BaseProduct,
  OutNetworkProductComponent,
  ProductListingComponent
]

@NgModule({
  declarations: [
    ...components,
    HomeServiceComponent,
    ProductInfoComponent
  ],
  imports: [
    CommonModule,
    LayoutSharedModule
  ],
  exports: [
    ...components
  ],
  entryComponents: [
    DescriptionComponent,
    AddOnComponent
  ]
})
export class ProductModule { }
