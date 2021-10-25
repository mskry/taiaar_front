import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrwayGatewayComponent } from './urway-gateway.component';

describe('UrwayGatewayComponent', () => {
  let component: UrwayGatewayComponent;
  let fixture: ComponentFixture<UrwayGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrwayGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrwayGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
