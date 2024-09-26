import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {EngineService} from "../../services/engine.service";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        NgOptimizedImage
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  engineService = inject(EngineService);

}
