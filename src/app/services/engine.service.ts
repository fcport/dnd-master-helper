import {computed, inject, Injectable, signal} from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ChatCompletionChunk,
  ChatCompletionRequestBase,
  CreateMLCEngine,
  MLCEngine,
} from '@mlc-ai/web-llm';
import {ChatCompletion} from '@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion';
import {Article} from '../models/article.model';
import {BackendArticlesService} from './backend-articles.service';
import {TokenTextSplitter} from '@langchain/textsplitters';
import {injectAppDispatch} from '../injectables';
import {
  resetLoadingDocumentNumber,
  resetTotalLoadingDocuments,
  setLoadingDocumentNumber,
  setTotalLoadingDocuments,
} from '../store/loading-slice';
import {TranslocoService} from "@jsverse/transloco";

@Injectable({
  providedIn: 'root',
})
export class EngineService {
  pdfContent = signal('');
  engine = signal<MLCEngine | null>(null);

  progress = signal(0);
  loadingMessage = signal('Click "Download engine" to start loading the model');
  error = signal('');

  loadingEngine = signal(false);

  backendArticlesService = inject(BackendArticlesService);

  previousSummary = signal('');
  previousTitleRaw = signal('');
  previousTitle = computed(() => {
    return this.previousTitleRaw().replace(/-p\d+$/, '');
  });

  translocoService = inject(TranslocoService)

  dispatch = injectAppDispatch();

  constructor() {
    let workerSrc: string;

    if (this.isElectron()) {
      const electron = (window as any).require('electron');
      const path = electron.remote.require('path');
      const app = electron.remote.app;
      workerSrc = path.join(app.getAppPath(), 'assets', 'pdf.worker.min.mjs');
    } else {
      workerSrc = 'assets/pdf.worker.min.mjs';
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  }

  private isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  async initEngine() {
    this.loadingEngine.set(true);
    const selectedModel = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';

    try {
      const engine = await CreateMLCEngine(selectedModel, {
        logLevel: 'DEBUG',
        initProgressCallback: (initProgress) => {
          console.log(initProgress);
          this.progress.set(Math.floor(initProgress.progress * 100));
          this.loadingMessage.set(initProgress.text);
        },
      });

      this.engine.set(engine);
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

    await this.generateSummary(title);
  }

  async generateSummary(originalDocumentTitle: string = '') {
    if (!this.engine()) return;

    const texts = await this.splitText(this.pdfContent());

    this.dispatch(setTotalLoadingDocuments(texts.length));

    for (const text of texts) {
      const index = texts.indexOf(text);
      this.dispatch(setLoadingDocumentNumber(index + 1));


      const content = this.getContentString(text, originalDocumentTitle, index, texts, this.previousTitle());
      console.log('REQUESTING SUMMARY FOR:', content);

      const messages: ChatCompletionRequestBase = {
        messages: [
          {
            role: 'assistant',
            content: content,
          },
          {
            role: 'user',
            content: this.translocoService.translate('aiAssistant.giveMeTheJson')
          },
        ],
        stream: false,
      };

      console.log('asking AI...');
      const t1 = performance.now();

      const reply: ChatCompletion | AsyncIterable<ChatCompletionChunk> =
        await this.engine()!.chat.completions.create(messages);

      const t2 = performance.now();

      console.log('AI replied in...', t2 - t1);

      if (
        'choices' in reply &&
        reply.choices.length > 0 &&
        reply.choices[0].message.content
      ) {
        console.log(JSON.parse(reply.choices[0].message.content));
        const article: Partial<Article> = JSON.parse(
          reply.choices[0].message.content
        );
        const backendResponse = await this.backendArticlesService.addArticle({
          ...article,
          content: this.pdfContent(),
          originalDocumentTitle: originalDocumentTitle,
          title:
            texts.length > 1 && index === 0
              ? article.title + '-p01'
              : article.title,
        });

        this.previousSummary.set(article.summary || '');
        this.previousTitleRaw.set(article.title || '');
        console.log('Article added:', backendResponse);
      } else {
        console.log('Streamed response:', reply);
      }
    }

    this.dispatch(resetTotalLoadingDocuments());
    this.dispatch(resetLoadingDocumentNumber());
  }

  async splitText(
    text: string,
    chunkSize: number = 3000,
    chunkOverlap: number = 400
  ) {
    const textSplitter = new TokenTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });

    const texts = await textSplitter.splitText(text);

    return texts;
  }

  interruptOperation() {
    window.location.reload();
  }


  private getContentString(text: string, originalDocumentTitle: string, index: number, texts: string[], previousTitle: string) {
    let content = this.translocoService.translate('aiAssistant.instruction') + ' ' +
      this.translocoService.translate('aiAssistant.docContent', {text}) + ' ' +
      this.translocoService.translate('aiAssistant.originalTitle', {originalDocumentTitle});

    if (index !== 0) {
      content += ' ' + this.translocoService.translate('aiAssistant.splitDocument.part', {
          index: index + 1,
          totalParts: texts.length
        }) + ' ' +
        this.translocoService.translate('aiAssistant.splitDocument.titleInstruction', {
          previousTitle,
          paddedIndex: String(index + 1).padStart(2, '0')
        });
    }

    content += ' ' + this.translocoService.translate('aiAssistant.jsonFormat.instruction') + '\n' +
      '{\n' +
      this.translocoService.translate('aiAssistant.jsonFormat.title.description') + ' ' +
      (index !== 0
          ? this.translocoService.translate('aiAssistant.jsonFormat.title.splitInstruction', {
            previousTitle,
            paddedIndex: String(index + 1).padStart(2, '0')
          })
          : this.translocoService.translate('aiAssistant.jsonFormat.title.normalInstruction')
      ) + ',\n' +
      this.translocoService.translate('aiAssistant.jsonFormat.summary') + ',\n' +
      this.translocoService.translate('aiAssistant.jsonFormat.keywords') + '\n' +
      '}\n' +
      this.translocoService.translate('aiAssistant.finalInstruction');

    return content;
  }
}
