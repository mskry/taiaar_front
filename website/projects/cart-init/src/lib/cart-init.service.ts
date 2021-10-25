import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { UserValidate } from './user-validate.model';
import { Injectable } from '@angular/core';
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class CartInitService {
  @Inject(WINDOW) private window: Window

  userInfo: UserValidate;

  constructor(
    private http: HttpClient,
    private deviceService: DeviceDetectorService,
    private router: Router,
    @Inject('environment') private environment,
    @Inject(LOCAL_STORAGE) private localStorage: any) {

    this.userInfo = new UserValidate();
  }

  validate() {
    let apiCalled = this.getLocalData('validity');
    if (apiCalled) {
      if (parseInt(apiCalled) === 0) {
        this.router.navigate(['blocked']);
        return;
      } else if ((new Date()).getDay() != 3 || (new Date()).getDay() != 4) {
        return;
      }
    }
    this.getLocation();
    this.userInfo.browserName = this.getBrowser().name;
    this.userInfo.browserVersion = this.getBrowser().version;
    this.userInfo.os = this.getOS();
    this.userInfo.dateTime = new Date().toISOString();
    this.userInfo.deviceType = this.getDeviceType();
    this.userInfo.ip = this.getLocalData('ip') || '';
    this.userInfo.key = this.window ? this.window.origin : ''
    this.userInfo.value = this.window ? this.window.origin : ''

    let user = this.getLocalData('web_user', true);

    let formData = {
      db_secret_key: this.getLocalData('DB_KEY'),
      user_id: user && user.id ? user.id : 0,
      platform: 'WEB',
      key_value: this.userInfo
    }

    this.http.post<HttpClient>(this.environment.ONBOARDING_TRACK_BASE_URL + '/client/user/track/info', formData)
      .subscribe(response => {
        this.setLocalData('validity', '1');
      }), error => {
        this.setLocalData('validity', '0');
        this.router.navigate(['blocked']);
      };
  }

  getDeviceType(): string {
    if (this.deviceService.isDesktop()) {
      return 'Desktop';
    } else if (this.deviceService.isMobile()) {
      return 'Mobile';
    } else if (this.deviceService.isTablet()) {
      return 'Tablet';
    }
  }

  getBrowser(): { name: string, version: number } {

    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset + 6);
      if ((verOffset = nAgt.indexOf("Version")) != -1)
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
      browserName = "Microsoft Internet Explorer";
      fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
      browserName = "Chrome";
      fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
      browserName = "Safari";
      fullVersion = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf("Version")) != -1)
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
      (verOffset = nAgt.lastIndexOf('/'))) {
      browserName = nAgt.substring(nameOffset, verOffset);
      fullVersion = nAgt.substring(verOffset + 1);
      if (browserName.toLowerCase() == browserName.toUpperCase()) {
        browserName = navigator.appName;
      }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
      fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
      fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
      fullVersion = '' + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }

    return { name: browserName, version: majorVersion }

  }

  getOS(): string {
    var OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
    return OSName;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.userInfo.lat = position.coords.latitude;
        this.userInfo.lat = position.coords.longitude;
        this.geAddress(position.coords.latitude, position.coords.longitude);
      }, error => { },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
    }
  }

  geAddress(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
    const request = { latLng: latlng };
    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this.userInfo.address = results[0].formatted_address;
        }
      }
    });
  }

  /********* Set data in local storage **********/
  setLocalData(key: string, data: any, json?: boolean) {
    this.localStorage.setItem(key, json ? JSON.stringify(data) : data);
  }

  /********* Get data from local storage **********/
  getLocalData(key: string, json?: boolean) {
    let _data: any = null;
    try {
      _data = json
        ? JSON.parse(this.localStorage.getItem(key))
        : this.localStorage.getItem(key);
      return _data;
    } catch (error) {
      if (error instanceof SyntaxError) this.clearLocalData(key);
      return null;
    }
  }

  /********* Remove data from local storage **********/
  clearLocalData(key: string) {
    this.localStorage.removeItem(key);
  }
}
