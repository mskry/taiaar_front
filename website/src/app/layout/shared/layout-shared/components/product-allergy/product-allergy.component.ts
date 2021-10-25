import { Component, OnInit, OnDestroy, Inject, Output, EventEmitter, Input } from '@angular/core';
import { UtilityService } from '../../../../../services/utility/utility.service';
import { DOCUMENT } from "@angular/common";
import { AppSettings } from '../../../../../shared/models/appSettings.model';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';

@Component({
    selector: 'app-product-allergy',
    templateUrl: './product-allergy.component.html',
    styleUrls: ['./product-allergy.component.scss']
})
export class ProductAllergyComponent implements OnInit, OnDestroy {

    @Input() style: StyleVariables;
    @Input() settings: AppSettings;
    @Input() allergy: string = '';

    @Output() onClose = new EventEmitter<boolean>();

    constructor(
        private util: UtilityService,
        @Inject(DOCUMENT) private document,

    ) {

    }

    ngOnInit() {

    }
 

    close() {
        this.onClose.emit(false);
    }


    ngOnDestroy(): void {

    }
}