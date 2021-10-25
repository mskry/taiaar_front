import { Component, OnInit, Input } from '@angular/core';
import { GlobalVariable } from '../../../core/global';

@Component({
  selector: 'app-about-new',
  templateUrl: './about-us-new.component.html',
  styleUrls: ['./about-us-new.component.scss']
})
export class AboutUsNewComponent implements OnInit {

  
  site_name: string = GlobalVariable.SITE_NAME;

  constructor() {
    
   }

  ngOnInit() {
    
  }

}
