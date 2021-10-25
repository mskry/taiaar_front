import { AppSettings } from './../../../../shared/models/appSettings.model';
import { StyleVariables } from './../../../../core/theme/styleVariables.model';
import { UtilityService } from './../../../../services/utility/utility.service';
import { Component, Input, Inject, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { GlobalVariable } from 'src/app/core/global';

export class Language {
  id: number;
  language_code: string;
  language_name: string;
  rtl: number
}

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnChanges {

  @Input() style: StyleVariables;
  @Input() settings: AppSettings;
  selectedLang: Language;
  langData: Array<Language> = [];

  constructor(
    private util: UtilityService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document
  ) {
    this.langData.push({
      id: 14,
      language_code: "en",
      language_name: "English",
      rtl: 0
    });
  }

  setLanguage(langData: any) {
    this.util.handler.languageId = langData['id'] || this.util.handler.languageId;
    this.util.handler.rtl = langData['rtl'];
    this.selectedLang = langData;
    this.translate.setDefaultLang(langData['language_code']);
    this.document.getElementsByTagName('html')[0].setAttribute('lang', langData['language_code']);
    this.util.setLocalData('langData', langData, true);
  }

  ngOnChanges() {
    if (!!this.settings.secondary_language) {
      let lang_obg = new Language();
      switch (this.settings.secondary_language) {
        case 'es':
          lang_obg.id = 15;
          lang_obg.language_code = 'es';
          lang_obg.language_name = 'Spanish (Español)';
          lang_obg.rtl = 0;
          break;

        case 'ar':
          lang_obg.id = 15;
          lang_obg.language_code = 'ar';
          lang_obg.language_name = GlobalVariable.UNIQUE_ID == 'lubanah_0586' ? 'عربي' : 'Arabic (عربى)';
          lang_obg.rtl = 1;
          break;

        case 'fr':
          lang_obg.id = 15;
          lang_obg.language_code = 'fr';
          lang_obg.language_name = 'French (Français)';
          lang_obg.rtl = 0;
          break;

        case 'ml':
          lang_obg.id = 15;
          lang_obg.language_code = 'ml';
          lang_obg.language_name = 'Malayalam (മലയാളം)';
          lang_obg.rtl = 0;
          break;

        case 'alb':
          lang_obg.id = 15;
          lang_obg.language_code = 'alb';
          lang_obg.language_name = 'Albanian (Shqiptare)';
          lang_obg.rtl = 0;
          break;

        case 'th':
          lang_obg.id = 15;
          lang_obg.language_code = 'th';
          lang_obg.language_name = 'Thai';
          lang_obg.rtl = 0;
          break;
      }

      this.langData.push(lang_obg);
      let langObj = this.util.getLocalData('langData', true);
      if (this.settings.default_language == 1 && !langObj) {
        this.setLanguage(this.langData[1]);
      } else {
        this.setLanguage(langObj || this.langData[0]);
      }
      // if (this.settings.default_language == 1) {
      //   this.setLanguage(this.langData[1]);
      // } else {
      //   this.setLanguage(this.langData[0] || langObj);
      // }
    }
  }
  trackByFn(id, index) {
    return index;
  }
  trackBylangFn(id, index) {
    return index;
  }
  languageSelect(langData: any) {
    this.util.setLocalData('langData', langData, true);
    this.util.window.location.reload();
    // this.ngOnChanges();
    // setTimeout(() => {
    //   this.util.window.location.reload();
    // }, 1000);
  }

}
