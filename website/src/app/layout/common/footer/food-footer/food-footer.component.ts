import { WINDOW } from './../../../../services/window/window.service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { UtilityService } from './../../../../services/utility/utility.service';
import { GlobalVariable } from './../../../../core/global';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { EmailComponent } from './../../../../layout/shared/layout-shared/components/email/email.component';

@Component({
  selector: 'app-food-footer',
  templateUrl: './food-footer.component.html',
  styleUrls: ['./food-footer.component.scss']
})
export class FoodFooterComponent implements OnInit {

  @Input() settings: AppSettings;
  @Input() style: StyleVariables;
  siteName: string = '';
  registrationUrl: string = '';
  image_paths: string = '';
  is_new_badge: boolean = false;

  client_code: string = GlobalVariable.UNIQUE_ID;

  public showUserFeedback: boolean;
  terms: string;

  contact: {
    phoneNumber: string,
    email: string,
    country: string,
    whatsAppNumber: string
  };

  appLink: {
    android: string,
    ios: string;
    android_agent: string,
    ios_agent: string;
  }

  constructor(
    public util: UtilityService,
    public dialogService: DialogService,
    public router: Router,
    @Inject(WINDOW) private window: Window
  ) {

    this.siteName = GlobalVariable.SITE_NAME;
    this.registrationUrl = `${GlobalVariable.supplier_domain}/#!/supplier-registration`;

    this.contact = {
      phoneNumber: (GlobalVariable.PHONE_NUMBER).startsWith('+') ? GlobalVariable.PHONE_NUMBER : (`${(GlobalVariable.COUNTRY_CODE).startsWith('+') ? '' : '+'}${GlobalVariable.COUNTRY_CODE} ${GlobalVariable.PHONE_NUMBER}`),
      email: GlobalVariable.EMAIL,
      country: GlobalVariable.COUNTRY,
      whatsAppNumber: ''
    }
    this.contact['whatsAppNumber'] = GlobalVariable.WHATSAPP_NUMBER ? (`${(GlobalVariable.WHATSAPP_NUMBER_CODE).startsWith('+') ? '' : '+'}${GlobalVariable.WHATSAPP_NUMBER_CODE} ${GlobalVariable.WHATSAPP_NUMBER}`) : '';

    this.style = new StyleVariables();

    if (GlobalVariable.SECRET_DB_KEY === 'd1fda7d1a7680267aaefb8d6c8c320b5') {
      this.is_new_badge = true;
    }
  }

  ngOnInit() {
    this.image_paths = this.settings.site_logo;
    this.appLink = {
      android: this.settings.android_app_url,
      ios: this.settings.ios_app_url,
      android_agent: this.settings.agent_android_app_url,
      ios_agent: this.settings.agent_ios_app_url
    }

  }

  onEmail() {
    this.window.location.href = `mailto:${this.contact.email}`;
  }

  onPhone() {
    this.window.location.href = `tel:${this.contact.phoneNumber}`;
  }

  onHelp() {
    const dialogRef = this.dialogService.open(EmailComponent, {
      width: '50%',
      style: { 'background-color': `${this.style.primaryColor} !important` },
      showHeader: false,
      transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
    })

    dialogRef.onClose.subscribe(() => {
    })
  }

  openUserFeedBack() {
    this.showUserFeedback = true;
  }

  onUserFeedbackClose(event) {
    this.showUserFeedback = event;
  }

  onWhatsApp() {
    window.open(`https://api.whatsapp.com/send?phone=${this.contact.whatsAppNumber}`, '_blank');
  }
}
