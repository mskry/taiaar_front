import { LocalizationPipe } from './../../../../../shared/pipes/localization.pipe';
import { AppSettings } from './../../../../../shared/models/appSettings.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-supplier-cat-sorting',
    templateUrl: './supplier-cat-sorting.component.html',
    styleUrls: ['./supplier-cat-sorting.component.scss']
})
export class SupplierCatSortingComponent implements OnInit {

    selectedCatSorting: string = '';

    public catSortValue: number = 0;
    @Input() style: StyleVariables;
    @Input() settings: AppSettings;
    @Input('catShortValue')
    set setCatSortValue(catSortValue: number) {
        this.catSortValue = catSortValue;
    }
    @Input() showLabel: boolean = true;
    @Input() labelText: string = 'Category by';

    @Output() onCatSort: EventEmitter<number> = new EventEmitter<number>();

    public is_hide_delivery: boolean = false;
    public is_hide_pickup: boolean = false;
    public is_hide_dinin: boolean = false;

    public selected_order_type: number = 0;


    constructor(
        private localization: LocalizationPipe,
        private util: UtilityService
    ) { }

    ngOnInit() {
        this.setSelectedCatSorting();
        this.showHideOptions();
        if (this.settings.selected_template == 4) {
            this.getOrderType();
        }
    }

    showHideOptions() {
        if (this.settings.dynamic_order_type_client_wise) {
            if (!this.settings.dynamic_order_type_client_wise_delivery) {
                this.is_hide_delivery = true;
            }
            if (!this.settings.dynamic_order_type_client_wise_pickup) {
                this.is_hide_pickup = true;
            }
            if (!this.settings.dynamic_order_type_client_wise_dinein) {
                this.is_hide_dinin = true;
            }
            if (this.settings.dynamic_order_type_client_wise_delivery) {
                this.selectedCatSorting = "Delivery";
                return;
            }
            if (this.settings.dynamic_order_type_client_wise_pickup) {
                this.selectedCatSorting = "PICK UP";
                return;
            }
            if (this.settings.dynamic_order_type_client_wise_dinein) {
                this.selectedCatSorting = "DININ";
                return;
            }
        }
    }


    setSelectedCatSorting() {
        switch (this.catSortValue) {
            case 0:
                this.selectedCatSorting = 'Delivery';
                break;
            case 1:
                this.selectedCatSorting = `${this.localization.transform('selfpickup')}`;
                break;
            case 2:
                this.selectedCatSorting = 'Dining Table';
                break;
            default:
                this.selectedCatSorting = 'Delivery';
                break;

        }
    }

    onCatSortBy(value: number) {
        this.catSortValue = value;
        this.setSelectedCatSorting();
        this.onCatSort.emit(value);
    }


    getOrderType() {
        this.util.getOrderTypeData.subscribe((res: any) => {
            if (res) {
                this.selected_order_type = (Number)(res);
                this.onCatSortBy(this.selected_order_type);
            }
        })
    }


}
