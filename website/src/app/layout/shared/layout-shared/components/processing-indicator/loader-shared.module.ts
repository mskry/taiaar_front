import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProcessingIndicatorComponent } from './loader/processing-indicator.component';
import { NativeLoaderComponent } from './native-loader/native-loader.component';



const components = [
  ProcessingIndicatorComponent,
  NativeLoaderComponent
]

@NgModule({
  declarations: [
    ...components,

  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    ...components
  ]
})
export class LoaderSharedModule { }
