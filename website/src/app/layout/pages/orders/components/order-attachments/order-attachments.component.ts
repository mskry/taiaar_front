import { AppSettings } from './../../../../../shared/models/appSettings.model';
import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MultimediaViewerComponent } from './../../../../../layout/shared/layout-shared/components/multimedia-viewer/multimedia-viewer.component';

@Component({
  selector: 'app-order-attachments',
  templateUrl: './order-attachments.component.html',
  styleUrls: ['./order-attachments.component.scss']
})
export class OrderAttachmentsComponent implements OnInit {

  @Input('order')
  set orderData(order) {
    if (order) {
      this.order = order;
      this.setPrescImages(this.order);
    }
  }
  @Input() settings: AppSettings;

  public order: any = {};
  public prescription_image_arr: any = [];

  constructor(
    public dialogService: DialogService
  ) { }

  ngOnInit() {
  }






  setPrescImages(order) {
    if (order.pres_image1) {
      var prescription_image_arr_obj = { url: '', type: '' }
      prescription_image_arr_obj.url = order.pres_image1;
      if (order.pres_image1.split('.').pop() === 'pdf') {
        prescription_image_arr_obj.type = 'pdf';
      }
      else {
        prescription_image_arr_obj.type = 'image';
      }
      this.prescription_image_arr.push(prescription_image_arr_obj);
    }
    if (order.pres_image2) {
      var prescription_image_arr_obj = { url: '', type: '' }
      prescription_image_arr_obj.url = order.pres_image2;
      if (order.pres_image1.split('.').pop() === 'pdf') {
        prescription_image_arr_obj.type = 'pdf';
      }
      else {
        prescription_image_arr_obj.type = 'image';
      }
      this.prescription_image_arr.push(prescription_image_arr_obj);
    }
    if (order.pres_image3) {
      var prescription_image_arr_obj = { url: '', type: '' }
      prescription_image_arr_obj.url = order.pres_image3;
      if (order.pres_image1.split('.').pop() === 'pdf') {
        prescription_image_arr_obj.type = 'pdf';
      }
      else {
        prescription_image_arr_obj.type = 'image';
      }
      this.prescription_image_arr.push(prescription_image_arr_obj);
    }
    if (order.pres_image4) {
      var prescription_image_arr_obj = { url: '', type: '' }
      prescription_image_arr_obj.url = order.pres_image4;
      if (order.pres_image1.split('.').pop() === 'pdf') {
        prescription_image_arr_obj.type = 'pdf';
      }
      else {
        prescription_image_arr_obj.type = 'image';
      }
      this.prescription_image_arr.push(prescription_image_arr_obj);
    }
    if (order.pres_image5) {
      var prescription_image_arr_obj = { url: '', type: '' }
      prescription_image_arr_obj.url = order.pres_image5;
      if (order.pres_image1.split('.').pop() === 'pdf') {
        prescription_image_arr_obj.type = 'pdf';
      }
      else {
        prescription_image_arr_obj.type = 'image';
      }
      this.prescription_image_arr.push(prescription_image_arr_obj);
    }

  }







  viewAttachment(image: any) {
    if (image.type == 'image') {
      const dialogRef = this.dialogService.open(MultimediaViewerComponent, {
        dismissableMask: true,
        showHeader: false,
        transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
        data: {
          url: image.url,
          type: 'image'
        }
      })
      dialogRef.onClose.subscribe(() => {
      })
    }
    else {
      window.open(image.url);
    }
  }

}
