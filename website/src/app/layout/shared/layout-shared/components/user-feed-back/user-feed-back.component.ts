import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ApiUrl } from '../../../../../core/apiUrl';
import { MessagingService } from '../../../../../services/messaging/messaging.service';
import { HttpService } from '../../../../../services/http/http.service';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { AppSettings } from '../../../../../shared/models/appSettings.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilityService } from '../../../../../services/utility/utility.service';
import { UserService } from '../../../../../services/user/user.service';
declare const $;

@Component({
    selector: 'app-user-feed-back',
    templateUrl: './user-feed-back.component.html',
    styleUrls: ['./user-feed-back.component.scss']
})
export class UserFeedBackComponent implements OnInit {
    supplierTables: Array<any> = [];
    selectedTable: any;

    public dataLoaded: boolean;

    form: FormGroup;
    showError: boolean = false;
    suggestions: Array<any> = [];
    isLoading: boolean = false;

    @Input() style: StyleVariables;
    @Input() settings: AppSettings;

    @Output() onUserFeedbackClose: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        private http: HttpService,
        private message: MessagingService,
        private util: UtilityService,
        private userService: UserService
    ) {
    }

    ngOnInit() {
        this.makeForm();
        this.getSuggestions();
    }
    ngOnChanges() {
        $("#feedbackModal").modal('show');
    }


    getSuggestions() {
        let params = {
            offset: 0,
            limit: 100
        }
        this.http.getData(ApiUrl.getSuggestions, params)
            .subscribe(response => {
                if (!!response && response.data) {
                    this.suggestions = response.data.data;
                    this.suggestions.forEach(el => {
                        el['checked'] = false;
                    });
                }
            });
    }

    selectSuggestion(suggestion) {
        suggestion['checked'] = !suggestion['checked'];
    }

    makeForm() {
        this.form = this.fb.group({
            'name': ['', Validators.compose([Validators.required])],
            'phone': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
            'description': [''],
            'new_suggestions': [''],
            'email_id': ['', Validators.compose([Validators.required, Validators.email])],
        });
    }

    onSubmit(value) {
        if (this.form.valid) {
            this.isLoading = true;
            let selectedSuggestions = [];
            this.suggestions.forEach(el => {
                if (el.checked) {
                    selectedSuggestions.push(el.name);
                }
            });
            this.suggestions
            let formData = {
                name: value.name,
                phone: value.phone,
                description: value.description,
                new_suggestions: value.new_suggestions,
                email_id: value.email_id,
                suggestions_assigned: selectedSuggestions.length ? selectedSuggestions.join(',') : '',
                from_user_id: this.userService.currentUserValue ? this.userService.currentUserValue.id : '',
                from_user_type: 'USER'
            }
            this.showError = true;
            this.http.postData(ApiUrl.submitFeedback, formData)
                .subscribe(response => {
                    this.isLoading = false;
                    if (!!response && response.data) {
                        this.message.toast('success', `Feedback Submitted`);
                        this.form.reset();
                        this.suggestions.forEach(el => {
                            el['checked'] = false;
                        });
                        this.showError = false;
                        this.onDismiss();
                    }
                }, error => { this.isLoading = false });

        }
    }


    trackBySuggestionsFn(id, index) {
        return index;
    }

    onDismiss() {
        $("#feedbackModal").modal('hide');
        this.onUserFeedbackClose.emit(false);
    }

}