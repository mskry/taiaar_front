import { Component, Output, EventEmitter, Input } from '@angular/core';
import { GlobalVariable } from '../../../core/global';
import { StyleVariables } from '../../../core/theme/styleVariables.model';
import { MessagingService } from '../../../services/messaging/messaging.service';


@Component({
    selector: 'app-declaration-form',
    templateUrl: './declaration-form.component.html',
    styleUrls: ['./declaration-form.component.scss']
})
export class DeclarationFormComponent {

    @Output() onCheckDeclaration = new EventEmitter<boolean>();
    @Output() onClose = new EventEmitter<boolean>();

    @Input() style: StyleVariables;

    public is_declaration_checked: boolean;

    website_name: string = GlobalVariable.SITE_NAME;

    is_mobile: boolean = GlobalVariable.IS_MOBILE;

    constructor(
        private message: MessagingService,
    ) { }


    onSubmit() {
        if (!this.is_declaration_checked) {
            this.message.toast('error', 'Please check to agree the COVID-19 declaration!');
            return;
        }
        this.onCheckDeclaration.emit(this.is_declaration_checked);
    }


    close() {
        this.onClose.emit(false);
    }
} 