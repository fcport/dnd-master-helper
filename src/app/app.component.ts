import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
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
  progress = signal(0)


  async initEngine() {


    const selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC";

      this.engine = await CreateMLCEngine(
        selectedModel,
        {
          initProgressCallback: (initProgress) => {
            console.log(initProgress);
            this.progress.set(Math.floor(initProgress.progress * 100)) ;
          }
        },
      );


  }


}


// Callback function to update model loading progress
