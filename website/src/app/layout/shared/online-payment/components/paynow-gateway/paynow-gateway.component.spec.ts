import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaynowGatewayComponent } from './paynow-gateway.component';

describe('PaynowGatewayComponent', () => {
  let component: PaynowGatewayComponent;
  let fixture: ComponentFixture<PaynowGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaynowGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaynowGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
