import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCheckMoreComponent } from './dialog-check-more.component';

describe('DialogCheckMoreComponent', () => {
  let component: DialogCheckMoreComponent;
  let fixture: ComponentFixture<DialogCheckMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCheckMoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCheckMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
