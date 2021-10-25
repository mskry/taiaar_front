import { HttpClient } from '@angular/common/http';
import { LocationService } from './../location/location.service';
import { SeoService } from './../seo/seo.service';
import { Injectable, Inject, PLATFORM_ID, Injector, NgZone } from '@angular/core';
import { HttpService } from '../http/http.service';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { WINDOW } from '../window/window.service';
import { ApiUrl } from './../../../app/core/apiUrl';
import { GlobalVariable } from './../../../app/core/global';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ThemeService } from '../theme/theme.service';
import { UtilityService } from '../utility/utility.service';
import { ApiKeys } from './../../shared/models/apiKeys.model';
import { ScriptService } from '../script/script.service';
import { ScriptModel } from '../../shared/models/script.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { app } from 'firebase';
import { AppSettings } from '../../shared/models/appSettings.model';

@Injectable({
  providedIn: 'root'
})
export class AppLoadService {

  apiKeys: ApiKeys;
  DOMAIN: string = '';

  constructor(
    private http: HttpService,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(WINDOW) private window: Window,
    private injector: Injector,
    private title: Title,
    private themeService: ThemeService,
    private util: UtilityService,
    private scriptService: ScriptService,
    private _seoService: SeoService,
    private deviceService: DeviceDetectorService,
    private ngZone: NgZone,
    private _http: HttpClient,
    private location: LocationService,
  ) {
    this.apiKeys = new ApiKeys();

    this.DOMAIN = this.window.origin;
    // this.DOMAIN = 'https://ecommercesingledev.royoapps.com';
    // this.DOMAIN = 'https://grocerrysinglevendor.royoapps.com';
    // this.DOMAIN = 'https://newsinglevendorfood.royoapps.com';
    // this.DOMAIN = 'https://foodsingledev.royoapps.com';
    // this.DOMAIN = 'https://ecommercen.royoapps.com';
    // this.DOMAIN = 'https://medexpertt.royoapps.com';
    // this.DOMAIN = 'https://palmmarketplace.royoapps.com';
    // this.DOMAIN = 'https://healthcare.royoapps.com';
    // this.DOMAIN = 'https://royofood.royoapps.com';
    // this.DOMAIN = 'https://tidycoop01.royoapps.com'
    // this.DOMAIN = 'https://jiibli.royoapps.com',
    // this.DOMAIN = 'https://website.poneeex.com'
    // this.DOMAIN = 'https://fijieats.com'
    // this.DOMAIN = 'https://tianquiz.royoapps.com'
    // this.DOMAIN = 'https://laundry.royoapps.com'
    // this.DOMAIN = "https://royokarts.royoapps.com"
    // this.DOMAIN = 'https://zmarkett.royoapps.com';
    // this.DOMAIN = 'https://alikhlass.royoapps.com';
    // this.DOMAIN = "https://fooodo.royoapps.com"
    // this.DOMAIN = 'https://theclikat.royoapps.com';
    // this.DOMAIN = 'https://royoessentials.royoapps.com'
    // this.DOMAIN = 'https://hungerdeliverydemo.royoapps.com',
    // this.DOMAIN = 'https://carinito.royoapps.com';
    // this.DOMAIN = 'https://royohomes.royoapps.com';
    // this.DOMAIN = 'https://icecreamhub.royoapps.com'
    // this.DOMAIN = 'https://wrclive.royoapps.com'
    // this.DOMAIN = 'https://hempireca.com'
    // this.DOMAIN = 'https://thetazeja.royoapps.com'
    // this.DOMAIN = 'https://newsinglevendorfood.royoapps.com'
    // this.DOMAIN = 'https://kury.royoapps.com'
    // this.DOMAIN = 'https://ajak.app'
    // this.DOMAIN = 'https://clickattest.royoapps.com'
    // this.DOMAIN = 'https://faindy.net'
    // this.DOMAIN = 'https://order.alqadifoods.com'
    // this.DOMAIN = 'https://alkhaliligroup.royokart.com'
    // this.DOMAIN = 'https://netritemall.co.bw'
    // this.DOMAIN = 'https://found.royoapps.com'
    // this.DOMAIN = 'https://little-caesars.royoapps.com'
    // this.DOMAIN = 'https://freshfarms.royoapps.com'
    // this.DOMAIN = 'https://laundry.royoapps.com'
    // this.DOMAIN = 'https://order.zipeats.ca'
    // this.DOMAIN = 'https://thepeoplesstore.royoapps.com'
    // this.DOMAIN = 'https://cleanfaxlive.royoapps.com'
    // this.DOMAIN = 'https://foodydoo.com'
    // this.DOMAIN = 'https://tappdelivery.com'
    // this.DOMAIN = 'https://ulagula.com'
    // this.DOMAIN = 'https://netritemall.co.bw'
    // this.DOMAIN = 'https://readychef.com'
    // this.DOMAIN = 'https://ecommercen.royoapps.com'
    // this.DOMAIN = 'https://expactor.com'
    // this.DOMAIN = 'https://bodyformula.ca'
    // this.DOMAIN = 'https://freshfarmsandlocal.royokart.com'
    // this.DOMAIN = 'https://singlevendordev.royokart.com'
    // this.DOMAIN = 'https://order.klikdelivery.com'
    // this.DOMAIN = 'https://cravzz.com'
    // this.DOMAIN = 'https://hajaty.royoapps.com'
    // this.DOMAIN = 'https://platesapp.ae'
    // this.DOMAIN = 'https://experience.royoapps.com'
    // this.DOMAIN = 'https://wholesaledrop.com.au'
    // this.DOMAIN = 'https://pideyummy.com';
    // this.DOMAIN = 'https://speedybites.com'
    // this.DOMAIN = 'https://rushdelivery.royoapps.com'
    // this.DOMAIN = 'https://rush.rest'
    //  this.DOMAIN = 'https://meezzaafood.com'
    // this.DOMAIN = 'https://hotboxdeliveryservice.com'
    // this.DOMAIN = 'https://delifood.royoapps.com',
    // this.DOMAIN = 'https://roadsideassistance.royoapps.com'
    // this.DOMAIN = 'https://lubanah.royoapps.com'
    // this.DOMAIN = 'https://pickittt.royoapps.com',
    // this.DOMAIN = 'https://brandchasers.royoapps.com',
    // this.DOMAIN = 'https://fooddemolive.royoapps.com'
    // this.DOMAIN = 'https://ecommercen.royoapps.com'
    // this.DOMAIN = 'https://homerr.royoapps.com'
    // this.DOMAIN = 'https://delibear.royoapps.com'
    // this.DOMAIN = 'https://lebanon.klikdelivery.com'
    // this.DOMAIN = 'https://scrubble.in'
    // this.DOMAIN = 'https://gurumarket.royoapps.com'
    // this.DOMAIN = 'https://ondemandinterprators.royoapps.com'
    // this.DOMAIN = 'https://4n1delivery.royoapps.com'
    // this.DOMAIN = 'https://experienceembrun.ca'
    //this.DOMAIN = 'https://erastore.lk'
    // this.DOMAIN = 'https://mazu.royoapps.com'
    //this.DOMAIN = 'https://onmyway.royoapps.com'
    // this.DOMAIN = 'https://bookmytable.royoapps.com',
    // this.DOMAIN = 'https://rajatcustom.royoapps.com'
    // this.DOMAIN = 'https://dailyooz.com'
    // this.DOMAIN = 'https://homent.royoapps.com'
    // this.DOMAIN = 'https://tophandscleaningservice.royoapps.com'
    // this.DOMAIN = 'https://erastore.lk'
    // this.DOMAIN = 'https://yammfood.royoapps.com'
    // this.DOMAIN = 'https://homerr.royoapps.com'
    // this.DOMAIN = 'https://bookmytable.royokart.com'
    // this.DOMAIN = 'https://ecommercen.royoapps.com'
    // this.DOMAIN = 'https://sangtini.royoapps.com'
    // this.DOMAIN = 'https://yourbutler.royoapps.com'
    //this.DOMAIN = 'https://grooming-app.com'
    // this.DOMAIN = 'https://shopperdemo.healthyboost.life'
    // this.DOMAIN = 'https://meezzaafood.com'
    // this.DOMAIN = 'https://yourbutler.royoapps.com'
    // this.DOMAIN = 'https://faitotest.royoapps.com'
    // this.DOMAIN = 'https://newcoach.royoapps.com'
    // this.DOMAIN = 'https://vubzii.royoapps.com'
    // this.DOMAIN = 'https://onmyway.royoapps.com'
    // this.DOMAIN = 'https://localflavorkc.com'
    // this.DOMAIN = 'https://cravzz.com'
    // this.DOMAIN = 'https://tophandscleaningservice.royoapps.com'
    // this.DOMAIN = 'https://yummyclone.royokart.com'
    // this.DOMAIN = 'https://profixhogarlive.royoapps.com'
    // this.DOMAIN = 'https://mosich.royoapps.com'
    // this.DOMAIN = 'https://profixhogarlive.royoapps.com',
    // this.DOMAIN = 'https://yayeen.royostaging.com'
    // this.DOMAIN = 'https://yammfood.royoapps.com';
    // this.DOMAIN = 'https://homeservicesingledev-admin.royokart.com';
    // this.DOMAIN = 'https://homerr.royoapps.com'
    // this.DOMAIN = 'https://bookmytable.royokart.com'
    // this.DOMAIN = 'https://ecommercen.royoapps.com'
    // this.DOMAIN = 'https://homent.royoapps.com'
    //this.DOMAIN = 'https://bookmytable.royokart.com'
    // this.DOMAIN = 'https://takakk.royoapps.com'
    // this.DOMAIN = 'https://mazu.royoapps.com'
    //this.DOMAIN = 'https://pickittt.royoapps.com'
    // this.DOMAIN = 'https://pickittstage.royostaging.com'
    // this.DOMAIN = 'https://newsinglevendorfood.royoapps.com'

    //this.DOMAIN = 'https://sangtini.royoapps.com'
    //this.DOMAIN = 'https://dailyooz.com'
    // this.DOMAIN = 'https://taiaar.royostaging.com'
    //this.DOMAIN = 'https://yayeen.royostaging.com'
    //this.DOMAIN = 'https://tophandscleaningservice.royoapps.com'
    //this.DOMAIN = 'https://epitodelivery.com'
    // this.DOMAIN = 'https://pickittstage.royostaging.com'

    //this.DOMAIN = 'https://yourbutler.royoapps.com'

    // this.DOMAIN = 'https://onmyway.royoapps.com'
    // this.DOMAIN = 'https://yammfood.royoapps.com'
    //this.DOMAIN = 'https://faindy.net'
    // this.DOMAIN = 'https://cityruner.royoapps.com'
    // this.DOMAIN = 'https://localflavorkc.com'

    // this.DOMAIN = 'https://royofood.royoapps.com';

    // this.DOMAIN = 'https://faindy.royostaging.com'
    // this.DOMAIN = 'https://bookmytable.royostaging.com'
    this.DOMAIN = 'https://www.taiaar.com'
  }


