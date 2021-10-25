import { AppSettings } from 'src/app/shared/models/appSettings.model';
import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appImage]'
})
export class ImageCompressionDirective implements AfterViewInit {

  @Input() url: string;
  @Input() size: string;
  @Input() settings: AppSettings;
  @Input() noCrop: boolean = false

  constructor(
    private el: ElementRef,
    private imageRef: ElementRef
  ) { }

  ngAfterViewInit(): void {
    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
  }
  private canLazyLoad() {
    return window && 'IntersectionObserver' in window;
  }

  private lazyLoadImage() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
        }
      });
    });
    obs.observe(this.el.nativeElement)
   }

  private loadImage() {
    if (!!this.url) {
      let image = this.url.match(/\/([^\/?#]+)[^\/]*$/) ? (this.url.match(/\/([^\/?#]+)[^\/]*$/))[1] : null;
      if (!!image) {
        let size = this.size.split('x');
        const imageLink = `https://royo.imgix.net/${image}?w=${size[0]}&h=${size[1]}${!this.noCrop ? '&fit=crop' : ''}&auto=format`;
        if (this.settings && this.settings.disable_image_force_compression == 1) {
          const img = new Image();
          img.onload = () => this.setImage(imageLink);
          img.onerror = () => { this.setImage(this.url); }
        } else { 
          this.setImage(this.url.startsWith('https://cdn-assets.royoapps.com') || this.url.includes('s3') ?  imageLink : this.url);
        }
      }
    }
  }
  private setImage(src: string) {
    this.imageRef.nativeElement.setAttribute('src', src);
  }
}
