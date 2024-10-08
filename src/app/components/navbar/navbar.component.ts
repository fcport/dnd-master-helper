import {Component, effect, inject, model} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {TranslocoService} from "@jsverse/transloco";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  select = model(localStorage.getItem('lang') ?? 'en')
  translocoService = inject(TranslocoService);

  selectChange = effect(() => {
    localStorage.setItem('lang', this.select())
    this.translocoService.setActiveLang(this.select())
  })

}
