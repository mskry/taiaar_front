import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiUrl } from './../../../core/apiUrl';
import { HttpService } from './../../../services/http/http.service';
import { MessagingService } from './../../../services/messaging/messaging.service';
import { UtilityService } from './../../../services/utility/utility.service';
import { ValidationService } from './../../../services/validation/validation.service';
import { GlobalVariable } from '../../../core/global';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  emailForm: FormGroup;
  isSubmitted: boolean = false;
  site_name: string = GlobalVariable.SITE_NAME;

  constructor(
    private translate: TranslateService,
    private validation: ValidationService,
    private httpService: HttpService,
    private messageService: MessagingService,
    private fb: FormBuilder,
    private router: Router,
    private util: UtilityService

  ) { }


  ngOnInit() {
    this.emailForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(this.validation.email)]),
      subject: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      body: new FormControl('', [Validators.required, Validators.maxLength(1000)])
    })
  }

  onSend(): void {
    this.isSubmitted = true;
    if (this.emailForm.invalid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 300000);
      return;
    }

    this.httpService.postData(ApiUrl.sendEmail, {
      receiverEmail: GlobalVariable.EMAIL,
      senderEmail: this.emailForm.controls.email.value,
      subject: this.emailForm.controls.subject.value,
      content: this.emailForm.controls.body.value
    }).subscribe((response) => {
      if (response && response.status == 200) {
        // this.router.navigate(['']);
        // this.util.goToTop();
        this.messageService.toast('success', `${this.translate.instant('Email Sent Successfully')}`)
      }
    }, (err) => {
    })

  }
  get controls() { return this.emailForm.controls; }

}
