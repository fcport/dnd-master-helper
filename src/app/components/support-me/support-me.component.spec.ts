import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMeComponent } from './support-me.component';

describe('SupportMeComponent', () => {
  let component: SupportMeComponent;
  let fixture: ComponentFixture<SupportMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportMeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
