import {inject, Injectable, signal} from '@angular/core';
import {DocumentsService} from './documents.service';
import {EngineService} from './engine.service';
import {
  ChatCompletionChunk,
  ChatCompletionRequestBase,
} from '@mlc-ai/web-llm';
import {ChatCompletion} from '@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion';
import {TranslocoService} from "@jsverse/transloco";

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  documentService = inject(DocumentsService);
  documents = this.documentService.documents;
  translocoService = inject(TranslocoService);
  content = this.translocoService.translate('conversation.content');

  messages = signal<
    { role: 'user' | 'system' | 'assistant'; content: string }[]
  >([
    {
      role: 'system',
      content: this.content,
    },
  ]);

  engineService = inject(EngineService);

  engine = this.engineService.engine;

  loadingAnswer = signal(false);

  constructor() {
  }

  async sendMessage(message: string) {
    console.log(this.content)
    if (!this.engine()) {
      this.messages.update((prev) => [
        ...prev,
        {
          role: 'user',
          content: `Engine not loaded, there was probably an error`,
        },
      ]);
      return;
    }

    this.loadingAnswer.set(true);

    this.messages.update((prev) => [
      ...prev,
      {
        role: 'user',
        content: message,
      },
    ]);

    console.log(this.documents());

    try {
      const documentsRaw = await this.findRelevantDocuments(message);
      const documents: string[] = JSON.parse(documentsRaw);

      console.log(documents, this.documents());

      if (documents.length === 0) {
        this.messages.update((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: this.translocoService.translate('conversation.noDocument'),
          },
        ]);
        this.loadingAnswer.set(false);
        return;
      }

      const answer = await this.answerQuestion(message, documents);

      console.log(answer);

      this.messages.update((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: answer,
        },
      ]);
    } catch (e) {
      this.messages.update((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `A message from the void! I Feel like i'm being corrupted: <div class="text-red-700">${e}</div>>`,
        },
      ]);
      this.loadingAnswer.set(false);
      return;
    } finally {
      this.loadingAnswer.set(false);
    }

    this.loadingAnswer.set(false);
  }

  private async findRelevantDocuments(message: string) {
    if (!this.engine()) return '';

    const texts = await this.engineService.splitText(
      JSON.stringify(
        this.documents().map((doc) => ({
          summary: doc.summary,
          _id: doc._id,
          keywords: doc.keywords,
        }))
      ),
      2500
    );

    let response = '';

    for (let text of texts) {
      const messagesToFindRelevantDocs: ChatCompletionRequestBase = {
        messages: [
          {
            role: 'system',
            content: this.generateAIDocumentFinderPrompt(text),
          },
          {
            role: 'user',
            content: message,
          },
        ],
        stream: false,
      };

      const t1 = performance.now();

      const reply: ChatCompletion | AsyncIterable<ChatCompletionChunk> =
        await this.engine()!.chat.completions.create(
          messagesToFindRelevantDocs
        );

      const t2 = performance.now();

      console.log('AI replied in...', t2 - t1);

      if (
        'choices' in reply &&
        reply.choices.length > 0 &&
        reply.choices[0].message.content
      ) {
        response += reply.choices[0].message.content!;
      }
    }

    return response;
  }

  private async answerQuestion(message: string, documents: string[]) {
    if (!this.engine()) {
      this.messages.update((prev) => [
        ...prev,
        {
          role: 'user',
          content: `Engine not loaded, there was probably an error`,
        },
      ]);
      return '';
    }

    const relevantDocs = JSON.stringify(
      this.documents()
        .filter((doc) => {
          return documents.find((documentId) => documentId === doc._id);
        })
        .map((doc) => ({content: doc.content, title: doc.title}))
    );

    const texts = await this.engineService.splitText(relevantDocs, 500, 50);
    let response = '';

    let totElapsed = 0;

    for (let text of texts) {
      console.log(text);

      const messages: ChatCompletionRequestBase = {
        messages: [
          {
            role: 'system',
            content:
              this.content + this.translocoService.translate('aiDocumentFinder.answerInstructions') +
              this.translocoService.translate('aiDocumentFinder.documentChunksIntro') +
              text,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        stream: false,
        max_tokens: 600,
      };

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
        response += reply.choices[0].message
          .content!.toLowerCase()
          .includes('null')
          ? ''
          : reply.choices[0].message.content!;
      }

      response += '';

      totElapsed += t2 - t1;

      if (response.length >= 400) {
        //remove all " null " occurrences case insensitive
        response = response.replace(/null/gi, '');
        console.log('>>> AI replied in TOTAL...', totElapsed, response);

        return response;
      }
    }
    console.log('>>> AI replied in TOTAL...', totElapsed);

    return response === ''
      ? this.translocoService.translate('conversation.noDocument')
      : response;
  }


  generateAIDocumentFinderPrompt(text: string): string {
    return (
      this.translocoService.translate('aiDocumentFinder.instruction') + ' ' +
      this.translocoService.translate('aiDocumentFinder.documentScope') + ' ' +
      this.translocoService.translate('aiDocumentFinder.selectionCriteria') + ' ' +
      this.translocoService.translate('aiDocumentFinder.returnFormat') + ' ' +
      this.translocoService.translate('aiDocumentFinder.arrayFormat') + ' ' +
      this.translocoService.translate('aiDocumentFinder.jsonRequirement') + ' ' +
      this.translocoService.translate('aiDocumentFinder.emptyResult') + '\n' +
      this.translocoService.translate('aiDocumentFinder.documentIntroduction') + ' ' +
      text
    );
  }
}
