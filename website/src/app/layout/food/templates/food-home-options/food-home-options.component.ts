import { Router } from '@angular/router';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../shared/models/appSettings.model';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { GlobalVariable } from './../../../../core/global';


@Component({
  selector: 'app-food-home-options',
  templateUrl: './food-home-options.component.html',
  styleUrls: ['./food-home-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodHomeOptionsComponent implements OnInit {
  siteName: string = '';

  @Input('settings')
  set settingsData(settings: AppSettings) {
    this.settings = settings;
    if (this.settings.is_flavor_of_week_enable) {
      this.flavorOfTheWeek = JSON.parse(this.settings.flavor_of_week);
    }
  }
  @Input() style: StyleVariables;

  public settings: AppSettings;
  public flavorOfTheWeek: any;


  constructor(
    private router: Router
  ) {    this.siteName = GlobalVariable.SITE_NAME;
  }

  ngOnInit() {
  }

  navigate(type) {
    switch (type) {
      case 0:
        this.router.navigate(['flavor-of-the-week']);
        break;
      case 1:
        this.router.navigate(['vendor-registration']);
        break;
      case 2:
        this.router.navigate(['agent-registration']);
        break;
      case 3:
        this.router.navigate(['group-ordering']);
        break;
      case 4:
        this.router.navigate(['catering']);
        break;
    }
  }

}