  init(): Promise<AppSettings> {
    return this.establishDbConnection();
  }

  establishDbConnection(): Promise<AppSettings> {
    let domain: string = '';

   domain = this.DOMAIN;

    // if (isPlatformServer(this.platformId)) {
    //   domain = 'https://' + this.injector.get('host');
    // } else {
    //   domain = this.window.origin;
    // }
    let router = this.injector.get(Router);

    const promise = new Promise<AppSettings>((resolve, reject) => {
      this.http.getDBKey(ApiUrl.getDbKey, { domain: domain }).toPromise()
        .then(response => {
          if (!!response && response.data.data.length) {
            if (response.data.currency && response.data.currency.length) {
              const { currency_symbol, currency_name } = response.data.currency[0];
              GlobalVariable.CURRENCY = currency_symbol;
              GlobalVariable.CURRENCY_NAME = currency_name;
            }

            const app_data = (response.data.data)[0];

            GlobalVariable.flowData = response.data.flowData || [];
            GlobalVariable.UNIQUE_ID = app_data.uniqueId;
            GlobalVariable.SITE_NAME = app_data.business_name;
            GlobalVariable.EMAIL = app_data.email || GlobalVariable.EMAIL;
            GlobalVariable.PHONE_NUMBER = app_data.phone_number || GlobalVariable.PHONE_NUMBER;
            GlobalVariable.COUNTRY_CODE = app_data.country_code;
            GlobalVariable.WHATSAPP_NUMBER = app_data.whatsapp_phone_number;
            GlobalVariable.WHATSAPP_NUMBER_CODE = app_data.whatsapp_country_code;
            GlobalVariable.COUNTRY = app_data.country || GlobalVariable.COUNTRY;
            GlobalVariable.admin_domain = app_data.cbl_customer_domains[0].admin_domain;
            GlobalVariable.AGENT_DB_KEY = app_data.cbl_customer_domains[0].agent_db_secret_key;

            if (app_data.cbl_customer_domains[0].supplier_domain) {
              GlobalVariable.supplier_domain = app_data.cbl_customer_domains[0].supplier_domain;
            } else {
              GlobalVariable.supplier_domain = app_data.cbl_customer_domains[0].admin_domain;
            }

            this.title.setTitle(GlobalVariable.SITE_NAME);

            const dbKey = app_data.cbl_customer_domains[0].db_secret_key;
            if (dbKey) {
              this.util.setLocalData('DB_KEY', dbKey);
              /*********** Set Keys & Load Scripts *********/
              const featureData = response.data.featureData;
              this.setApiKeys(featureData, response.data.settingsData);
              /*********************************************/
              GlobalVariable.SECRET_DB_KEY = dbKey;

              this.loadSettings(response.data.settingsData);

              if (response.data['currency']) {
                this.util.setMultiCurrency(response.data['currency']);
              }
            }
          }
          resolve(response.data.settingsData);
        },
          err => {
            if (isPlatformBrowser(this.platformId)) {
              document.getElementById("splash_screen").style.display = "none";
            }
            router.navigate(['error']);
            reject(err);
          }
        );
    });
    return promise;
  }

