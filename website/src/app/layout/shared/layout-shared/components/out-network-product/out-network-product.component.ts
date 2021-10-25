import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { MessagingService } from '../../../../../services/messaging/messaging.service';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { AppSettings } from '../../../../../shared/models/appSettings.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/validation/validation.service';


declare const $;

@Component({
    selector: 'app-out-network-product',
    templateUrl: './out-network-product.component.html',
    styleUrls: ['../supplier-tables/supplier-tables.component.scss']
})
export class OutNetworkProductComponent implements OnInit {


    public showError: boolean;

    @Input() style: StyleVariables;
    @Input() settings: AppSettings;
    @Input('currentUser')
    set setCurrentUser(user) {
        if (user) {
            this.currentUser = user;
        }
    }

    @Output() onProcess: EventEmitter<any> = new EventEmitter<any>();

    form: FormGroup;
    currentUser: any;
    images: [] = [];


    constructor(
        private message: MessagingService,
        private fb: FormBuilder,
        private validator: ValidationService

    ) {

    }

    ngOnInit() {
        this.makeForm();
    }

    ngOnChanges() {
        $("#modalRef").modal('show');
    }


    makeForm() {
        this.form = this.fb.group({
            'product_owner_name': ['', Validators.compose([Validators.required, this.validator.noWhitespaceValidator])],
            'product_upload_reciept': ['', Validators.compose([Validators.required])],
            'product_dimensions': ['', Validators.compose([Validators.required, this.validator.noWhitespaceValidator])],
        });

    }



    onImageUpload(event) {
        this.form.patchValue({
            product_upload_reciept: event.images[0]
        })
    }

    handleImageProcess(event) {

    }



    onSubmit(form) {
        if (this.form.invalid) {
            this.showError = true;
            setTimeout(() => {
                this.showError = false;
            }, 300000);
            return;
        }
        var obj = this.form.value;
        obj['product_reference_id'] = Math.floor(100000 + Math.random() * 900000);
        this.onProcess.emit(obj);
        $("#modalRef").modal('hide');
    }

    onDismiss() {
        $("#modalRef").modal('hide');
        this.onProcess.emit(false);
    }

}