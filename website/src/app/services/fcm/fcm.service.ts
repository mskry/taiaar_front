import { Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { UtilityService } from '../utility/utility.service';
declare const firebase: any;

@Injectable({
  providedIn: 'root'
})
export class FcmService implements OnInit {

  currentMessage = new BehaviorSubject(null);
  childInjector: any;

  constructor(
    private util: UtilityService) { }

  ngOnInit(): void {}

  fcmMessaging(messaging) {
    messaging.onMessage((payload) => {
      if (payload) {
        this.currentMessage.next(payload);
      }
    });
  }

  firebaseInit(FIREBASE_CONFIG) {
    let firebaseConfig = {
      apiKey: FIREBASE_CONFIG.apiKey,
      authDomain: FIREBASE_CONFIG.authDomain,
      databaseURL: FIREBASE_CONFIG.databaseURL,
      projectId: FIREBASE_CONFIG.projectId,
      storageBucket: FIREBASE_CONFIG.storageBucket,
      messagingSenderId: FIREBASE_CONFIG.messagingSenderId,
      appId: FIREBASE_CONFIG.appId,
      measurementId: FIREBASE_CONFIG.measurementId
    };

    firebase.initializeApp(firebaseConfig);    
    let messaging = firebase.messaging();
    this.fcmMessaging(messaging);

    navigator.serviceWorker.register(`firebase-messaging-sw.js?messagingSenderId=${firebaseConfig.messagingSenderId
      }&apiKey=${firebaseConfig.apiKey
      }&authDomain=${firebaseConfig.authDomain
      }&databaseURL=${firebaseConfig.databaseURL
      }&projectId=${firebaseConfig.projectId
      }&storageBucket=${firebaseConfig.storageBucket
      }&appId=${firebaseConfig.appId
      }&measurementId=${firebaseConfig.measurementId
      }`).then((registration) => {
        messaging.useServiceWorker(registration);
        messaging.requestPermission().then(() => {
          this.getToken(messaging);
        }).catch((err) => {
        });
      });

    messaging.onTokenRefresh(() => {
      this.getToken(messaging);
    });
  }

  getToken(messaging) {
    messaging.getToken().then((refreshedToken) => {
      if (refreshedToken) {
        this.util.setLocalData('fcm_token', refreshedToken);
      }
    }).catch((err) => {
    });
  }

}