import {inject, Injectable} from '@angular/core';
import {BackendArticlesService} from "./backend-articles.service";
import {injectAppDispatch, injectAppSelector} from "../injectables";
import {articlesStubs} from "../stubs/articles.stub";
import {Doc} from "../models/db-response.model";
import {selectDocuments, setDocuments} from "../store/document-slice";

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  backendArticlesService = inject(BackendArticlesService);
  dispatch = injectAppDispatch();

  documents = injectAppSelector(selectDocuments);

  async fetchDocuments() {
    const articles = await this.backendArticlesService.getAllArticles()

    if (articles.rows!.length === 0) {

      const articlesMapped = articlesStubs.articlesStubs["by-sequence"] as unknown as Doc[]
      this.dispatch(setDocuments(articlesMapped))
      return

    }

    this.dispatch(setDocuments(articles.rows!.map((row) => row.doc)))
  }

  async deleteDocument(_id: string, _rev: string) {
    await this.backendArticlesService.deleteArticle(_id, _rev);
    this.dispatch({type: 'deleteDocument', payload: _id})
  }

  async addDocument(doc: Partial<Doc>) {
    await this.backendArticlesService.addArticle(doc);
    await this.fetchDocuments();
  }
}
