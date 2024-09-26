import {Component, inject} from '@angular/core';
import {EngineService} from "../../services/engine.service";

@Component({
  selector: 'app-document-loader',
  standalone: true,
  imports: [],
  templateUrl: './document-loader.component.html',
  styleUrl: './document-loader.component.scss'
})
export class DocumentLoaderComponent {

  engineService = inject(EngineService);

}
