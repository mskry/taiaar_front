import { CartInitService } from './cart-init.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CartInitComponent } from './cart-init.component';



@NgModule({
  declarations: [CartInitComponent],
  imports: [
  ],
  exports: [CartInitComponent]
})
export class CartInitModule {

  public static forRoot(environment: any): ModuleWithProviders {

    return {
      ngModule: CartInitModule,
      providers: [
        CartInitService,
        {
          provide: 'environment',
          useValue: environment
        }
      ]
    };
  }
  
 }
