import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { StyleVariables } from 'src/app/core/theme/styleVariables.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-compare-products',
    templateUrl: './compare-products.component.html',
    styleUrls: ['./compare-products.component.scss']
})
export class CompareProductsComponent implements OnInit, OnDestroy {

    @Input('products')
    set compareProductList(products) {
        if (products) {
            this.products = Object.assign([], products);
            this.products.forEach(element => {
                if (typeof element.image_path != "string") {
                    element.image_path = element.image_path[0];
                }
            });
        }
    }

    @Input() style: StyleVariables;
    @Output() onAddCart: EventEmitter<any> = new EventEmitter<any>();

    public products: any[] = [];
    public compareByList: any[] = ['Image', 'Product Name', 'Price', 'Sold By', 'Category', 'Specifications'];

    constructor(
        private translate: TranslateService,
    ) {

    }
    ngOnInit() {

    }
    trackByCompareByListFn(id, index) {
        return index;
    }
    trackByProductsFn(id, index) {
        return index;
    }
    addToCart(prod) {
        this.onAddCart.emit(prod);
    }
    ngOnDestroy() {

    }
}