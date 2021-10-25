import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AppSettings } from '../../shared/models/appSettings.model';
import { UtilityService } from '../utility/utility.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAnalyticsService {

    constructor(
        private analytics: AngularFireAnalytics,
        private util: UtilityService,
        @Inject(PLATFORM_ID) private platformId: string,

    ) { }

    firebaseAnalyticsEvents(key: string, eventDetails: any) {
        if (isPlatformBrowser(this.platformId)) {
            this.util.getSettings.subscribe((settings: AppSettings) => {
                if (settings && settings.isFirebaseAnalytics === "1") {
                    this.analytics.logEvent(key, {
                        'firsttimeuser': true,
                        'firedEvent': eventDetails
                    });
                }
            });
        }
    }
}