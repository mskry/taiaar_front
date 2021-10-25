import { AppSettings } from './../../../../../../shared/models/appSettings.model';
import { UtilityService } from './../../../../../../services/utility/utility.service';
import { Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";
declare const $: any;
@Component({
    selector: 'app-post-likes',
    templateUrl: './post-likes.component.html',
    styleUrls: ['./post-likes.component.scss']
})
export class PostLikesComponent implements OnInit {
    public postLikes: any = [];
    @Input('postLikes')
    set setPostLikes(postLikes) {
        if (postLikes) {
            this.postLikes = postLikes;
        }
    }

    settings: AppSettings;

    @ViewChild('closeModal', { static: false }) closeModal: ElementRef;
    @Output() closePostLikes = new EventEmitter<boolean>();

    

    constructor(private util: UtilityService) {

    }
    ngOnInit() {
        this.util.getSettings.subscribe(settings => {
            if(settings) {
                this.settings = settings;
            }
        }); 

        this.openModal();
    }

    close() {
        this.closeModal.nativeElement.click();
        this.closePostLikes.emit(false);
    }
    trackByPostLikesFn(id, index) {
        return index;
    }
    openModal() {
        $("#auth").modal('show');
    }



}