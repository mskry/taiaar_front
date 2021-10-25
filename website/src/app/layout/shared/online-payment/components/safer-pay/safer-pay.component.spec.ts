import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaferPayComponent } from './safer-pay.component';

describe('SaferPayComponent', () => {
  let component: SaferPayComponent;
  let fixture: ComponentFixture<SaferPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaferPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaferPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
