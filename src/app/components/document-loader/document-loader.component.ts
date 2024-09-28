import {Component, inject, OnInit, signal} from '@angular/core';
import {EngineService} from "../../services/engine.service";
import {BackendArticlesService} from "../../services/backend-articles.service";
import {CommonModule} from "@angular/common";
import {Doc} from "../../models/db-response.model";
import {articlesStubs} from "../../stubs/articles.stub";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {jamSkull} from "@ng-icons/jam-icons"
import {DocumentsService} from "../../services/documents.service";

@Component({
  selector: 'app-document-loader',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './document-loader.component.html',
  styleUrl: './document-loader.component.scss',
  providers: [provideIcons({
    jamSkull
  })]
})
export class DocumentLoaderComponent implements OnInit {

  engineService = inject(EngineService);
  documentsService = inject(DocumentsService)

  articles = this.documentsService.documents

  ngOnInit() {
    this.loadDocuments();
  }

  async uploadDocument(event: any) {
    await this.engineService.onFileSelected(event);
    this.loadDocuments()

  }

  async loadDocuments() {
    await this.documentsService.fetchDocuments()

  }

  deleteDocument(_id: string, _rev: string) {
    if (confirm("Are you sure you want to delete this document? (Cancel to abort)")) {
      this.documentsService.deleteDocument(_id, _rev).then(() => {
        this.loadDocuments();
      });
    }
  }
}
