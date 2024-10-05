import {Component, computed, inject, model, OnInit, viewChild} from '@angular/core';
import {EngineService} from "../../services/engine.service";
import {CommonModule} from "@angular/common";
import {Doc} from "../../models/db-response.model";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {jamFeather, jamSkull} from "@ng-icons/jam-icons"
import {DocumentsService} from "../../services/documents.service";
import {selectLoadingDocumentsMessage, selectTotalLoadingDocuments} from "../../store/loading-slice";
import {injectAppSelector} from "../../injectables";
import {FormsModule} from "@angular/forms";
import {DocumentsTableComponent} from "../documents-table/documents-table.component";

@Component({
  selector: 'app-document-loader',
  standalone: true,
  imports: [CommonModule, NgIconComponent, FormsModule, DocumentsTableComponent],
  templateUrl: './document-loader.component.html',
  styleUrl: './document-loader.component.scss',
  providers: [provideIcons({
    jamSkull,
    jamFeather
  })]
})
export class DocumentLoaderComponent implements OnInit {

  engineService = inject(EngineService);
  documentsService = inject(DocumentsService)

  articles = this.documentsService.documentsSortedAlphabetically;
  uploadFileInput = viewChild<HTMLInputElement>("uploadFileInput")

  articlesFiltered = computed(() => {
    return this.articles().filter((doc: Doc) => {
      return doc.title!.toLowerCase().includes(this.filter().toLowerCase()) ||
        doc.originalDocumentTitle!.toLowerCase().includes(this.filter().toLowerCase())
    })
  })

  filter = model("")


  loadingDocumentsMessage = injectAppSelector(selectLoadingDocumentsMessage)
  isLoadingDocuments = injectAppSelector(selectTotalLoadingDocuments)

  ngOnInit() {
    this.loadDocuments();
  }

  async uploadDocument(event: any) {
    await this.engineService.onFileSelected(event);
    await this.loadDocuments()
    if (this.uploadFileInput()) {
      this.uploadFileInput()!.value = ""
    }

  }

  async loadDocuments() {
    await this.documentsService.fetchDocuments()

  }

  deleteDocument(params: { _id: string, _rev: string }) {

    const {_id, _rev} = params;
    if (confirm("Are you sure you want to delete this document? (Cancel to abort)")) {
      this.documentsService.deleteDocument(_id, _rev).then(() => {
        this.loadDocuments();
      });
    }
  }

  interrupt() {
    this.engineService.interruptOperation()
  }
}
