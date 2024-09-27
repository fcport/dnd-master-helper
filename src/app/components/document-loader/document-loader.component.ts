import {Component, inject, signal} from '@angular/core';
import {EngineService} from "../../services/engine.service";
import {BackendArticlesService} from "../../services/backend-articles.service";
import {CommonModule} from "@angular/common";
import {Doc} from "../../models/db-response.model";
import {articlesStubs} from "../../stubs/articles.stub";

@Component({
  selector: 'app-document-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-loader.component.html',
  styleUrl: './document-loader.component.scss'
})
export class DocumentLoaderComponent {

  engineService = inject(EngineService);
  backendArticlesService = inject(BackendArticlesService);

  articles = signal<Omit<Doc, '_rev'>[]>([])

  loadDocuments() {
    this.backendArticlesService.getAllArticles().then((articles) => {
      console.log(articles)
      this.articles.set(articles.rows!.map((row) => row.doc));

      if (articles.rows!.length === 0) {

        const articlesMapped = articlesStubs.articlesStubs["by-sequence"]

        this.articles.set(
          articlesMapped
        );
      }

    });
  }

}
