import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartInitComponent } from './cart-init.component';

describe('CartInitComponent', () => {
  let component: CartInitComponent;
  let fixture: ComponentFixture<CartInitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartInitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
