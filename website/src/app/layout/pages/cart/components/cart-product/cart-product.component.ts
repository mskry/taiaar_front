import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone
} from "@angular/core";
import { StyleVariables } from "../../../../../core/theme/styleVariables.model";
import { AppSettings } from "../../../../../shared/models/appSettings.model";
import { UtilityService } from "../../../../../services/utility/utility.service";
import { GlobalVariable } from './../../../../../core/global';
import { MessagingService } from '../../../../../services/messaging/messaging.service';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from 'src/app/shared/models/apiKeys.model';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-cart-product",
  templateUrl: "./cart-product.component.html",
  styleUrls: ["./cart-product.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartProductComponent implements OnInit, OnChanges, OnDestroy {
  @Input() product: any;

  @Input() style: StyleVariables;

  @Input() settings: AppSettings;

  @Input() inSupplierPage: number = 0


  @Output() onPlus: EventEmitter<any> = new EventEmitter<any>();

  @Output() onMins: EventEmitter<any> = new EventEmitter<any>();

  @Output() remove: EventEmitter<any> = new EventEmitter<any>();

  @Output() onCustomizationUpdate: EventEmitter<any> = new EventEmitter<any>();

  timeInterval: number = 0;
  currency: string = "";

  public openImageViewer: boolean;
  public imageToView: string;

  utilSubscription: Subscription;
  public selected_currency: Currency = new Currency();

  public is_special_instruction: boolean = false;
  public special_instructions: string = '';

  public cartSubscription: Subscription;
  public cartItems: any = [];


  constructor(
    private router: Router,
    private util: UtilityService,
    private message: MessagingService,
    private translate: TranslateService,
    private ref: ChangeDetectorRef,
  ) {
    this.ref.detach();
    setInterval(() => { this.ref.detectChanges(); }, 2000);
  }

  ngOnInit(): void {
    this.currency = GlobalVariable.CURRENCY;
    if (this.settings.is_multicurrency_enable) {
      this.getCurrency();
    }
    this.getCartItems();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.settings.currentValue) {
      this.settings = changes.settings.currentValue;
      this.timeInterval = this.settings['interval'];
    }
  }


  onRemove(): void {
    this.remove.emit();
  }

  increaseQuantity(): void {
    if (this.settings.enable_item_purchase_limit) {
      if ((Number)(this.product.purchase_limit) > 0) {
        if (this.product.selectedQuantity >= (Number)(this.product.purchase_limit)) {
          this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
          return;
        }
      }
    }
    if (this.product.selectedQuantity >= this.product.quantity ||
      this.product.selectedQuantity * this.timeInterval >= this.product.maxHour) {
      this.message.alert('info', this.translate.instant('Maximum Limit Reached'));
      return;
    }
    this.onPlus.emit();
  }

  decreaseQuantity(): void {
    if (this.product.selectedQuantity == 0) { return; }
    this.onMins.emit();
  }

  updateQuantity(id, value, remove) {
    this.onCustomizationUpdate.emit({ id, value, remove });
  }

  addOnNames(values): string {
    return values.map((addon) => ` ${addon.type_name} * ${addon.is_default == '1' ? '1' : addon.adds_on_type_quantity}`).toString();
  }

  getAddonProductPrice(productPrice, addons: Array<any>): string {
    let amount = parseFloat(productPrice);
    if (!addons && !addons.length) { return amount.toFixed(this.settings.price_decimal_length); };
    addons.forEach(item => {
      // amount += item.value.reduce((a, { price }) => a + parseFloat(price), 0)
      item.value.forEach(element => {
        amount = amount + (Number(element.price) * Number(element.adds_on_type_quantity))
      });
    })
    return amount.toFixed(this.settings.price_decimal_length);
  }

  onSupplier(supplierId: string): void {
    if (this.settings.app_type == 1)
      this.router.navigate(['products', 'listing'], { queryParams: { supplierId: supplierId } });
  }

  productDetail(data: any) {
    if (this.settings.app_type != 1 || this.settings.product_detail == 1) {
      let obj = {
        productId: data.unitId || data.id,
        supplierBranchId: data.supplier_branch_id,
        category: data.categoryId
      };
      data.name = data.name.replace(/ &/g, "-");
      obj = { ...this.util.handler, ...obj };
      this.router.navigate(["/", "products", "product-detail", data.name], {
        queryParams: { f: this.util.encryptData(obj) }
      });
    }
  }


  downloadReceipt(image) {
    this.imageToView = image;
    this.openImageViewer = true;
  }

  closeImageViewer(event) {
    this.openImageViewer = event;
  }

  getCurrency() {
    this.utilSubscription = this.util.getSelectedCurrency.subscribe((res: any) => {
      if (res) {
        this.selected_currency = new Currency();
        this.selected_currency = res;
        if (this.selected_currency.currency_name) {
          this.currency = this.selected_currency.currency_name;
        }
      }
    })
  }


  showSpecialInstruction(item) {
    this.special_instructions = item.special_instructions || '';
    this.is_special_instruction = true;
  }

  validateTypeOf(product) {
    if((typeof (product.image_path))  === 'string') {
      return true
     } else return false
  }

  validateDiscontedItem(product) {
    return Number(product?.display_price) > Number(product?.fixed_price) ? true : false
  }

  getCartItems() {
    this.cartSubscription = this.util.getCart
      .subscribe(cart => {
        if (cart) {
          this.cartItems = cart;
        }
      })
    if (this.cartSubscription) { this.cartSubscription.unsubscribe() }
  }

  onProcessSpecialInstruction(event) {
    for (var i in this.cartItems) {
        if ((Number)(this.cartItems[i].productId) == this.product.productId) {
            this.cartItems[i]['special_instructions'] = event;
            break;
        }
    }
    this.util.setCart(this.cartItems);
    this.is_special_instruction = false;
  }


  ngOnDestroy(): void {
    if (this.utilSubscription) {
      this.utilSubscription.unsubscribe();
    }
  }

  trackByCartVariantsFn(id, index) {
    return index;
  }
  trackByProductFn(id, index) {
    return index;
  }
  trackByCustomizationFn(id, index) {
    return index;
  }
  trackByItemFn(id, index) {
    return index;
  }
}
