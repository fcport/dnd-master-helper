import {
  Component,
  computed,
  inject,
  model,
  OnInit,
  viewChild,
} from '@angular/core';
import { EngineService } from '../../services/engine.service';
import { CommonModule } from '@angular/common';
import { Doc } from '../../models/db-response.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { jamFeather, jamSkull } from '@ng-icons/jam-icons';
import { DocumentsService } from '../../services/documents.service';
import {
  selectLoadingDocumentsMessage,
  selectTotalLoadingDocuments,
} from '../../store/loading-slice';
import { injectAppSelector } from '../../injectables';
import { FormsModule } from '@angular/forms';
import { DocumentsTableComponent } from '../documents-table/documents-table.component';
import { DocumentSidePanelComponent } from '../document-side-panel/document-side-panel.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-document-loader',
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent,
    FormsModule,
    DocumentsTableComponent,
    DocumentSidePanelComponent,
    TranslocoModule,
  ],
  templateUrl: './document-loader.component.html',
  styleUrl: './document-loader.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('500ms', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
  providers: [
    provideIcons({
      jamSkull,
      jamFeather,
    }),
  ],
})
export class DocumentLoaderComponent implements OnInit {
  engineService = inject(EngineService);
  documentsService = inject(DocumentsService);

  articles = this.documentsService.documentsSortedAlphabetically;
  uploadFileInput = viewChild<HTMLInputElement>('uploadFileInput');

  articlesFiltered = computed(() => {
    return this.articles().filter((doc: Doc) => {
      return (
        doc.title?.toLowerCase().includes(this.filter().toLowerCase()) ||
        doc
          .originalDocumentTitle!.toLowerCase()
          .includes(this.filter().toLowerCase())
      );
    });
  });

  filter = model('');

  loadingDocumentsMessage = injectAppSelector(selectLoadingDocumentsMessage);
  isLoadingDocuments = injectAppSelector(selectTotalLoadingDocuments);
  showPanel = false;

  ngOnInit() {
    this.loadDocuments();
  }

  async uploadDocument(event: any) {
    await this.engineService.onFileSelected(event);
    await this.loadDocuments();
    if (this.uploadFileInput()) {
      this.uploadFileInput()!.value = '';
    }
  }

  async loadDocuments() {
    await this.documentsService.fetchDocuments();
  }

  deleteDocument(params: { _id: string; _rev: string }) {
    const { _id, _rev } = params;
    if (
      confirm(
        'Are you sure you want to delete this document? (Cancel to abort)'
      )
    ) {
      this.documentsService.deleteDocument(_id, _rev).then(() => {
        this.loadDocuments();
      });
    }
  }

  interrupt() {
    this.engineService.interruptOperation();
  }

  async saveDocument(document: Partial<Doc>) {
    await this.documentsService.updateDocument(document);
    this.showPanel = false;
  }

  onCancel() {
    this.showPanel = false;
  }

  editDocument($event: { _id: string; _rev: string }) {
    this.showPanel = true;

    this.documentsService.setSelectedDocument($event);
  }
}
