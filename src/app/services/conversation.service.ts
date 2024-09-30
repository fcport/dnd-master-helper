import {inject, Injectable, signal} from '@angular/core';
import {DocumentsService} from "./documents.service";
import {EngineService} from "./engine.service";
import {ChatCompletionChunk, ChatCompletionRequestBase} from "@mlc-ai/web-llm";
import {ChatCompletion} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  documentService = inject(DocumentsService);

  messages = signal<{ role: 'user' | 'system' | 'assistant', content: string }[]>([{
    role: 'system',
    content: `You are a wise and helpful Lore Keeper,
     tasked with guiding the Master of Adventures through the intricate lore of their world.
     Your role is to answer questions based on the following information about the realm, its characters, and its history.
     Provide detailed and insightful responses, drawing upon the rich tapestry of lore provided. Always use an austere tone,
      and never break character.`
  }])

  engine = inject(EngineService).engine;

  constructor() {
  }

  async sendMessage(message: string) {
    console.log(!!this.engine())
    if (!this.engine()) return

    this.messages.update((prev) => [...prev, {
      role: 'user',
      content: message
    }]);
    const messages: ChatCompletionRequestBase = {
      messages: this.messages(),
      stream: false
    }
    console.log('Asking ai');


    const t1 = performance.now()

    const reply: ChatCompletion | AsyncIterable<ChatCompletionChunk> = await this.engine()!.chat.completions.create(
      messages
    );

    const t2 = performance.now()


    console.log('AI replied in...', t2 - t1);

    if ('choices' in reply && reply.choices.length > 0 && reply.choices[0].message.content) {
      this.messages.update((prev) => [...prev, {
        role: 'assistant',
        content: reply.choices[0].message.content!
      }])
    }
  }


}
