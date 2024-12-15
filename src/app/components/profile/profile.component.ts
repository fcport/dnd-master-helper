import {Component, inject, model} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {OpenAiService} from "../../services/open-ai.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  authService = inject(AuthService);
  // userDetails = inject(AppwriteBackendService).getUserDetails(this.authService.loggedInUser?.$id || '');
  //
  // name = model(this.authService.loggedInUser?.name || '');
  // surname = model();
  // birthDate = model(new Date());
  apiKey = model('');

  openAiService = inject(OpenAiService);


  // async updateProfile() {
  //   await account.update({
  //     name: this.name(),
  //     surname: this.surname(),
  //     birthDate: new Date(this.birthDate()),
  //   })
  // }


  saveApiKey() {
    this.openAiService.openAiKey.set(this.apiKey());
  }
}
