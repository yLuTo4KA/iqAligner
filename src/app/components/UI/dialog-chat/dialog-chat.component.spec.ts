import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChatComponent } from './dialog-chat.component';

describe('DialogChatComponent', () => {
  let component: DialogChatComponent;
  let fixture: ComponentFixture<DialogChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
