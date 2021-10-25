import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrls: ['./payment-checkout.component.scss']
})
export class PaymentCheckoutComponent implements OnInit {

  isLoading: boolean = false;

  constructor(
    private util: UtilityService,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.isLoading = true;

    let params = {
      reference: this.route.snapshot.queryParams['requestId']
    }

    this.http.postData(ApiUrl.check_paynow_payment, params)
      .subscribe(response => {
        if (!!response && response.data) {
          if(response.data.status == 'paid') {
            this.router.navigate(['/success'], { queryParams: { referenceId: this.route.snapshot.queryParams['requestId'] } });
          } else if(response.data.status == 'cancelled') {
            this.router.navigate(['/cart/list']);
          }
        }
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });
  }


} 
