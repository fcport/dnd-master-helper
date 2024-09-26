import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLoaderComponent } from './document-loader.component';

describe('DocumentLoaderComponent', () => {
  let component: DocumentLoaderComponent;
  let fixture: ComponentFixture<DocumentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
