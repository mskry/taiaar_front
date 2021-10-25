import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNotificationsComponent } from './chat-notifications.component';

describe('ChatNotificationsComponent', () => {
  let component: ChatNotificationsComponent;
  let fixture: ComponentFixture<ChatNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
