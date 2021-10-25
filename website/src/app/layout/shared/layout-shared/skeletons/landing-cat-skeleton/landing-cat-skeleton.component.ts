import { StyleVariables } from './../../../../../core/theme/styleVariables.model';
import { AppSettings } from './../../../../../shared/models/appSettings.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-landing-cat-skeleton',
  templateUrl: './landing-cat-skeleton.component.html',
  styleUrls: ['./landing-cat-skeleton.component.scss']
})
export class LandingCatSkeletonComponent implements OnInit {

  @Input() settings: AppSettings;
  
  @Input()  style: StyleVariables;

  constructor() { }

  ngOnInit() {
  }

}