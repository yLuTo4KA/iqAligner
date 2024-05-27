import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeUserInfoComponent } from './dialog-change-user-info.component';

describe('DialogChangeUserInfoComponent', () => {
  let component: DialogChangeUserInfoComponent;
  let fixture: ComponentFixture<DialogChangeUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogChangeUserInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogChangeUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
