import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Stripe3DGatewayComponent } from './stripe-3d-gatewaycomponent';

describe('Stripe3DGatewayComponent', () => {
  let component: Stripe3DGatewayComponent;
  let fixture: ComponentFixture<Stripe3DGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Stripe3DGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Stripe3DGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
