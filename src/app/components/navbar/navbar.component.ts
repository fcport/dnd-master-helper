import {Component, effect, inject, model} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {TranslocoService} from "@jsverse/transloco";
import {AuthService} from "../../services/auth.service";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {jamFeather, jamLogOut, jamSkull} from "@ng-icons/jam-icons";
import {faSolidDiceD20} from "@ng-icons/font-awesome/solid";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgIconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  providers: [provideIcons({
    jamSkull,
    jamFeather,
    jamLogOut,
    faSolidDiceD20
  })]
})
export class NavbarComponent {

  select = model(localStorage.getItem('lang') ?? 'en')
  translocoService = inject(TranslocoService);

  authService = inject(AuthService)

  selectChange = effect(() => {
    localStorage.setItem('lang', this.select())
    this.translocoService.setActiveLang(this.select())
  })

  async logout() {
    await this.authService.logout()
  }

}
