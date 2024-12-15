import {Injectable} from '@angular/core';
import {account} from "../appwrite/appwrite";
import {ID, Models} from "appwrite";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInUser: Models.User<Models.Preferences> | null = null;
  userDetails = null;
  email: string = '';
  password: string = '';
  name: string = '';


  constructor() {
    account.get().then((user) => {
      this.loggedInUser = user;
    })
  }

  async login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password);
    this.loggedInUser = await account.get();
  }

  async register(email: string, password: string, name: string) {
    await account.create(ID.unique(), email, password, name);
    await this.login(email, password);

  }

  async logout() {
    await account.deleteSession('current');
    this.loggedInUser = null;
  }
}
