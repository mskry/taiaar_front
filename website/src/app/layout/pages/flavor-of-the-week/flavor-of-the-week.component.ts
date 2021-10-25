import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { AppSettings } from 'src/app/shared/models/appSettings.model';

@Component({
  selector: 'app-flavor-of-the-week',
  templateUrl: './flavor-of-the-week.component.html',
  styleUrls: ['./flavor-of-the-week.component.scss']
})
export class FlavorOfTheWeekComponent implements OnInit {

  settingSubscription: Subscription;
  settings: AppSettings;

  public flavorOfTheWeek: any = {};


  constructor(private util: UtilityService) { }

  ngOnInit() {
    this.getSettings();
  }


  getSettings() {
    this.settingSubscription = this.util.getSettings.subscribe((settings: AppSettings) => {
      if (!!settings) {
        this.settings = settings;
        this.flavorOfTheWeek = JSON.parse(this.settings.flavor_of_week);
      }
    });
  }

}
