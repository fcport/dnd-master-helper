import {inject, Injectable} from '@angular/core';
import {client} from "../appwrite/appwrite";
import {Databases, ID, Query} from "appwrite";
import {AuthService} from "./auth.service";
import {toObservable} from "@angular/core/rxjs-interop";
import {from, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppwriteBackendService {

  databases = new Databases(client);


  constructor() {
  }

  async addUser(user: { name: string, surname: string, birthDate: Date, userId: string }) {
    await this.databases.createDocument('675dc4fe0015736f2a92', '675dc521001b4df15b9b', ID.unique(), user);
  }

  getUserDetails(userId: string) {
    return from(this.databases.listDocuments(
      '675dc4fe0015736f2a92',
      '675dc521001b4df15b9b',
      [
        Query.equal('userId', userId)
      ]))
  }


}
