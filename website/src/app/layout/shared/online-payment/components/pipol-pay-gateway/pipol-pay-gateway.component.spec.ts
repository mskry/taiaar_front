import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipolPayGatewayComponent } from './pipol-pay-gateway.component';

describe('PipolPayGatewayComponent', () => {
  let component: PipolPayGatewayComponent;
  let fixture: ComponentFixture<PipolPayGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipolPayGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipolPayGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
