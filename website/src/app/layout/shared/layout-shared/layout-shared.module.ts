import { SeeMoreComponent } from './components/see-more/see-more.component';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { InnerHtmlSizeLimit } from './pipes/inner-html-size-limit.pipe';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { RestrictSpaceDirective } from './directives/restrict-space.directive';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { SideBarComponent } from './../../side-bar/side-bar.component';
import { LocationComponent } from './../../common/header/location/location.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HomeServiceCategoriesComponent } from '../home/components/home-service-categories/home-service-categories.component';
import { MultimediaViewerComponent } from './components/multimedia-viewer/multimedia-viewer.component';
import { EmailComponent } from './components/email/email.component';
import { PrescriptionUploadComponent } from './components/prescription-upload/prescription-upload.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { SortingComponent } from './components/sorting/sorting.component';
import { SearchComponent } from '../../common/header/search/search.component';
import { SidebarModule } from 'primeng/sidebar';
import { SupplierCategorySidebarComponent } from './components/supplier-category-sidebar/supplier-category-sidebar.component';;
import { EcomCategoriesComponent } from '../ecom-categories/ecom-categories.component';
import { SupplierSortingComponent } from './components/supplier-sorting/supplier-sorting.component';
import { SupplierCatSortingComponent } from './components/supplier-cat-sorting/supplier-cat-sorting.component';
import { TableDateTimePipe } from './pipes/table-datetime.pipe';
import { CreatePostComponent } from './components/social-ecommerce/create-post/create-post.component';
import { EcommercePostComponent } from './components/social-ecommerce/ecommerce-posts/ecommerce-posts.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { FollowSectionComponent } from './components/social-ecommerce/follow-section/follow-section.component';
import { ProfileOverViewComponent } from './components/social-ecommerce/profile-overview/profile-overview.component';
import { ReportPostComponent } from './components/social-ecommerce/report-post/report-post.component';
import { PostLikesComponent } from './components/social-ecommerce/post-likes/post-likes.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TimeSincePipe } from './pipes/time-since.pipe';
import { SmFeedbackFormComponent } from './components/sm-feedback-form/sm-feedback-form.component';
import { CartSharedModule } from './cart-shared/cart-shared.module';
import { RatingModule } from 'primeng/rating';
import { CompareProductsComponent } from './components/compare-products/compare-products.component';
import { UserFeedBackComponent } from './components/user-feed-back/user-feed-back.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ProductAllergyComponent } from './components/product-allergy/product-allergy.component';
import { RatingReviewsComponent } from './components/rating-reviews/rating-reviews.component';
import { SupplierPriceSortingComponent } from './components/supplier-price-sorting/supplier-price-sorting.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SkeletonModule } from './skeletons/skeleton.module';
import { LoaderSharedModule } from './components/processing-indicator/loader-shared.module';


const directives = [
  AutoFocusDirective,
  RestrictSpaceDirective
]

const pipes = [
  FormatTimePipe,
  InnerHtmlSizeLimit,
  TableDateTimePipe,
  TimeSincePipe
]

const components = [
  HomeServiceCategoriesComponent,
  MultimediaViewerComponent,
  EmailComponent,
  PrescriptionUploadComponent,
  QuestionsComponent,
  SortingComponent,
  SideBarComponent,
  SupplierCategorySidebarComponent,
  LocationComponent,
  SearchComponent,
  SeeMoreComponent,
  EcomCategoriesComponent,
  SupplierSortingComponent,
  SupplierCatSortingComponent,
  CreatePostComponent,
  EcommercePostComponent,
  FollowSectionComponent,
  ProfileOverViewComponent,
  ReportPostComponent,
  PostLikesComponent,
  SmFeedbackFormComponent,
  CompareProductsComponent,
  UserFeedBackComponent,
  ProductAllergyComponent,
  RatingReviewsComponent,
  SupplierPriceSortingComponent,
]

@NgModule({
  declarations: [
    ...components,
    ...pipes,
    ...directives
  ],
  imports: [
    RatingModule,
    SidebarModule,
    PickerModule,
    AutoCompleteModule,
    MultiSelectModule,
    DropdownModule,
    KeyFilterModule,
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    SlickCarouselModule,
    CartSharedModule,
    NgxSliderModule,
    SkeletonModule,
    LoaderSharedModule
  ],
  exports: [
    RatingModule,
    SidebarModule,
    AutoCompleteModule,
    CartSharedModule,
    SkeletonModule,
    KeyFilterModule,
    LoaderSharedModule,
    ...components,
    ...pipes,
    ...directives
  ],

  entryComponents: [
    QuestionsComponent,
    EmailComponent,
    MultimediaViewerComponent,
    PrescriptionUploadComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutSharedModule { }
