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
  pdfContent = signal("");


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

    if (!this.engine) return;

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
    if ('choices' in reply) {
      console.log(reply.choices[0].message.content);

    } else {
      console.log("Streamed response:", reply);
    }

  }


  async onFileSelected(event: any) {
    if (!event.target) return;
    const file = event.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(' ');
    }

    this.pdfContent.set(fullText) ;


    this.askQuestion()
  }


  async askQuestion() {
    if (!this.engine) return;

    const messages: ChatCompletionRequestBase = {
      messages: [
        {role: "assistant", content: `You are a helpful AI assistant that can answer questions about docs, this is the doc content: ${this.pdfContent()}`},
        {role: "user", content: "What is the content of this document? Can you summarize it?"},
      ],
      stream: false
    }


    const reply: ChatCompletion | AsyncIterable<ChatCompletionChunk> = await this.engine.chat.completions.create(
      messages
    );
    if ('choices' in reply) {
      console.log(reply.choices[0].message.content);

    } else {
      console.log("Streamed response:", reply);
    }
  }
}


// Callback function to update model loading progress
