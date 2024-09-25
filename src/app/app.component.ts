import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {
  ChatCompletionChunk,
  ChatCompletionMessage,
  ChatCompletionRequestBase,
  CreateMLCEngine,
  MLCEngine
} from "@mlc-ai/web-llm";
import {ChatCompletion} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";
import * as repl from "node:repl";


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
  loadingMessage = signal("Loading model...")


  async initEngine() {
    const selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC";

    this.engine = await CreateMLCEngine(
      selectedModel,
      {
        initProgressCallback: (initProgress) => {
          console.log(initProgress);
          this.progress.set(Math.floor(initProgress.progress * 100));
          this.loadingMessage.set(initProgress.text);
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


      const reply: ChatCompletion | AsyncIterable<ChatCompletionChunk> = await this.engine.chat.completions.create(
        messages
      );
      if('choices' in reply) {
        console.log(reply.choices[0].message.content);

      }else{
        console.log("Streamed response:", reply);
      }
    }
  }


}


// Callback function to update model loading progress
