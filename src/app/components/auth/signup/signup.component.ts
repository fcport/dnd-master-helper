import {Component, inject, model} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../../services/auth.service";
import {AppwriteBackendService} from "../../../services/appwrite-backend.service";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  authServices = inject(AuthService);
  appwriteBackendService = inject(AppwriteBackendService);

  name = model('');
  surname = model('');
  birthDate = model(new Date());
  email = model('');
  password = model('');
  confirmPassword = model('');

  async signup() {

    if (this.password() !== this.confirmPassword()) {
      alert('Passwords do not match');
      return;
    }
    try {
      await this.authServices.register(this.email(), this.password(), this.name());


    } catch (error) {
      throw error
    }
    await this.appwriteBackendService.addUser({
      name: this.name(),
      surname: this.surname(),
      birthDate: new Date(this.birthDate()),
      userId: this.authServices.loggedInUser?.$id || ''
    })
  }
}
