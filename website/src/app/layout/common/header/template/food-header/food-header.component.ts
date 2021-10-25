import { UtilityService } from './../../../../../services/utility/utility.service';
import { ThemeService } from './../../../../../services/theme/theme.service';
import { Router } from '@angular/router';
import { AppSettings } from './../../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../../core/theme/styleVariables.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalVariable } from 'src/app/core/global';

@Component({
  selector: 'app-food-header',
  templateUrl: './food-header.component.html',
  styleUrls: ['./food-header.component.scss']
})
export class FoodHeaderComponent implements OnInit {

  sidenav: 0 | 1 | 2 = 0;

  @Input() style: StyleVariables;
  @Input() showSearchbar: boolean = false;
  @Input() settings: AppSettings;
  @Input() loggedIn: boolean = false;
  @Input() openAuth: boolean = false;
  @Input() userData: any;
  @Input() fix_search: boolean = false;
  @Input() langInput: any;
  @Input() isNavigating: boolean = false;

  @Input() userWalletBalance: number = 0;

  @Output() authType: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchBar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() triggerAuthModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public whatsTrending: string = "What's Trending";
  currency: string = ''

  site_name: string = GlobalVariable.SITE_NAME;

  appLink: any = {};
  registrationUrl: string = ''

  constructor(
    public router: Router,
    private theme: ThemeService,
    private util: UtilityService
  ) { }

  ngOnInit() {
    this.appLink = {
      android: this.settings.android_app_url,
      ios: this.settings.ios_app_url,
      android_agent: this.settings.agent_android_app_url,
      ios_agent: this.settings.agent_ios_app_url
    }
    this.currency = GlobalVariable.CURRENCY;
    this.registrationUrl = `${GlobalVariable.admin_domain}/#!/supplier-registration`;
  }

  openAuthModal(type: string) {
    this.openAuth = true;
    this.triggerAuthModal.emit(true);
    this.authType.emit(type);
  }

  onLogo() {
    this.router.navigate(['']);
    this.util.goToTop();
  }


  navigate(url) {
    this.router.navigate([url]);
  }


}
