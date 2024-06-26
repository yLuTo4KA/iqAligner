import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeAvatarComponent } from './dialog-change-avatar.component';

describe('DialogChangeAvatarComponent', () => {
  let component: DialogChangeAvatarComponent;
  let fixture: ComponentFixture<DialogChangeAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogChangeAvatarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogChangeAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
