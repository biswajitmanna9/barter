import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationRatingComponent } from './conversation-rating.component';

describe('ConversationRatingComponent', () => {
  let component: ConversationRatingComponent;
  let fixture: ComponentFixture<ConversationRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
