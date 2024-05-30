import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplomeComponent } from './diplome.component';

describe('DiplomeComponent', () => {
  let component: DiplomeComponent;
  let fixture: ComponentFixture<DiplomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiplomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiplomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
