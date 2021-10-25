import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWiseProductsComponent } from './category-wise-products.component';

describe('CategoryWiseProductsComponent', () => {
  let component: CategoryWiseProductsComponent;
  let fixture: ComponentFixture<CategoryWiseProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryWiseProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryWiseProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
