import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-see-more',
  templateUrl: './see-more.component.html',
  styleUrls: ['./see-more.component.scss']
})
export class SeeMoreComponent {
  @Input() text: string;
  @Input() max: number = 150;

  seeMore: boolean = false;

  constructor() { }

}
