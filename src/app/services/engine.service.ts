import {Injectable, signal} from '@angular/core';
import * as pdfjsLib from "pdfjs-dist";
import {ChatCompletionChunk, ChatCompletionRequestBase, CreateMLCEngine, MLCEngine} from "@mlc-ai/web-llm";
import {ChatCompletion} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  pdfContent = signal("");
  engine?: MLCEngine


  progress = signal(0)
  loadingMessage = signal("Click \"Download engine\" to start loading the model")
  error = signal("");


  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.min.mjs";
  }


  async initEngine() {
    const selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC";
    try {
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
    } catch (e: any) {
      console.log(e);
      this.error.set(e);
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

    this.pdfContent.set(fullText);

    console.log('PDF content:', fullText);


    await this.askQuestion()
  }


  async askQuestion() {
    if (!this.engine) return;

    const messages: ChatCompletionRequestBase = {
      messages: [
        {
          role: "assistant",
          content: `You are a helpful AI assistant that can answer questions about docs, this is the doc content: ${this.pdfContent()}. Summarize the content and return a json like this:
          {
            "title": string, //the title of the content
            "content": string, //the content NOT summarized but with full informations
            "summary": string //the summary of the content
            }

          `
        },
        {role: "user", content: "What is the content of this document? Can you summarize it?"},
      ],
      stream: false
    }


    console.log('asking AI...');
    const t1 = performance.now()

    const reply: ChatCompletion | AsyncIterable<ChatCompletionChunk> = await this.engine.chat.completions.create(
      messages
    );

    const t2 = performance.now()


    console.log('AI replied...', t2 - t1);

    if ('choices' in reply) {
      console.log(reply.choices[0].message.content);

    } else {
      console.log("Streamed response:", reply);
    }
  }
}
