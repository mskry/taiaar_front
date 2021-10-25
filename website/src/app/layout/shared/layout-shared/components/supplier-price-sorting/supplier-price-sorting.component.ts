import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StyleVariables } from 'src/app/core/theme/styleVariables.model';
import { Options } from '@angular-slider/ngx-slider';
declare const $: any;

interface PriceFiterObj {
  isPreparationTime: number
  preparationTime: { min: number, max: number },
  freeDeliveryValue: number,
  isSearch: boolean
};
@Component({
  selector: 'app-supplier-price-sorting',
  templateUrl: './supplier-price-sorting.component.html',
  styleUrls: ['./supplier-price-sorting.component.scss']
})
export class SupplierPriceSortingComponent implements OnInit, OnChanges {
  @Input() style: StyleVariables;
  @Input() FilterValue: PriceFiterObj;
  @Output() onSort: EventEmitter<PriceFiterObj> = new EventEmitter<PriceFiterObj>();
  preparationTimeControl = new FormControl();
  sliderValue = { min: 0, max: 100 }
  freeDelivery = 0;
  isChecked = false;
  preparationTimeValue = 0;
  isPreparationChecked = false;
  showPreparationTimeRange = false;
  minPrepTime: number = 0;
  preparationTime: { min: number, max: number };
  freeDeliveryValue = 0;
  isShowing: boolean = false;
  value: number = 40;
  highValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 100
  };
  filterForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.preparationTimeControl.valueChanges.subscribe(value => {
      value ? this.preparationTimeValue = 1 : this.preparationTimeValue = 0;
      value ? this.showPreparationTimeRange = true : this.showPreparationTimeRange = false;
     
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.FilterValue.freeDeliveryValue === 1 ? this.isChecked = true : this.isChecked = false;
    this.FilterValue.isPreparationTime === 1 ? this.showPreparationTimeRange = true : this.isPreparationChecked = false;
    this.FilterValue.isPreparationTime === 1 ? this.preparationTimeControl.setValue(true) : this.preparationTimeControl.setValue(false) 
  }
  ngOnInit(): void {
    this.openModal();
  }
  showFilter() {
    this.isShowing = !this.isShowing;
  }
  openModal() {
    this.filterForm = this.formBuilder.group({
      sliderValue: [[this.FilterValue.preparationTime.min, this.FilterValue.preparationTime.max]],
      freeDelivery: this.isChecked ? 1 : 0
    })
    $("#filter_preparation").modal('show');
  }
  onSubmit() {
    $("#filter_preparation").modal('hide');
    const range = this.filterForm.get('sliderValue').value;
    const Obj: PriceFiterObj = {
      isPreparationTime: this.preparationTimeValue,
      preparationTime: { min: range[0] ? range[0] : 0, max: range[1] ? range[1] : 100 },
      freeDeliveryValue: this.filterForm.get('freeDelivery').value ? 1 : 0,
      isSearch: true
    };
    this.onSort.emit(Obj);
  }
  closeFilterModal() {
    const Obj: PriceFiterObj = {
      isPreparationTime: this.preparationTimeValue,
      preparationTime: { min: 0, max: 100 },
      freeDeliveryValue: this.filterForm.get('freeDelivery').value ? 1 : 0,
      isSearch: false
    };
    this.onSort.emit(Obj);
    $("#filter_preparation").modal('hide');
  }
}
