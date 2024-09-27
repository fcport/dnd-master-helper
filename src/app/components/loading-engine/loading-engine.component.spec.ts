import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingEngineComponent } from './loading-engine.component';

describe('LoadingEngineComponent', () => {
  let component: LoadingEngineComponent;
  let fixture: ComponentFixture<LoadingEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingEngineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
