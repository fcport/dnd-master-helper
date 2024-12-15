import {Component, inject, model} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authServices = inject(AuthService)

  email = model('')
  password = model('')

  async login() {
    await this.authServices.login(this.email(), this.password())
  }
}
