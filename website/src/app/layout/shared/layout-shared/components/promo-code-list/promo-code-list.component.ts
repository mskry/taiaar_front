import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ApiUrl } from '../../../../../core/apiUrl';
import { MessagingService } from '../../../../../services/messaging/messaging.service';
import { HttpService } from '../../../../../services/http/http.service';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { AppSettings } from '../../../../../shared/models/appSettings.model';
import { PaginationModel } from "./../../../../../shared/models/pagination.model";


declare const $;

@Component({
    selector: 'app-promo-code-list',
    templateUrl: './promo-code-list.component.html',
    styleUrls: ['../supplier-tables/supplier-tables.component.scss']
})
export class PromoCodeListComponent implements OnInit {
    listData: Array<any> = [];
    selectedItem: any;

    public dataLoaded: boolean;

    @Input() style: StyleVariables;
    @Input() settings: AppSettings;
    @Input() dialogData: any = {};
    @Input() hideBtns: boolean = false;


    @Output() onItemSelect: EventEmitter<any> = new EventEmitter<any>();

    pagination: PaginationModel;

    public promoCodeRequest_params: {} = {};

    hover: any = {
        index: -1,
        tab: null
    };

    constructor(
        private message: MessagingService,
        private http: HttpService
    ) {
        this.pagination = new PaginationModel();
    }

    ngOnInit() {
        this.getItemList();
    }

    ngOnChanges() {
        $("#listModal").modal('show');
    }

    getItemList() {
        this.dialogData = this.dialogData.slice(0, -1);
        this.promoCodeRequest_params['supplierIds'] = this.dialogData;
        this.promoCodeRequest_params['limit'] = this.pagination.perPage;
        this.promoCodeRequest_params['skip'] = this.pagination.offset;
        this.http.getData(ApiUrl.getPromoCodeList, this.promoCodeRequest_params).subscribe((response: any) => {
            if (!!response && response.data) {
                this.dataLoaded = true;
                this.listData = response.data.list;
                this.pagination.count = response.data.count
            }
        })
    }

    selectItem(item: any) {
        this.selectedItem = item;
    }

    proceedWithItem(withItem: boolean) {
        if (!this.selectedItem && withItem) {
            this.message.toast('info', 'Please select promo code');
        } else {
            if (withItem) {
                $("#listModal").modal('hide');
                this.onItemSelect.emit(this.selectedItem);
            }
            else {
                $("#listModal").modal('hide');
                this.onItemSelect.emit(false);
            }
        }
    }

    trackByListDataFn(id, index) {
        return index;
    }

    onDismiss() {
        $("#listModal").modal('hide');
        this.onItemSelect.emit(false);
    }

}