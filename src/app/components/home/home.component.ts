import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {EngineService} from "../../services/engine.service";
import {RouterLink, RouterModule} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


}
