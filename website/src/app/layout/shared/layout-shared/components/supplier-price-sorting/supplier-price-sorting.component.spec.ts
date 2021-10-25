import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPriceSortingComponent } from './supplier-price-sorting.component';

describe('SupplierPriceSortingComponent', () => {
  let component: SupplierPriceSortingComponent;
  let fixture: ComponentFixture<SupplierPriceSortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierPriceSortingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPriceSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
