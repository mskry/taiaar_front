import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Safe2payGatewayComponent } from './safe2pay-gateway.component';

describe('Safe2payGatewayComponent', () => {
  let component: Safe2payGatewayComponent;
  let fixture: ComponentFixture<Safe2payGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Safe2payGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Safe2payGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
