import {Component, inject, OnInit, signal} from '@angular/core';
import {EngineService} from "../../services/engine.service";
import {BackendArticlesService} from "../../services/backend-articles.service";
import {CommonModule} from "@angular/common";
import {Doc} from "../../models/db-response.model";
import {articlesStubs} from "../../stubs/articles.stub";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {jamSkull} from "@ng-icons/jam-icons"

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
  backendArticlesService = inject(BackendArticlesService);

  articles = signal<Doc[]>([])

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.backendArticlesService.getAllArticles().then((articles) => {
      this.articles.set(articles.rows!.map((row) => row.doc));

      if (articles.rows!.length === 0) {

        const articlesMapped = articlesStubs.articlesStubs["by-sequence"] as unknown as Doc[]

        this.articles.set(
          articlesMapped
        );
      }

    });
  }

  deleteDocument(_id: string) {
    this.backendArticlesService.deleteArticle(_id).then(() => {
      this.loadDocuments();
    });

  }
}
