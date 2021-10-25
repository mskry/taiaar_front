import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AppSettings } from '../../../../../shared/models/appSettings.model';
import { StyleVariables } from '../../../../../core/theme/styleVariables.model';
import { Subscription } from 'rxjs';
import { UtilityService } from '../../../../../services/utility/utility.service';
import { ScriptService } from '../../../../../services/script/script.service';
import { ScriptModel } from '../../../../../shared/models/script.model';
import { PaymentBaseComponent } from '../payment-base.component';

import { UserService } from '../../../../../services/user/user.service';
import { HttpService } from '../../../../../services/http/http.service';
import { ApiUrl } from '../../../../../core/apiUrl';
import { WINDOW } from '../../../../../services/window/window.service';
import { DOCUMENT } from '@angular/common';
import { GlobalVariable } from '../../../../../core/global';

// import * as braintree from 'braintree-web';
declare const braintree: any;

@Component({
    selector: 'app-braintree-gateway',
    templateUrl: './braintree-gateway.component.html',
    styleUrls: ['./braintree-gateway.component.scss']
})
export class BraintreeGatewayComponent extends PaymentBaseComponent implements OnInit, OnDestroy {

    settings: AppSettings;
    style: StyleVariables;

    styleSubscription: Subscription;
    settingSubscription: Subscription;
    // hostedFieldsInstance: braintree.HostedFields;
    cardholdersName: string;
    dropInCreated: boolean = false;

    constructor(
        private util: UtilityService,
        private scriptService: ScriptService,
        private userService: UserService,
        private httpService: HttpService,
        @Inject(WINDOW) private window: Window,
        @Inject(DOCUMENT) private document
    ) {
        super();
    }

    ngOnInit() {
        this.styleSubscription = this.util.getStyles
            .subscribe(style => {
                this.style = style;
            });

        this.settingSubscription = this.util.getSettings
            .subscribe((settings: AppSettings) => {
                this.settings = settings;
            })
        this.loadBrainTreeScript();
    }

    loadBrainTreeScript() {
        const scripts: ScriptModel[] = [
            // new ScriptModel('braintreeForm', 'https://js.braintreegateway.com/web/3.63.0/js/hosted-fields.min.js'),
            new ScriptModel('braintreeForm', 'https://js.braintreegateway.com/web/dropin/1.25.0/js/dropin.min.js'),

        ];
        const promises = [];
        scripts.forEach((script) => {
            promises.push(this.scriptService.loadScript(script));
        })
        Promise.all(promises).then((result: ScriptModel[]) => {
            if (result.find(script => !script.isLoaded)) {
                this.onError.emit('unable to load venmo gateway script');
                return;
            } else {
                this.dropInCreated = false;
                this.httpService.getData(ApiUrl.getBraintreeClientToken, {}).subscribe((response) => {
                    if (response && response.status == 200) {
                        // this.createBraintreeUI(response.data.client_token);
                        braintree.dropin.create({
                            authorization: response.data.client_token,
                            container: '#dropin-container',
                            googlePay: {
                                googlePayVersion: 2,
                                merchantId: this.settings.google_pay_merchant_id, //'08321159698332615129',
                                transactionInfo: {
                                    totalPriceStatus: 'FINAL',
                                    totalPrice: (this.order.amount).toFixed(2),
                                    currencyCode: GlobalVariable.CURRENCY_NAME
                                },
                                allowedPaymentMethods: [{
                                    type: 'CARD',
                                    parameters: {
                                        billingAddressRequired: true,
                                        billingAddressParameters: {
                                            format: 'FULL'
                                        }
                                    }
                                }]
                            },
                            applePay: {
                                displayName: GlobalVariable.SITE_NAME,
                                paymentRequest: {
                                    total: {
                                        label: this.order.user.email,
                                        amount: (this.order.amount).toFixed(2)
                                    },
                                    requiredBillingContactFields: ["postalAddress"]
                                }
                            }
                        }).then((dropinInstance) => {
                            this.dropInCreated = true;
                            var submitButton = document.querySelector('#submit-button');
                            submitButton.addEventListener('click', () => {
                                dropinInstance.requestPaymentMethod().then((payload) => {
                                    this.onSuccess.emit({
                                        'paymentGatewayId': 'braintree',
                                        'token': payload.nonce
                                    });
                                }).catch((err) => {
                                    console.error(err);
                                });
                            });
                        }).catch((err) => {
                            console.error(err);
                        });
                    }
                })
            }
        })
    }

    // createBraintreeUI(token) {
    //     braintree.client.create({
    //         authorization: token
    //     }).then((clientInstance) => {
    //         braintree.hostedFields.create({
    //             client: clientInstance,
    //             fields: {
    //                 number: {
    //                     selector: '#card-number',
    //                     placeholder: 'XXXX XXXX XXXX XXXX'
    //                 },
    //                 cvv: {
    //                     selector: '#cvv',
    //                     placeholder: '123'
    //                 },
    //                 expirationDate: {
    //                     selector: '#expiration-date',
    //                     placeholder: 'MM/YY'
    //                 }
    //             }
    //         }).then((hostedFieldsInstance) => {
    //             this.hostedFieldsInstance = hostedFieldsInstance;
    //             hostedFieldsInstance.on('focus', (event) => {
    //                 const field = event.fields[event.emittedBy];
    //                 const label = this.findLabel(field);
    //                 label.classList.remove('filled');
    //             });

    //             hostedFieldsInstance.on('blur', (event) => {
    //                 const field = event.fields[event.emittedBy];
    //                 const label = this.findLabel(field);
    //             });

    //             hostedFieldsInstance.on('empty', (event) => {
    //                 const field = event.fields[event.emittedBy];
    //             });

    //             hostedFieldsInstance.on('validityChange', (event) => {
    //                 const field = event.fields[event.emittedBy];
    //                 const label = this.findLabel(field);
    //                 if (field.isPotentiallyValid) {
    //                     label.classList.remove('invalid');
    //                 } else {
    //                     label.classList.add('invalid');
    //                 }
    //             });
    //         });
    //     });
    // }
    // tokenizeUserDetails() {
    //     this.hostedFieldsInstance.tokenize({ cardholderName: this.cardholdersName }).then((payload) => {
    //         console.log(payload);
    //         this.onSuccess.emit({
    //             'paymentGatewayId': 'braintree',
    //             'token': payload.nonce
    //         });
    //     }).catch((error) => {
    //         console.log(error);
    //     });
    // }
    // findLabel(field: braintree.HostedFieldsHostedFieldsFieldData) {
    //     return document.querySelector('.hosted-field--label[for="' + field.container.id + '"]');
    // }

    // onSubmit() {
    //     this.tokenizeUserDetails();
    // }

    ngOnDestroy(): void {
        if (this.styleSubscription) this.styleSubscription.unsubscribe();
        if (this.settingSubscription) this.settingSubscription.unsubscribe();
    }
}