import { UserService } from './../../../../../services/user/user.service';
import { StyleVariables } from './../../../../../core/theme/styleVariables.model';
import { ApiUrl } from './../../../../../core/apiUrl';
import { HttpService } from './../../../../../services/http/http.service';
import { MessagingService } from './../../../../../services/messaging/messaging.service';
import { UtilityService } from './../../../../../services/utility/utility.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

declare const OpenPay: any;
@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  @Input('gatewayId')
  set btnTxt(gatewayId) {
    this.gatewayId = gatewayId;
    if (gatewayId == 'pago_facil') {
      this.btnText = 'Process';
    }
    else {
      this.btnText = 'Save';
    }
  }


  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAddCard: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  isLoading: boolean = false;
  submitted: boolean = false;
  showAddCard: boolean = false;
  btnText: string = "Save";
  gatewayId: string = "";

  cards: Array<any> = [];
  cardId: string = '';

  style: StyleVariables;
  user: any;

  styleSubscription: Subscription;
  userSubscription: Subscription;

  public isNativeLoading: boolean = false;

  constructor(private util: UtilityService,
    private formBuilder: FormBuilder,
    private message: MessagingService,
    private http: HttpService,
    private userService: UserService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.style = new StyleVariables();
    this.styleSubscription = this.util.getStyles
      .subscribe((style: StyleVariables) => {
        this.style = style;
      });

    this.userSubscription = this.userService.currentUser.subscribe((user) => {
      if (!!user) {
        this.user = user;
      }
    });

    if (this.user.customer_payment_id) {
      this.getSaveCards();
    } else {
      this.createForm();
    }
  }

  createForm() {
    if(this.gatewayId == 'urway') {
      this.onAddCard.emit()
    } else {
      this.form = this.formBuilder.group({
      card_holder_name: ['', [Validators.required]],
      exp_year: ['', [Validators.required]],
      exp_month: ['', [Validators.required]],
      cvc: ['', [Validators.required, Validators.minLength(3)]],
      card_number: ['', [Validators.required, Validators.minLength(14)]],
      p_code: ['']
    });
    this.showAddCard = true;
    }
    
  }

  onSave() {
    if (this.form.valid) {
      const obj = JSON.parse(JSON.stringify(this.form.value));
      if (obj.card_number.length < 14) {
        this.message.toast('success', `${this.translate.instant('Please Enter Valid Card Number')}!`);
        return;
      }

      if (this.gatewayId != 'pago_facil') {
        if (this.gatewayId === 'peach' || this.gatewayId == 'payuLatam') {
          obj['card_nonce'] = '';
          obj['card_type'] = 'VISA';
        }
        delete obj['p_code'];
        const payload: any = {
          ...obj,
          gateway_unique_id: this.gatewayId,
          user_id: this.user.id
        };
        this.isLoading = true;
        this.isNativeLoading = true;
        this.http.postData(ApiUrl.addCard, payload)
          .subscribe(response => {
            if (!!response && response.data) {
              this.message.toast('success', `${this.translate.instant('Card Added Successfully')}!`);
              this.form.reset();
              this.submitted = false;
              this.user.customer_payment_id = response.data.customer_payment_id;
              this.showAddCard = false;
              this.getSaveCards();
            }
            this.isLoading = false
            this.isNativeLoading = false;
          }, err => {
            this.isLoading = false;
            this.isNativeLoading = false;
          });
      }
      else {
        var pago_facil_obj = this.form.value;
        pago_facil_obj['paymentGatewayId'] = this.gatewayId;
        this.onSelect.emit({
          card_details: pago_facil_obj
        })
      }
      // const payload: any = {
      //   ...obj,
      //   gateway_unique_id: this.gatewayId,
      //   user_id: this.user.id
      // };
      // this.isLoading = true;
      // this.http.postData(ApiUrl.addCard, payload)
      //   .subscribe(response => {
      //     if (!!response && response.data) {
      //       this.message.toast('success', `${this.translate.instant('Card Added Successfully')}!`);
      //       this.form.reset();
      //       this.submitted = false;
      //       this.user.customer_payment_id = response.data.customer_payment_id;
      //       this.showAddCard = false;
      //       this.getSaveCards();
      //     }
      //     this.isLoading = false
      //   }, err => { this.isLoading = false });
    }
    this.submitted = true;
  }

  getSaveCards() {
    // this.isLoading = true;
    this.http.getData(ApiUrl.getCards, { 'customer_payment_id': this.user.customer_payment_id || this.user.id, gateway_unique_id: this.gatewayId }, false)
      .subscribe(response => {
        if (!!response && response.data) {
          this.cards = response.data.data || response.data.creditCards;
          if (this.cards.length == 1) {
            this.cardId = this.cards[0].id || this.cards[0].authnet_payment_profile_id || this.cards[0].token;
          };

          if (this.cards.length) {
            this.cards.forEach(element => {
              if (element.cardNumber) {
                element['last4'] = element.cardNumber.substr(element.cardNumber.length - 4);
              }
              if (element.number) {
                element['last4'] = element.number.substr(element.number.length - 4);
              }
              if (element.card_number) {
                element['last4'] = element.card_number.substr(element.card_number.length - 4);
              }
            });
            console.log(this.cards)
          }

          this.showAddCard = false;
          this.isLoading = false;
        } else { this.isLoading = false }
      }, err => this.isLoading = false);
  }

  onPay() {
    if (!this.cardId) {
      this.message.alert('info', this.translate.instant('Please Choose Card'));
      return;
    }
    this.onSelect.emit({
      card_id: this.cardId,
      customer_payment_id: this.user.customer_payment_id,
      paymentGatewayId: this.gatewayId,
      token: this.cards.find(card => card.id == this.cardId).token ? this.cards.find(card => card.id == this.cardId).token : ''
    })
  }

  onBack() {
    this.showAddCard = false;
    this.getSaveCards();
  }

  onRemoveCard(card: any) {
    this.isLoading = true;
    var obj = {
      customer_payment_id: (String)(this.user.customer_payment_id) || (String)(card.authnet_profile_id),
      card_id: String(card.id || card.authnet_payment_profile_id || card.token),
      gateway_unique_id: this.gatewayId
    }
    this.http.postData(ApiUrl.deleteCard, obj).subscribe(response => {
      this.cards = this.cards.filter(c => c.id != card.id);
      if (!this.cards.length) {
        this.createForm();
      }
      this.isLoading = false;
    }, err => this.isLoading = false)
  }
  trackByCardsFn(id, index) {
    return index;
  }
}
