import { GlobalVariable } from './../../../../../core/global';
import { CartPriceModel } from './../../../../../shared/models/cart-price.model';
import { StyleVariables } from './../../../../../core/theme/styleVariables.model';
import { QuestionsModel } from './../../../../../shared/models/questions.model';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  currency: string = '';

  showQuestion: boolean = false;


  @Input() questions: Array<QuestionsModel>;
  @Input() style: StyleVariables = new StyleVariables();
  @Input() cartPrice: CartPriceModel;

  constructor() { 
    this.currency = GlobalVariable.CURRENCY;
  }

  ngOnInit() {
  }
  trackByOptionsListFn(id, index) {
    return index;
  }
  trackByQuestionsFn(id, index) {
    return index;
  }
  getAnswers(options) {
    return options.map(o => o.optionLabel).toString();
  }

}
