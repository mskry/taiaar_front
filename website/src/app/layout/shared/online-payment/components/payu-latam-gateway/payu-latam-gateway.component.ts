import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StyleVariables } from 'src/app/core/theme/styleVariables.model';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { PaymentBaseComponent } from '../payment-base.component';

@Component({
  selector: 'app-payu-latam-gateway',
  templateUrl: './payu-latam-gateway.component.html',
})

export class PayuLatamGatewayComponent extends PaymentBaseComponent implements OnInit, OnDestroy {

  style: StyleVariables;
  showAddCard = false;

  styleSubscription: Subscription;

  constructor(
    private utilService: UtilityService
  ) {
    super();
    this.style = new StyleVariables();
  }

  ngOnInit() {
    this.makeSubscription();
  }

  makeSubscription() {
    this.styleSubscription = this.utilService.getStyles.subscribe((style: StyleVariables) => {
      this.style = style;
      this.showAddCard = true;
    });
  }

  onCardSelect($event) {
    this.onSuccess.emit($event);
  }

  ngOnDestroy(): void {
    if (this.styleSubscription) this.styleSubscription.unsubscribe();
  }
}
