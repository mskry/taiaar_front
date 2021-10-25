import { Component, OnInit, OnDestroy, Inject, Output, EventEmitter, Input } from '@angular/core';
import { UtilityService } from '../../../../../services/utility/utility.service';
import { DOCUMENT } from "@angular/common";
import { AppSettings } from '../../../../../shared/models/appSettings.model';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';

@Component({
    selector: 'app-special-instruction',
    templateUrl: './special-instruction.component.html',
    styleUrls: ['./special-instruction.component.scss']
})
export class SpecialInstructionComponent implements OnInit, OnDestroy {

    @Input() style: StyleVariables;
    @Input() settings: AppSettings;
    @Input() special_instructions: string = '';
    @Input() only_viewing: boolean = false;

    @Output() onProcess = new EventEmitter<string>();

    constructor(
        private util: UtilityService,
        @Inject(DOCUMENT) private document,

    ) {

    }

    ngOnInit() {

    }


    close(is_saving) {
        this.onProcess.emit(this.special_instructions);
    }



    ngOnDestroy(): void {

    }
}