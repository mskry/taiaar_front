import { TimePipe } from './../pipes/time.pipe';
import { ChatComponent } from './../components/chat/chat.component';
import { InputMaxLengthDirective } from './../directives/input-max-length.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormatTimeIntervalPipe } from './../pipes/format-time-interval.pipe';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { UploadImageComponent } from '../components/social-ecommerce/upload-images/upload-image.component';
import { TableDetailsComponent } from '../components/table-details/table-details.component';
import { SupplierTablesComponent } from '../components/supplier-tables/supplier-tables.component';
import { CartScheduleTimeComponent } from '../components/cart-schedule-time/cart-schedule-time.component';
import { QuantityButtonsComponent } from '../components/quantity-buttons/quantity-buttons.component';
import { CartDateTimeComponent } from '../components/cart-date-time/cart-date-time.component';
import { QuestionsListComponent } from '../components/questions-list/questions-list.component';
import { ToastComponent } from '../components/toast/toast.component';
import { NumberDirective } from '../directives/number.directive';
import { AmountDirective } from '../directives/amount.directive';
import { CounterDirective } from '../directives/counter.directive';
import { NgModule } from '@angular/core';
import { PromoCodeListComponent } from '../components/promo-code-list/promo-code-list.component';
import { OffsetDateTimePipe } from '../pipes/offset-date.pipe';
import { DeclarationFormComponent } from '../../../../layout/authorization/declaration-form/declaration-form.component';
import { ImageViewerComponent } from '../components/social-ecommerce/image-viewer/image-viewer.component';
import { OnlinePaymentModule } from '../../online-payment/online-payment.module';
import { LoaderSharedModule } from '../components/processing-indicator/loader-shared.module';
import { DialogSharedModule } from '../dialog-shared/dialog-shared.module';



const directives = [
  CounterDirective,
  AmountDirective,
  NumberDirective,
  InputMaxLengthDirective
]

const pipes = [
  FormatTimeIntervalPipe,
  OffsetDateTimePipe,
  TimePipe,
]

const components = [
  ToastComponent,
  ChatComponent,
  QuestionsListComponent,
  CartDateTimeComponent,
  QuantityButtonsComponent,
  CartScheduleTimeComponent,
  SupplierTablesComponent,
  TableDetailsComponent,
  UploadImageComponent,
  PromoCodeListComponent,
  DeclarationFormComponent,
  ImageViewerComponent,
]

@NgModule({
  declarations: [
    ...components,
    ...pipes,
    ...directives
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CalendarModule,
    DynamicDialogModule,
    DialogModule,
    ToastModule,
    RouterModule,
    NgxPaginationModule,
    OnlinePaymentModule,
    LoaderSharedModule,

    DialogSharedModule
    
  ],
  exports: [
    RouterModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    DialogModule,
    NgxPaginationModule,
    OnlinePaymentModule,
    LoaderSharedModule,
    DialogSharedModule,
    ...components,
    ...pipes,
    ...directives
  ],
  entryComponents: [
    ToastComponent
  ],
  providers: [
    DynamicDialogRef,
    DynamicDialogConfig
  ]
})
export class CartSharedModule { }
