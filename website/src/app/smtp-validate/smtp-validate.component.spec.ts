import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtpValidateComponent } from './smtp-validate.component';

describe('SmtpValidateComponent', () => {
  let component: SmtpValidateComponent;
  let fixture: ComponentFixture<SmtpValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmtpValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtpValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