  loadSettings(settingData): AppSettings | Promise<AppSettings> {
    if (!!settingData) {
      return this.fetchSettings(settingData);
    } else {
      return this.http.getData(ApiUrl.getSettings, {}).toPromise().then((response) => {
        if (!!response && response.data) {
          const appData = response.data;
          return this.fetchSettings(appData);
        }
      });
    }
  }

  fetchSettings(appData): AppSettings {
    /************* Set Settings Data *************/
    const settings = this.setSettingsData(appData);

    if (settings.isCustomFlow && isPlatformBrowser(this.platformId)) {
      let flow_data = this.util.getLocalData('selected_category', true);
      if (!!flow_data && flow_data.type < 11) {
        settings.app_type = flow_data.type;
        this.util.setSettings(settings);
        this.themeService.setStyles();
      }
    }

    if (settings.no_default_product_sort == 1) {
      this.util.defaultFilters.low_to_high = -1;
    }

    this._seoService.setDefault();
    /*********************************************/

    /************* Dynamic Theme *****************/
    if (isPlatformBrowser(this.platformId)) {
      const appColor: any = {};
      if (appData.key_value) {
        appColor.baseColor = appData.key_value['element_color'];
        appColor.primaryColor = appData.key_value['theme_color'];
        appColor.headerFontFamily = appData.key_value['font_family'];
        appColor.headerBackgroundColor = appData.key_value['header_color'];
        appColor.headerTextColor = appData.key_value['header_text_color'];
        appColor.topHeaderBackgroundColor = appData.key_value['top_header_color'];
        appColor.topHeaderTextColor = appData.key_value['top_header_text_color'];
        appColor.footerColor = appData.key_value['footer_color'];
        appColor.footerSecColor = appData.key_value['footer_sec_color'];
        appColor.footerTextColor = appData.key_value['footer_text_color'];
      }
      this.themeService.setStyles(appColor);
      this.util.setLocalData('site_logo', settings.site_logo);
    }
    /*********************************************/

    /******************** set self pickup ************************/
    if (appData['bookingFlow'][0].is_pickup_order <= 1) {
      this.util.setSelfPickup(appData['bookingFlow'][0].is_pickup_order);
    }



    /**************************************** set favicon **************************************************/
    if (appData.key_value && appData.key_value.favicon_url) {
      this.setFavicon(appData.key_value.favicon_url);
    }

    return settings;
  }

