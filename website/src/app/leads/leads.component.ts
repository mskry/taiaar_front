import { AppSettings } from './../shared/models/appSettings.model';
import { UtilityService } from './../services/utility/utility.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, OnDestroy } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit, OnDestroy {

  settingsSubscription: Subscription;
  settings: AppSettings;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private util: UtilityService
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById("splash_screen").style.display = "none";
    }

    this.settingsSubscription = this.util.getSettings.subscribe((settings) => {
      this.settings = settings;
    });
  }

  ngOnDestroy() {
    if(!!this.settingsSubscription) this.settingsSubscription.unsubscribe();
  }

}
