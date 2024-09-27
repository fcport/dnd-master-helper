import {Component, inject, signal} from '@angular/core';
import {EngineService} from "../../services/engine.service";
import {BackendArticlesService} from "../../services/backend-articles.service";
import {CommonModule} from "@angular/common";

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

  articles = signal([])

  loadDocuments() {
    this.backendArticlesService.getAllArticles().then((articles: any) => {
      this.articles.set(articles);
    });
  }

}
