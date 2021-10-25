import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { UtilityService } from '../../../../../services/utility/utility.service';
import { PaymentBaseComponent } from '../payment-base.component';

@Component({
  selector: 'app-safe2pay-gateway',
  templateUrl: './safe2pay-gateway.component.html',
  styleUrls: ['./safe2pay-gateway.component.scss']
})
export class Safe2payGatewayComponent extends PaymentBaseComponent implements OnInit, OnDestroy {

  showAddCard: boolean = false;

  paymentForm: FormGroup;
  submitted: boolean = false;
  style: StyleVariables;

  styleSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private utilService: UtilityService) {
    super();
    this.style = new StyleVariables();
  }

  ngOnInit() {
    this.makeSubscription();
    
    this.createPaymentForm();
  }

  makeSubscription() {
    this.styleSubscription = this.utilService.getStyles.subscribe((style: StyleVariables) => {
      this.style = style;
    })
  }

  createPaymentForm() {
    this.paymentForm = this.formBuilder.group({
      card_holder_name: ['', [Validators.required]],
      exp_year: ['', [Validators.required, Validators.minLength(4)]],
      exp_month: ['', [Validators.required]],
      cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      card_number: ['', [Validators.required, Validators.minLength(14)]]
    })
  }

  addCard() {

    if (this.paymentForm.invalid) {
      this.submitted = true;
      setTimeout(() => {
        this.submitted = false;
      }, 1000 * 60 * 10);
      return;
    }

    console.log(this.paymentForm.value);

    let obj = {...this.paymentForm.value};
    obj.paymentGatewayId = 'safe2pay';
    
    this.onSuccess.emit({card_details: obj });

  }

  onCardSelect($event) {
    console.log($event);
    
    this.onSuccess.emit($event);
  }

  ngOnDestroy(): void {
  }

}
