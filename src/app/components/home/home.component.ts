import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {EngineService} from "../../services/engine.service";
import {RouterLink, RouterModule} from "@angular/router";
import {TranslocoModule, TranslocoService} from "@jsverse/transloco";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterModule,
    TranslocoModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [TranslocoService]
})
export class HomeComponent {


}
