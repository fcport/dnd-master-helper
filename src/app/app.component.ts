import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatCompletionMessage, ChatCompletionRequestBase, CreateMLCEngine, MLCEngine} from "@mlc-ai/web-llm";
import {ChatCompletion} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";


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
          this.progress.set(Math.floor(initProgress.progress * 100));
        }
      },
    );
  }

  async testEngine() {
    if(this.engine) {
      const messages: ChatCompletionRequestBase = {
        messages: [
          {role: "assistant", content: "You are a helpful AI assistant."},
          {role: "user", content: "What is the capital of France?"},
        ],
        stream: false
      }


      const reply = await this.engine.chat.completions.create(
        messages
      );
      console.log(reply);
    }
  }


}


// Callback function to update model loading progress