  getClientDetails() {
    this._http.get<{ ip: string }>('https://jsonip.com')
       .subscribe(data => {
         if (data && data.ip) {
           this.util.setLocalData('ip', data.ip);
         }
       });
 }

  setSettingsData(appData: any): AppSettings {
    if (appData.screenFlow.length && appData.bookingFlow.length && appData.key_value) {
      let settingsObj = { ...appData.screenFlow[0], ...appData.bookingFlow[0], ...appData.key_value, ...appData.adminDetails[0] };
      settingsObj['single_vendor_id'] = appData['supplier_id'];
      settingsObj['has054321234567890-DafaultAddrees'] = (appData['default_address'] && appData['default_address'].length);
      let terms = !!appData.termsAndConditions && appData.termsAndConditions[0] ? appData.termsAndConditions[0] : null;
      settingsObj['privacyPolicy'] = terms ? terms.privacyPolicy : 0;
      settingsObj['termsAndConditions'] = terms ? terms.termsAndConditions : 0;
      settingsObj['aboutUs'] = terms ? terms.aboutUs : 0;
      settingsObj['faqs'] = terms ? terms.faqs : 0;
      settingsObj['default_address'] = appData.default_address ? appData.default_address[0] : {};
      settingsObj['payment_card_images'] = appData.key_value.payment_card_images ? appData.key_value.payment_card_images : 0;
      settingsObj['isFirebaseAnalytics'] = appData.key_value.isFirebaseAnalytics;
      settingsObj['is_segment'] = appData.key_value.is_segment;
      settingsObj['by_pass_tables_selection'] = appData.key_value.by_pass_tables_selection;
      settingsObj['is_table_booking'] = appData.key_value.is_table_booking;
      settingsObj['is_table_invite_allowed'] = appData.key_value.is_table_invite_allowed;
      settingsObj['is_coin_exchange'] = appData.key_value.is_coin_exchange;
      settingsObj['is_abn_business'] = appData.key_value.is_abn_business;
      settingsObj['table_booking_add_food_allow'] = appData.key_value.table_booking_add_food_allow;
      settingsObj['is_sos_allow'] = appData.key_value.is_sos_allow;
      settingsObj['is_survey_monkey_allow'] = appData.key_value.is_survey_monkey_allow;
      settingsObj['content_id'] = appData.key_value.content_id;
      settingsObj['is_custom_category_template'] = appData.key_value.is_custom_category_template;
      settingsObj['is_laundry_theme'] = appData.key_value.is_laundry_theme;
      settingsObj['dropoff_buffer'] = appData.key_value.dropoff_buffer;
      settingsObj['signup_declaration'] = appData.key_value.signup_declaration;
      settingsObj['enable_size_chart_in_product'] = appData.key_value.enable_size_chart_in_product;
      settingsObj['enable_country_of_origin_in_product'] = appData.key_value.enable_country_of_origin_in_product;
      settingsObj['is_guest_user_feedback_enable'] = appData.key_value.is_guest_user_feedback_enable;
      settingsObj['is_compare_products'] = appData.key_value.is_compare_products;
      settingsObj['enable_promo_code_list'] = appData.key_value.enable_promo_code_list;
      settingsObj['enable_best_sellers'] = appData.key_value.enable_best_sellers;
      settingsObj['enable_min_order_distance_wise'] = appData.key_value.enable_min_order_distance_wise;
      settingsObj['show_tags_for_suppliers'] = appData.key_value.show_tags_for_suppliers;
      settingsObj['show_user_subscription_home_button'] = appData.key_value.show_user_subscription_home_button;
      settingsObj['show_reward_home_button'] = appData.key_value.show_reward_home_button;
      settingsObj['countryCodes'] = appData.countryCodes;
      const settings = new AppSettings(settingsObj);

      if (settingsObj.pickit_home_theme == 1) {
        if (!!this.apiKeys.google_maps) {
          const script = new ScriptModel('angularAnalytics',
            `https://www.googletagmanager.com/gtag/js?id=G-17FD862E1R`
          )
          this.scriptService.loadScript(script).then((script: ScriptModel) => {
            if (script.isLoaded) {
              console.log('Google analytice', script)
            }
          })
        }
      }
      this.util.setSettings(settings);

      return settings;
    }
  }

