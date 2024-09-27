import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class BackendArticlesService {
  private db: any;

  constructor() {
    this.db = new PouchDB('docs_database'); // Creates or opens a local database
  }

  addArticle(article: any) {
    return this.db.post(article);
  }

  getAllArticles() {
    return this.db.allDocs({include_docs: true});
  }
}
