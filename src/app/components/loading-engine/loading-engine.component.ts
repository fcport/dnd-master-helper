import {Component, inject} from '@angular/core';
import {EngineService} from "../../services/engine.service";

@Component({
  selector: 'app-loading-engine',
  standalone: true,
  imports: [],
  templateUrl: './loading-engine.component.html',
  styleUrl: './loading-engine.component.scss'
})
export class LoadingEngineComponent {
  engineService = inject(EngineService)

}