  setApiKeys(featureData: any, appData: any): void {

    /******************************* FCM ******************************/
    if (isPlatformBrowser(this.platformId)) {

      GlobalVariable.IS_MOBILE = this.deviceService.isMobile();

      this._http.get<{ ip: string }>('https://jsonip.com')
        .subscribe(data => {
          if (data && data.ip) {
            this.util.setLocalData('ip', data.ip);
          }
        });

      const notification = featureData.find(data => data['type_name'] == 'notification' && data['name'] === 'FCM');
      if (!!notification && notification.key_value_front.length) {
        if (notification.key_value_front.length) {
          notification.key_value_front.forEach(el => {
            this.apiKeys.fcm_config[el.key] = el.value;
            GlobalVariable.FIREBASE_CONFIG[el.key] = el.value;
          });
        }
      }

      const chatbot = featureData.find(data => data['type_name'] == 'chat_bot');
      if (!!chatbot && chatbot.key_value_front.length) {
        const dialogflow = (chatbot.key_value_front).find(el => el.key == 'dialog_project_id');
        if (!!dialogflow) {
          GlobalVariable.DIALOGFLOW_PROJECT_ID = dialogflow.value;
        }
      }
    }

    /******************************* Gateways ******************************/
    this.apiKeys.paymentGateways = (featureData.filter(element =>
      element['type_name'] == 'payment_gateway')).map((
        { id, name, is_active, key_value_front }
      ) => new Object({
        id, name, is_active, key_value_front
      }));
    /***********************************************************************/

    const socialLoginProviders = featureData.filter(data => data['type_name'] == 'social_login');
    if (socialLoginProviders.length) {
      socialLoginProviders.forEach(socialLogin => {
        if (!!socialLogin && socialLogin.key_value_front.length) {
          if ((socialLogin.name).toLowerCase() === 'facebook') {
            const facebook = (socialLogin.key_value_front).find(el => el.key == 'app_id');
            if (!!facebook) {
              GlobalVariable.facebook_appId = facebook.value;
            }
          } else if ((socialLogin.name).toLowerCase() === 'google') {
            const google = (socialLogin.key_value_front).find(el => el.key == 'client_id');
            if (!!google) {
              GlobalVariable.google_clientId = google.value;
            }
          }
        }
      });
    }

    const geoLocationProvider = featureData.filter(data => data['type_name'] == 'map');
    if (geoLocationProvider.length) {
      geoLocationProvider.forEach(googleMaps => {
        if (!!googleMaps && googleMaps.key_value_front.length) {
          if ((googleMaps.name).toLowerCase() === 'new google maps') {
            const new_map_key = (googleMaps.key_value_front).find(el => el.key == 'google_map_key_web');
            if (!!new_map_key) {
              this.apiKeys.google_maps = new_map_key.value;
            }
          } else if ((googleMaps.name).toLowerCase() === 'google maps') {
            const map_key = (googleMaps.key_value_front).find(el => el.key == 'google_map_key');
            if (!!map_key) {
              this.apiKeys.google_maps = map_key.value;
            }
          }
        }
      });
    }

    const meta = featureData.filter(data => data['type_name'] == 'meta');
    if (meta.length) {
      meta.forEach(meta_tags => {
        if (!!meta_tags && meta_tags.key_value_front.length) {
          if ((meta_tags.name).toLowerCase() === 'pinterest meta tag') {
            const pinterest_meta = (meta_tags.key_value_front).find(el => el.key == 'pinterest_content_id');
            if (!!pinterest_meta) {
              this.apiKeys.pinterest_content_id = pinterest_meta.value;
            }
          } else if ((meta_tags.name).toLowerCase() === 'google search console') {
            const google_search_meta = (meta_tags.key_value_front).find(el => el.key == 'google_search_content_id');
            if (!!google_search_meta) {
              this.apiKeys.google_search_content_id = google_search_meta.value;
            }
          }
        }
      });
    }

    const chat_services = featureData.filter(data => data['type_name'] == 'chat_service');
    if (chat_services.length) {
      chat_services.forEach(chat_service => {
        if (!!chat_service && chat_service.key_value_front.length) {
          if ((chat_service.name).toLowerCase() === 'tawk') {
            const site_id_obj = (chat_service.key_value_front).find(el => el.key == 'site_id');
            if (!!site_id_obj) {
              this.apiKeys.tawk_site_id = site_id_obj.value;
            }
          }
          if ((chat_service.name).toLowerCase() === 'hijiffy') {
            const token = (chat_service.key_value_front).find(el => el.key == 'token');
            if (!!token) {
              this.apiKeys.hijiffy_token = token.value;
            }
          }

          if ((chat_service.name).toLowerCase() === 'zendesk') {
            const web_zendesk_key = (chat_service.key_value_front).find(el => el.key == 'web_zendesk_key');
            if (!!web_zendesk_key) {
              this.apiKeys.zendesk_key = web_zendesk_key.value;
            }
          }
        }
      });
    }

    const analytics = featureData.filter(data => data['type_name'] == 'analytics');
    if (analytics.length) {
      analytics.forEach(analytic => {
        if (!!analytic && analytic.key_value_front.length) {
          if (analytic.name.toLowerCase() === "google tag manager") {
            const container = analytic.key_value_front.find(item => item.key == 'container_id');
            if (!!container) this.apiKeys.gtm = container['value'];
          }
          if (analytic.name.toLowerCase() === "google tag manager") {
            const property_id = analytic.key_value_front.find(item => item.key == 'property_id');
            if (!!property_id) this.apiKeys.google_property_id = property_id['value'];
          }
          if (analytic.name.toLowerCase() === "facebook pixel") {
            const pixel = analytic.key_value_front.find(item => item.key == 'facebook_id');
            if (!!pixel) this.apiKeys.facebook_pixel_id = pixel['value'];
          }
          if (analytic.name.toLowerCase() === "segment") {
            const segment = analytic.key_value_front.find(item => item.key == 'segment_key');
            if (!!segment) this.apiKeys.segment_key = segment['value'];
          }
          if (analytic.name.toLowerCase() === "oribi") {
            const oribi = analytic.key_value_front.find(item => item.key == 'scriptToken');
            if (!!oribi) this.apiKeys.oribi_analytics = oribi['value'];
          }
          if (analytic.name.toLowerCase() === "site scout pixel") {
            const site_scout = analytic.key_value_front.find(item => item.key == 'pixel_id');
            if (!!site_scout) this.apiKeys.sitescout_pixel_id = site_scout['value'];
          }
        }
      });
    }

    this.util.setKeys(this.apiKeys);

    //Load Map Script
    if (!!this.apiKeys.google_maps) {
      const script = new ScriptModel('googleMaps',
        `https://maps.google.com/maps/api/js?key=${this.apiKeys.google_maps}&libraries=places,visualization,drawing,geometry`
      )
      this.scriptService.loadScript(script).then((script: ScriptModel) => {
        if (script.isLoaded) {
          this.util.settingsLoaded.next(true);

          /********************************  set location ****************************************/
          if (appData.default_address && appData.default_address.length && !(this.util.handler.longitude && this.util.handler.longitude) && appData.key_value.no_default_address != 1 && appData.key_value.fetch_current_location_first != 1) {
            this.util.setUserLocation(appData.default_address[0]);
          } else if (this.util.getLocalData('user_location')) {
            let user_location = this.util.getLocalData('user_location', true);
            this.util.setUserLocation(user_location);
          } else if (appData.screenFlow && appData.screenFlow.length && appData.screenFlow[0].app_type != 1) {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(position => {
                this.location.getGeoLocation(position.coords.latitude, position.coords.longitude).subscribe((address) => {
                  this.ngZone.run(() => {
                    this.util.setUserLocation(address);
                  })
                }, (err) => {
                  this.defaultLocation(appData);
                });
              }, err => {
                this.defaultLocation(appData);
              }, { enableHighAccuracy: true });
            } else {
              this.defaultLocation(appData);
            }
          }
        }
      });
    }

      this.getClientDetails()
    }

    defaultLocation(appData) {
      if (appData.key_value.fetch_current_location_first == 1) {
        if (appData.default_address && appData.default_address.length) {
          this.util.setUserLocation(appData.default_address[0]);
        } else {
          this.util.setDefaultLocation();
        }
      } else {
        this.util.setDefaultLocation();
      }
    }

    setFavicon(favicon: string) {
      if (isPlatformServer(this.platformId)) { return };
      // let favicon = `https://royo.imgix.net/${icon}?w=64&h=64&fit=crop&auto=format&fm=ico`;
      let link = this.window.document.getElementById('favicon');
      link.setAttribute('href', favicon);
      this.util.setLocalData('favicon', favicon);
    }
  }
