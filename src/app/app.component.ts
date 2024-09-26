import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {
  ChatCompletionChunk,
  ChatCompletionRequestBase,
  CreateMLCEngine,
  MLCEngine
} from "@mlc-ai/web-llm";
import {ChatCompletion} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";
import * as pdfjsLib from 'pdfjs-dist';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dnd-master-helper';


  constructor() {
  }

  //
  // async testEngine() {
  //
  //   if (!this.engine) return;
  //
  //   const messages: ChatCompletionRequestBase = {
  //     messages: [
  //       {role: "assistant", content: "You are a helpful AI assistant."},
  //       {role: "user", content: "What is the capital of France?"},
  //     ],
  //     stream: false
  //   }
  //
  //
  //   const reply: ChatCompletion | AsyncIterable<ChatCompletionChunk> = await this.engine.chat.completions.create(
  //     messages
  //   );
  //   if ('choices' in reply) {
  //     console.log(reply.choices[0].message.content);
  //
  //   } else {
  //     console.log("Streamed response:", reply);
  //   }
  //
  // }


}


// Callback function to update model loading progress
