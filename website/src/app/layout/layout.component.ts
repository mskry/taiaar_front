import { ApiUrl } from './../core/apiUrl';
import { GlobalVariable } from './../core/global';
import { environment } from './../../environments/environment';
import { MessagingService } from './../services/messaging/messaging.service';
import { LocationService } from './../services/location/location.service';
import { AppSettings } from "./../shared/models/appSettings.model";
import { StyleVariables } from "./../core/theme/styleVariables.model";
import { StyleConstants } from "./../core/theme/styleConstants.model";
import { UtilityService } from "./../services/utility/utility.service";
import { HttpService } from "./../services/http/http.service";
import { Component, OnInit, HostListener, Inject, PLATFORM_ID, NgZone, AfterViewInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AppHandler } from "./../shared/models/appHandler.model";
import { ApiKeys } from "../shared/models/apiKeys.model";
import { Subscription } from "rxjs";
import { WINDOW } from "../services/window/window.service";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { FcmService } from '../services/fcm/fcm.service';
import { FirebaseAnalyticsService } from '../services/firebase-analytics/firebase-analytics.service';
import { UserService } from '../services/user/user.service';
import { AuthService } from 'angularx-social-login';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"]
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  body: StyleConstants;
  style: StyleVariables;
  settings: AppSettings;
  handler: AppHandler;
  apiKeys: ApiKeys;
  nav_fixed: boolean = false;
  dialogFlowData: any;
  hiJiffy_link: string = '';
  layout_background = '';
  isLoading: boolean = true;

  styleSubscription: Subscription;
  getDataSubscription: Subscription;
  settingSubscription: Subscription;
  socialUserSubscription: Subscription;
  locationSubscription: Subscription;
  keySubscription: Subscription;

  fix_search: boolean = false;

  rtl: 0 | 1 = 0;
  is_instance_selection: boolean = environment.INSTANCE_SELECTION;

  isMobile: boolean = GlobalVariable.IS_MOBILE;
  userSubscription: Subscription;
  userData: any;

  isBrowser: boolean = false;

  constructor(
    private ngZone: NgZone,
    private http: HttpService,
    public util: UtilityService,
    private location: LocationService,
    public router: Router,
    private firebaseMessageService: FcmService,
    private message: MessagingService,
    private user: UserService,
    private socialAuthService: AuthService,
    @Inject(DOCUMENT) private document,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: string,
    private firebaseAnalyticsSvc: FirebaseAnalyticsService,
    private meta: Meta
  ) {
    this.body = new StyleConstants();
    this.style = new StyleVariables();
  }

  @HostListener("window:scroll", ["$event"])
  onScroll() {
    if (Math.ceil(this.window.pageYOffset) >= 180) this.nav_fixed = true;
    else this.nav_fixed = false;

    if (Math.ceil(this.window.pageYOffset) >= 540) this.fix_search = true;
    else this.fix_search = false;
  }

  ngOnInit() {
    this.styleSubscription = this.util.getStyles.subscribe(style => {
      this.style = style;
      this.body.fontFamily = style.fontFamily;
      this.body.backgroundColor = style.backgroundColor;
    });

    this.socialUserSubscription = this.user.logoutSocialUser
      .subscribe(logout => {
        if (logout) {
          this.socialAuthService.signOut();
          this.user.logoutSocialUser.next(false);
        }
      });

    this.userSubscription = this.user.currentUser
      .subscribe(user => {
        if (!!user && user['access_token']) {
          this.userData = user;
          this.getDialogGlowAgentToken();
        } else {
          this.userData = null;
        }
      });

    this.util.loading.subscribe(loading => {
      this.isLoading = loading;
    });

    this.settingSubscription = this.util.getSettings.subscribe(
      (settings: AppSettings) => {
        if (!this.settings && settings) {
          this.settings = settings;
          if (settings.app_type == 1 && (!settings.default_address || !settings.default_address.latitude || !settings.default_address.longitude) && !this.util.getLocalData('user_location', true)) {
            this.router.navigate(['/address']);
            return;
          }
          if (this.settings.app_type != 1) {
            this.util.callGetData.next(true);
          }
          if (this.settings.app_type == 1 && this.settings.header_theme == 2 && this.settings.default_address.latitude == this.util.handler.latitude && this.settings.default_address.longitude == this.util.handler.longitude) {
            this.detectLocation();
          }
          if (this.settings.placeholder['website_background'].web) {
            this.layout_background = `url(${this.settings.placeholder['website_background'].web})`;
          }

          if (this.settings.selected_template == 3) {
            this.body.backgroundColor = 'transparent';
          }

          this.openInstanceSelection(false);
        }
        if (isPlatformBrowser(this.platformId)) {
          (async () => {
            await this.delay(2000);
            document.getElementById("splash_screen").style.display = "none";
          })();
        }
      }
    );

    let langData = this.util.getLocalData('langData', true) ? this.util.getLocalData('langData', true) : {};
    this.util.handler.languageId = langData['id'] || this.util.handler.languageId;
    this.util.handler.rtl = langData['rtl'] || this.util.handler.rtl;
    setTimeout(() => { this.rtl = this.util.handler.rtl }, 0);

    this.keySubscription = this.util.getKeys.subscribe((key: ApiKeys) => {
      this.addGoogleSearchMetaTag(key);
      this.gtmInit(key);

      if (isPlatformBrowser(this.platformId)) {
        this.isBrowser = true;
        this.facebookPixel(key);
        this.siteScoutPixel(key);
        this.initializeFirebase(key);
        this.tawkInit(key);
        this.hiJiffyInit(key);
        this.oribitInit(key);
        this.pinterestMeta(key);
        this.zendeskInit(key);
      }
    });

    if (GlobalVariable.UNIQUE_ID === 'scrubble_0566') {
      this.structuredData();
    }

  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.firebaseAnalyticsSvc.firebaseAnalyticsEvents('first_open', 'first_open');
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  initializeFirebase(key) {
    if (!!key && key.fcm_config.apiKey) {
      ['https://www.gstatic.com/firebasejs/7.6.0/firebase.js', 'https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js', 'https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js'].forEach(js => {
        let script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.src = js;
        this.document.getElementsByTagName('head')[0].appendChild(script);
      });

      (async () => {
        await this.delay(1000);
        this.firebaseMessageService.firebaseInit(key.fcm_config);
      })();
    }
  }

  pinterestMeta(key) {
    if (!!key && key.pinterest_content_id) {
      document.querySelector('meta[name="p:domain_verify"]').setAttribute("content", key.pinterest_content_id);
    }
  }

  segment(key) {
    if (!!key && key.segment_key) {
      (function () {
        var analytics = window['analytics'] = window['analytics'] || [];
        if (analytics.initialize) return;
        if (analytics.invoked) {
          if (window.console && console.error) {
            console.error('Segment snippet included twice.');
          }
          return;
        }
        analytics.invoked = true;
        analytics.methods = [
          'trackSubmit',
          'trackClick',
          'trackLink',
          'trackForm',
          'pageview',
          'identify',
          'reset',
          'group',
          'track',
          'ready',
          'alias',
          'debug',
          'page',
          'once',
          'off',
          'on',
          'addSourceMiddleware',
          'addIntegrationMiddleware',
          'setAnonymousId',
          'addDestinationMiddleware'
        ];
        analytics.factory = function (method) {
          return function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            analytics.push(args);
            return analytics;
          };
        };
        for (var i = 0; i < analytics.methods.length; i++) {
          var key = analytics.methods[i];
          analytics[key] = analytics.factory(key);
        }
        analytics.load = function (key, options) {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.src = 'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js';
          var first = document.getElementsByTagName('script')[0];
          first.parentNode.insertBefore(script, first);
          analytics._loadOptions = options;
        };
        analytics.SNIPPET_VERSION = '4.1.0';
        analytics.load(key.segment_key);//OWDhPdp8cx1OdKc3OyiMTMhdtPSQUwdp
        analytics.page();
      })();
    }
  }

  facebookPixel(key) {
    if (!!key && key.facebook_pixel_id) {
      const scriptLink = this.document.createElement('script');
      scriptLink.innerText = `!function(e,t,n,o,c,a){e.fbq||(o=e.fbq=function(){o.callMethod?o.callMethod.apply(o,arguments):o.queue.push(arguments)},e._fbq||(e._fbq=o),(o.push=o).loaded=!0,o.version="2.0",o.queue=[],(c=t.createElement(n)).async=!0,c.src="https://connect.facebook.net/en_US/fbevents.js",(a=t.getElementsByTagName(n)[0]).parentNode.insertBefore(c,a))}(window,document,"script"),fbq("init","${key.facebook_pixel_id}"),fbq("track","PageView");`;
      document.getElementsByTagName('head')[0].appendChild(scriptLink);

      var noscript = document.createElement('noscript');
      let img = document.createElement('img');
      img.id = 'facebook-pxl';
      img.style.display = "none";
      img.style.height = "0";
      img.style.width = "0";
      img.src = `https://www.facebook.com/tr?id=${key.facebook_pixel_id}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    }
  }

  oribitInit(key) {
    if (!!key && key.oribi_analytics) {
      !function (b, o, n, g, s, r, c) {
        if (b[s]) return; b[s] = {};
        b[s].scriptToken = key.oribi_analytics; //"XzEwNTA0NTA1NTg";
        b[s].callsQueue = [];
        b[s].api = function () {
          b[s].callsQueue.push(arguments);
        };
        r = o.createElement(n);
        c = o.getElementsByTagName(n)[0];
        r.async = 1; r.src = g; r.id = s + n;
        c.parentNode.insertBefore(r, c);
      }
      const scriptLink = this.document.createElement('script');
      scriptLink.id = `oribi_analytics`;
      scriptLink.setAttribute("type", "application/javascript");
      scriptLink.setAttribute("src", `https://cdn.oribi.io/${key.oribi_analytics}/oribi.js`);
      // scriptLink.setAttribute("text", text);
      document.getElementsByTagName('head')[0].appendChild(scriptLink);
    }
  }

  zendeskInit(key) {
    if (!!key && key.zendesk_key) {
      let script = this.document.createElement('script');
      script.id = 'ze-snippet';
      script.type = 'text/javascript';
      script.src = `https://static.zdassets.com/ekr/snippet.js?key=${key.zendesk_key}`;
      this.document.getElementsByTagName('head')[0].appendChild(script);
    }
  }

  tawkInit(key) {
    if (!!key && key.tawk_site_id) {

      let is_default = key.tawk_site_id.split('/').length > 1 ? false : true;

      var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
      (() => {
        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = !is_default ? `https://embed.tawk.to/${key.tawk_site_id}` : `https://embed.tawk.to/${key.tawk_site_id}/default`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
      })();

      if (GlobalVariable.IS_MOBILE) {
        setTimeout(() => {
          if (this.document.getElementById('tawkchat-container')) {
            this.document.getElementById('tawkchat-container').style.setProperty("bottom", "50px", "important");
          }
        }, 2000);
      }
    }
  }

  hiJiffyInit(key) {
    if (!!key && key.hijiffy_token) {
      window['HiJiffyWidget'] = window['HiJiffyWidget'] || {};
      window['HiJiffyWidget'].Token = key.hijiffy_token; //z9e8wNcDLcw7Vv
      window['HiJiffyWidget'].AppId = 'hj-' + Math.random().toString(36).substr(2, 16);

      (function (doc, script, time, el) {
        time = Math.floor(new Date().getTime() / 60000);
        el = doc.createElement('div');
        el.id = window['HiJiffyWidget'].AppId;
        doc.getElementsByTagName('body')[0].appendChild(el);

        script = doc.createElement('script');
        script.async = true;
        script.type = 'text/javascript';
        script.src = 'https://widget.hijiffy.com/build.js?t=' + time;
        doc.getElementsByTagName('head')[0].appendChild(script);
      }(document));
    }
  }

  addGoogleSearchMetaTag(key) {
    if (!!key && key.google_search_content_id) {
      this.meta.addTags([
        { name: 'google-site-verification', content: key.google_search_content_id }
      ]);
    }
  }

  gtmInit(key) {
    if (!!key && key.gtm) {
      const document_head = document.getElementsByTagName('head')[0];

      const scriptLink1 = this.document.createElement('script');
      scriptLink1.setAttribute("type", "application/javascript");
      scriptLink1.async = true;
      scriptLink1.setAttribute("src", `https://www.googletagmanager.com/gtag/js?id=${key.google_property_id}`);
      document_head.appendChild(scriptLink1);

      const scriptLink2 = this.document.createElement('script');
      // scriptLink2.innerText = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', ${key.google_property_id}, {'optimize_id': ${key.gtm}});`;
      scriptLink2.innerText = `function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config",${key.google_property_id});`;
      document_head.appendChild(scriptLink2);

      var scriptLink3 = document.createElement('noscript');
      var iframe = document.createElement('iframe');
      iframe.style.display = "none";
      iframe.style.height = "0";
      iframe.style.width = "0";
      iframe.style.visibility = "hidden";
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${(key.gtm)}`;
      scriptLink3.appendChild(iframe);
      document.body.appendChild(scriptLink3);

      const scriptLink4 = this.document.createElement('script');
      scriptLink4.innerText = `!function(e,t,a,n){e[n]=e[n]||[],e[n].push({"gtm.start":(new Date).getTime(),event:"gtm.js"});var g=t.getElementsByTagName(a)[0],m=t.createElement(a);m.async=!0,m.src="https://www.googletagmanager.com/gtm.js?id=${key.gtm}",g.parentNode.insertBefore(m,g)}(window,document,"script","dataLayer");`
      document_head.appendChild(scriptLink4);
    }
  }

  siteScoutPixel(key: ApiKeys) {
    if (!!key && key.sitescout_pixel_id) {
      let img = document.createElement('img');
      img.style.position = "absolute";
      img.style.left = "-150px";
      img.height = 1;
      img.width = 1;
      img.src = `https://pixel.sitescout.com/iap/${key.sitescout_pixel_id}`;
      document.body.appendChild(img);
    }
  }

  structuredData() {
    this.meta.addTag({ property: 'og:locale', content: "en" });
    this.meta.addTag({ property: 'og:site_name', content: "scrubble.in/" });
    this.meta.addTag({ property: 'og:url', content: "https://scrubble.in/" });
    this.meta.addTag({ property: 'og:title', content: "Home Cleaning Services in Hyderabad|Deep Cleaning - Scrubble" });
    this.meta.addTag({ property: 'og:description', content: "Scrubble, the best home Cleaning Services in Hyderabad offers top-notch Home Cleaning Services,Pest Control &amp; Disinfection Services.House Deep Cleaning Services" });
    this.meta.addTag({ property: 'og:image', content: "https://cdn-assets.royoapps.com/profilePic_1597819425342.png", alt: "scrubble" });
    this.meta.addTag({ property: 'fb:app_id', content: "3508444452546623" });
    this.meta.addTag({ property: 'og:type', content: "website" });
    this.meta.addTag({ name: 'viewport', content: "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" });

    const document_head = document.getElementsByTagName('head')[0];

    const script1 = this.document.createElement('script');
    script1.setAttribute("type", "application/ld+json");
    script1.innerText = `{"@context":"http://schema.org","@type":"WebSite","url":"https://scrubble.in/ ","potentialAction":{"@type":"SearchAction","target":" https://scrubble.in/{search_term_string}","query-input":"required name=search_term_string"}}`;
    document_head.appendChild(script1);

    const script2 = this.document.createElement('script');
    script2.setAttribute("type", "application/ld+json");
    script2.innerText = `{"@context":"http://schema.org","@type":"LocalBusiness","name":"Scrubble","url":"https://scrubble.in/","sameAs":["https://www.facebook.com/scrubbleindia.in","https://www.instagram.com/scrubbleindia/"],"logo":"https://cdn-assets.royoapps.com/profilePic_1597819425342.png","legalName":"Scrubble","address":[{"@type":"PostalAddress","addressCountry":"India","addressLocality":"Hyderabad","addressRegion":"Telangana","postalCode":"500081","streetAddress":"Plot No# 2, Thanda, 58/1/125, Ayyappa Society, Chanda Naik Nagar, Madhapur"}],"contactPoint":[{"@type":"ContactPoint","telephone":"(+91) 9177323232","contactType":"Customer Service","contactOption":"TollFree","areaServed":"IN"}],"openingHoursSpecification":{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"00:00","closes":"23:59"}}`;
    document_head.appendChild(script2);

    const script3 = this.document.createElement('script');
    script3.setAttribute("type", "application/ld+json");
    script3.innerText = `{"@context":"https://schema.org/","@type":"WebPage","name":"Home Cleaning Services in Hyderabad|Deep Cleaning - Scrubble","speakable":{"@type":"SpeakableSpecification","xpath":["/html/head/title","/html/head/meta[@name='Scrubble, the best home Cleaning Services in Hyderabad offers top-notch Home Cleaning Services,Pest Control &amp; Disinfection Services.House Deep Cleaning Services']/@content"]},"url":"https://scrubble.in/"}`;
    document_head.appendChild(script3);
  }

  /****************** Chat Bot ******************/
  getDialogGlowAgentToken() {
    if (isPlatformBrowser(this.platformId) && !!GlobalVariable.DIALOGFLOW_PROJECT_ID) {
      this.http.getData(ApiUrl.getDialogFlowToken, {})
        .subscribe(response => {
          if (!!response && response.data) {
            this.getDialogFlowAgent(response.data.token);
          }
        });
    }
  }

  getDialogFlowAgent(token) {
    this.http.getDialogFlowAgent(token)
      .subscribe(response => {
        if (response) {
          this.dialogFlowData = {
            access_token: token,
            agent: response
          };
        }
      });
  }

  openChatBot() {
    this.document.getElementById("chatBotWindow").style.bottom = "0%";
  }

  detectLocation() {
    this.location.openTracker().subscribe((address) => {
      this.ngZone.run(() => {
        this.util.setUserLocation(address);
        this.router.navigate(['/']);
      })
    }, (err) => {
      // this.message.alert('error', err.message);
    });
  }

  openInstanceSelection(isChanging: boolean) {
    if (this.is_instance_selection && this.settings.is_instance_selection) {
      if (isChanging) {
        this.message.backendInstance();
      }
      else {
        if (localStorage.getItem('current_selected_instance')) {
          environment.BASE_API_URL = GlobalVariable.INSTANCE_OPTIONS[localStorage.getItem('current_selected_instance')].user;
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (!!this.styleSubscription) this.styleSubscription.unsubscribe();
    if (!!this.getDataSubscription) this.getDataSubscription.unsubscribe();
    if (!!this.settingSubscription) this.settingSubscription.unsubscribe();
    if (!!this.socialUserSubscription) this.socialUserSubscription.unsubscribe();
    if (!!this.locationSubscription) this.locationSubscription.unsubscribe();
    if (!!this.keySubscription) this.keySubscription.unsubscribe();
  }

}
