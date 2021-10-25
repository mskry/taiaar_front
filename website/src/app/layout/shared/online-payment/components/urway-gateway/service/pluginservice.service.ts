import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { sha256 } from 'js-sha256'; //Lib For Encription
// import * as this.configJson from 'src/assets/configuration.json'
import * as resJson from './../constant/response-code.json'
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateMerchant } from './validate-merchant';
// import { DatePipe } from '@angular/common';
import { ResponseCode } from './../constant/response-code';
import * as moment from 'moment';

// @Injectable()
@Injectable({
    providedIn: 'root'
})
export class PluginService {
    urlParameters: Map<string, string>
    transDate = ''
    transId = ''
    cardToken = ''
    orderAmount = ''
    status = ''
    alertType = ''
    currentDate = Date.now() + "";

    public configJson: any = {};
    public paymentStatus = false;
    //     default: {
    //         'terminalId': 'rushdelive',
    //         'password': 'rushdelivery@123',
    //         'merchantkey': 'a9c4fe56a331d590ca84cb1de28cfd1a2e880e5e588b85ee658df51e1c1ffaab',
    //         'service_url': 'https://payments-dev.urway-tech.com/URWAYPGService/transaction/jsonProcess/JSONrequest'
    //     }
    // };

    private getTerminalId = "";
    private getPassword = "";
    private getMerchantKey = "";
    private serverUrl = ""; //  = this.configJson.default.service_url
    errorMsg = ""
    validateMerchantObj: ValidateMerchant

    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
        // private datePipe: DatePipe,
    }

    setData(data: Object) {
        this.configJson = {
            default: data
        }
        this.serverUrl = this.configJson.default.service_url;

        return true;
    }

    postData(data: Object) {
        let formData = JSON.parse(data.toString())
        let redirectURL = ""
        
        this.getTerminalId = this.configJson.default.terminalid
        this.getPassword = this.configJson.default.password
        this.getMerchantKey = this.configJson.default.merchantkey
        this.serverUrl = this.configJson.default.service_url
        let hashSequence = formData.trackid + "|" + this.getTerminalId + "|" + this.getPassword + "|" + this.getMerchantKey + "|" + formData.amount + "|" + (formData.currency).toUpperCase();
        
        // formData.orderID
        let hash = this.generateHash(hashSequence);
        let paymentForm = {
            'amount': formData.amount,
            'customerEmail': formData.email,
            'currency': ("" + formData.currency).toUpperCase(),
            'action': 12,
            'tokenizationType': 0,
            'trackid': formData.trackid,
            'requestHash': hash,
            'terminalId': this.getTerminalId,
            'country': ("" + formData.country).toUpperCase(),
            'password': this.getPassword,
            'firstName': formData.firstName,
            'merchantIp': "52.43.236.85",
            'udf2': `${window.location.origin}/success`,
            'udf4': "Web",
            "tokenOperation": "A",
        };

        
        let options = this.RequestPara();
        return this.http.post(this.serverUrl, JSON.stringify(paymentForm), { headers: options })
    }
    paymentAPI(arg: any) {
        let options = this.RequestPara();
        return this.http.post(this.serverUrl, arg, { headers: options })
    }
    RequestPara() {

        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set("Access-Control-Allow-Origin", "*")
            .set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS, READ')
            .set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token,authorization,XMLHttpRequest, user-agent, accept')
        return headers;
    }
    generateHash(arg: string) {
        // hashSequence = posted["trackid"]+"|"+posted["terminalId"]+"|"+posted["password"]+"|"+posted["secret"]+"|"+posted["amount"]+"|"+posted["currency"];
        var hashSequence = arg
        return sha256(hashSequence);

    }
    validateData(arg: Object) {
        let fieldData = JSON.parse(arg.toString())
        let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        var countryCode, email, amount, orderId, currency = ""

        if (fieldData['country'] === '') {
            this.errorMsg = "Required Country Code"
            return false
        }
        else if (fieldData['country'].length() != 2) {
            this.errorMsg = "Invalid Country Code"
            return false
        }
        else if (Number(fieldData['amount']) <= 0) {
            this.errorMsg = "Amount Invalid"
            return false
        }
        else if (fieldData['amount'] === "") {
            this.errorMsg = "Required Amount"
            return false
        }

        else if (fieldData['trackid'] === "") {
            this.errorMsg = "Required OrderID"
            return false
        }
        else if (fieldData['currency'].length != 3) {
            this.errorMsg = "Invalid Currency"
            return false
        }
        else if (regexp.test(fieldData['email'])) {
            this.errorMsg = "Invalid EmailID"
            return false
        }
        else {
            return true
        }
    }


    validate(arg: Object) {
        let fieldData = JSON.parse(arg.toString())
        // let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        let regexp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        this.validateMerchantObj = new ValidateMerchant();
        if (fieldData.countryCode === '') {

            this.validateMerchantObj.errorMessage = "Required Country Code"
            this.validateMerchantObj.isError = true
            this.validateMerchantObj.isCountryCode = true
            localStorage.setItem('doubleClick', "true");
            return this.validateMerchantObj
        }
        else if (("" + fieldData.countryCode).length != 2) {
            this.validateMerchantObj.errorMessage = "Invalid Country Code"
            this.validateMerchantObj.isError = true
            this.validateMerchantObj.isCountryCode = true
            localStorage.setItem('doubleClick', "true");
            return this.validateMerchantObj
        }
        else if ((fieldData.email + "") === "") {
            this.validateMerchantObj.errorMessage = "Required EmailID"
            this.validateMerchantObj.isError = true
            this.validateMerchantObj.isEmail = true
            localStorage.setItem('doubleClick', "true");
            return this.validateMerchantObj
        }
        else if (!regexp.test("" + fieldData.email)) {
            this.validateMerchantObj.errorMessage = "Invalid EmailID"
            this.validateMerchantObj.isError = true
            this.validateMerchantObj.isEmail = true
            localStorage.setItem('doubleClick', "true");
            return this.validateMerchantObj
        }
        else if (Number("" + fieldData.amount) <= 0) {
            this.validateMerchantObj.errorMessage = "Amount Invalid"
            this.validateMerchantObj.isError = true
            this.validateMerchantObj.isAmount = true
            localStorage.setItem('doubleClick', "true");
            return this.validateMerchantObj
        }
        else if (("" + fieldData.amount) === "") {
            this.validateMerchantObj.errorMessage = "Required Amount"
            this.validateMerchantObj.isError = true
            this.validateMerchantObj.isAmount = true
            localStorage.setItem('doubleClick', "true");
            return this.validateMerchantObj
        }

        else if (("" + fieldData.orderID) === "") {
            this.validateMerchantObj.errorMessage = "Required OrderID"
            this.validateMerchantObj.isError = true
            this.validateMerchantObj.isOrderID = true
            localStorage.setItem('doubleClick', "true");
            return this.validateMerchantObj
        }

        else if (("" + fieldData.currency).length != 3) {
            this.validateMerchantObj.errorMessage = "Invalid Currency"
            this.validateMerchantObj.isError = true
            this.validateMerchantObj.isCurrency = true
            localStorage.setItem('doubleClick', "true");
            return this.validateMerchantObj
        }

        else {
            this.validateMerchantObj.isError = false
            return this.validateMerchantObj
        }
    }
    inquiryAPI(args: Map<string, string>): string {
        var res = ""
        this.paymentAPI(JSON.stringify(args)).subscribe(
            res => {
                let getResponse = JSON.parse(JSON.stringify(res));
                res = getResponse['responseCode']
            }
        );
        return res;
    }
    paymentReceiptValidate(args) {
        debugger;
        this.urlParameters = new Map<string, string>();
        for (var i = 0; i < args.length; i++) {
            var sParameterName = args[i].split("=");
            this.urlParameters.set("" + sParameterName[0].split(","), "" + sParameterName[1].split(","))
        }
        var reqHashSequence = this.urlParameters.get("TranId") + "|" + this.configJson.default.merchantkey + "|" + this.urlParameters.get("ResponseCode") + "|" + this.urlParameters.get("amount");
        var reqHash = this.generateHash(reqHashSequence)
        var setRequest = {
            "firstName": "",
            "lastName": "",
            "address": "",
            "city": "",
            "state": "",
            "zipCode": "",
            "phoneNumber": "",
            "trackid": this.urlParameters.get("TrackId"),
            "terminalId": this.configJson.default.terminalid,
            "customerEmail": "",
            "action": '1',
            "merchantIp": "",
            "password": this.configJson.default.password,
            "currency": localStorage.getItem('getCurrency'),
            "country": "",
            "transid": this.urlParameters.get("TranId"),
            "amount": Number(this.urlParameters.get("amount")),
            "tokenOperation": "A",
            "cardToken": "",

            "requestHash": "",
            "udf1": "",
            "udf2": "",
            "udf3": "",
            "udf4": "",
            "udf5": ""
        }

        if (this.urlParameters.get("responseHash") + "" === reqHash + "") {
            var responseHashSequence = this.urlParameters.get("TrackId") + "|" + this.configJson.default.terminalid + "|" + this.configJson.default.password + "|" + this.configJson.default.merchantkey + "|" + this.urlParameters.get("amount") + "|" + localStorage.getItem('getCurrency');
            var responseHash = this.generateHash(responseHashSequence)
            setRequest['requestHash'] = responseHash
            this.paymentAPI(JSON.stringify(setRequest)).subscribe(
                res => {
                    let getResponse = JSON.parse(JSON.stringify(res));
                    if (getResponse['responseCode'] + "" === this.urlParameters.get("ResponseCode")) {
                        if (this.urlParameters.get("transDate"))
                            this.currentDate = (this.urlParameters.get("transDate"))
                        else
                            this.currentDate = moment(new Date()).format('DD-MM-YYYY, h:MM a');
                        // this.datePipe.transform(new Date(), 'dd-MM-yy, h:MM a');
                        if (this.urlParameters.get("transDate"))
                            this.currentDate = (this.urlParameters.get("transDate"))
                        else
                            this.currentDate = moment(new Date()).format('DD-MM-YYYY, h:MM a');
                        //this.datePipe.transform(new Date(), 'dd-MM-yy, h:MM a');
                        this.transDate = this.urlParameters.get("transDate")
                        this.transId = this.urlParameters.get("TranId")
                        if ((this.urlParameters.get("cardToken") + "") == 'null') {
                            this.cardToken = ""
                        } else
                            this.cardToken = "" + this.urlParameters.get("cardToken")
                        this.orderAmount = this.urlParameters.get("amount")
                        if (this.urlParameters.get("ResponseCode") === "000")
                            this.alertType = 'alert-success'
                        else
                            this.alertType = 'alert-danger'
                        this.status = ResponseCode.response_msg[this.urlParameters.get("ResponseCode")]
                    }
                }
            );
        } else {
            console.log("req and res hash not matched")
        }



    }

}
