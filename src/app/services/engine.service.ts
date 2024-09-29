import {inject, Injectable, signal} from '@angular/core';
import * as pdfjsLib from "pdfjs-dist";
import {ChatCompletionChunk, ChatCompletionRequestBase, CreateMLCEngine, MLCEngine} from "@mlc-ai/web-llm";
import {ChatCompletion} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";
import {Article} from "../models/article.model";
import {BackendArticlesService} from "./backend-articles.service";
import {TokenTextSplitter} from "@langchain/textsplitters";
import {injectAppDispatch, injectAppSelector} from "../injectables";
import {selectDocuments} from "../store/document-slice";
import {
  resetLoadingDocumentNumber,
  resetTotalLoadingDocuments,
  setLoadingDocumentNumber,
  setTotalLoadingDocuments
} from "../store/loading-slice";

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  pdfContent = signal("");
  engine?: MLCEngine


  progress = signal(0)
  loadingMessage = signal("Click \"Download engine\" to start loading the model")
  error = signal("");

  loadingEngine = signal(false);

  backendArticlesService = inject(BackendArticlesService);

  previousSummary = signal("");
  dispatch = injectAppDispatch();


  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.min.mjs";
  }


  async initEngine() {
    this.loadingEngine.set(true);
    const selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC";
    try {
      this.engine = await CreateMLCEngine(
        selectedModel,
        {
          logLevel: "DEBUG",
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

    } finally {
      this.loadingEngine.set(false);

    }

  }


  async onFileSelected(event: any) {
    if (!event.target) return;
    const file = event.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const title = file.name;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(' ');
    }

    this.pdfContent.set(fullText);

    console.log('PDF content:', fullText);

    await this.generateSummary(title)
  }


  async generateSummary(originalDocumentTitle: string = '') {
    if (!this.engine) return;


    const textSplitter = new TokenTextSplitter({
      chunkSize: 3000,
      chunkOverlap: 0,
    });

    const texts = await textSplitter.splitText(this.pdfContent());

    this.dispatch(setTotalLoadingDocuments(texts.length));


    for (const text of texts) {
      const index = texts.indexOf(text);
      this.dispatch(setLoadingDocumentNumber(index));


      const messages: ChatCompletionRequestBase = {
        messages: [
          {
            role: "assistant",
            content: `You are a helpful AI assistant that can answer questions about docs, this is the doc content: ${this.pdfContent()}
            ${index !== 0 ? ` This is the part ${index + 1} of a split document of ${texts.length}, here's the previous part's summary ` + this.previousSummary() : ''}. Return a json like this:
          {
            "title": string, //the title of the content
            "summary": string //the summary of the content
            }
          Your answer should ONLY contain the json, nothing else.
          `
          },
          {role: "user", content: "Give me the json, dont add anything else more than the json"},
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

      if ('choices' in reply && reply.choices.length > 0 && reply.choices[0].message.content) {
        console.log(JSON.parse(reply.choices[0].message.content));
        const article: Partial<Article> = JSON.parse(reply.choices[0].message.content);
        this.backendArticlesService.addArticle({
          ...article,
          content: this.pdfContent(),
          originalDocumentTitle: originalDocumentTitle
        }).then((res: any) => {
          this.previousSummary.set(article.summary || '');
          console.log('Article added:', res);
        });


      } else {
        console.log("Streamed response:", reply);
      }

    }

    this.dispatch(resetTotalLoadingDocuments());
    this.dispatch(resetLoadingDocumentNumber());
  }
}
