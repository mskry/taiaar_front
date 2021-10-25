import { Component, OnInit, OnDestroy, Inject, Input } from '@angular/core';
import { AppSettings } from 'src/app/shared/models/appSettings.model';

@Component({
    selector: 'app-news-letter',
    templateUrl: './news-letter.component.html',
    styleUrls: ['./news-letter.component.scss']
})
export class NewsLetterComponent implements OnInit, OnDestroy {

    @Input() settings: AppSettings;

    constructor(

    ) {

    }

    ngOnInit() {

    }

    ngOnDestroy() {
    }
}
