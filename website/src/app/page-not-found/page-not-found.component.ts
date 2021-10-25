import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { AppLoadService } from './../services/app-load/app-load.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Optional, Inject, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { AppSettings } from '../shared/models/appSettings.model';
import { UtilityService } from '../services/utility/utility.service';
import { RESPONSE } from '@nguniversal/express-engine/tokens';

@Component({
  selector: "app-page-not-found",
  templateUrl: "./page-not-found.component.html",
  styleUrls: ["./page-not-found.component.scss"]
})
export class PageNotFoundComponent implements OnInit, OnDestroy {

  settings: AppSettings;
  settingsSubscription: Subscription;
  settingsLoaded: boolean = false;
  public site_logo: string = '/assets/images/emoji.png';

  constructor(
    public router: Router,
    private appInitService: AppLoadService,
    private util: UtilityService,
    @Optional() @Inject(RESPONSE) private response: any,
    @Inject(PLATFORM_ID) private platformId: any) {

    if (isPlatformBrowser(this.platformId)) {
      document.getElementById("splash_screen").style.display = "none";
    }
  }

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      this.response.status(404);
      this.response.statusMessage = '404 - Page Not Found';
    }

    if (this.util.getLocalData('site_logo')) {
      this.site_logo = this.util.getLocalData('site_logo');
    }

    this.settingsSubscription = this.util.getSettings
      .subscribe(settings => {
        this.settingsLoaded = !!settings;
      });
  }

  toHome() {
    if (this.settingsLoaded) {
      this.router.navigate(['']);
    } else {
      this.appInitService.init().then(
        (val) => {
          console.log('welcome')
          this.router.navigate(['']);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  ngOnDestroy() {
    if (!!this.settingsSubscription) this.settingsSubscription.unsubscribe();
  }
}
