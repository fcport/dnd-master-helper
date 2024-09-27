import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {NavbarComponent} from "./components/navbar/navbar.component";
import {NgOptimizedImage} from "@angular/common";
import {EngineService} from "./services/engine.service";
import {LoadingEngineComponent} from "./components/loading-engine/loading-engine.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NgOptimizedImage, LoadingEngineComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'dnd-master-helper';
  engineService = inject(EngineService);


  constructor() {
  }

  ngOnInit(): void {
    this.engineService.initEngine();
  }


}
