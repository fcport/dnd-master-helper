import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSidePanelComponent } from './document-side-panel.component';

describe('DocumentSidePanelComponent', () => {
  let component: DocumentSidePanelComponent;
  let fixture: ComponentFixture<DocumentSidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentSidePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
