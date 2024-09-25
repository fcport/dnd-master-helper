import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CreateMLCEngine, MLCEngine} from "@mlc-ai/web-llm";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dnd-master-helper';

  engine?: MLCEngine


  async initEngine() {


    const initProgressCallback = (initProgress: any) => {
      console.log(initProgress);
    }
    const selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC";

   this.engine = await CreateMLCEngine(
      selectedModel,
      { initProgressCallback: (initProgress)=> {
          console.log(initProgress);

        } }, // engineConfig
    );
  }


}


// Callback function to update model loading progress
