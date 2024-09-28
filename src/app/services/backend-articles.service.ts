import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb';
import {PouchDbResponse} from "../models/db-response.model";

@Injectable({
  providedIn: 'root'
})
export class BackendArticlesService {
  private db: any;

  constructor() {
    this.db = new PouchDB('articles_database'); // Creates or opens a local database
  }

  addArticle(article: any) {
    return this.db.post(article);
  }

  getAllArticles(): Promise<PouchDbResponse> {
    return this.db.allDocs({include_docs: true});
  }

  deleteArticle(_id: string, _rev: string) {
    return this.db.remove(_id, _rev);
  }
}
