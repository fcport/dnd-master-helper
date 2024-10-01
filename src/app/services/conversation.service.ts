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
  documents = this.documentService.documents;

  messages = signal<{ role: 'user' | 'system' | 'assistant', content: string }[]>([{
    role: 'system',
    content: `You are a wise and helpful Lore Keeper,
     tasked with guiding the Master of Adventures through the intricate lore of their world.
     Your role is to answer questions based on the following information about the realm, its characters, and its history.
     Provide detailed and insightful responses, drawing upon the rich tapestry of lore provided. Always use an austere tone,
      and never break character.`
  }])

  engineService = inject(EngineService);

  engine = this.engineService.engine;

  loadingAnswer = signal(false);

  constructor() {
  }

  async sendMessage(message: string) {
    if (!this.engine()) {
      this.messages.update((prev) => [...prev, {
        role: 'user',
        content: `Engine not loaded, there was probably an error`
      }]);
      return

    }

    this.messages.update((prev) => [...prev, {
      role: 'user',
      content: message
    }]);


    console.log(this.documents())


    const result = await this.findRelevantDocuments(message)

    console.log(result, this.documents())


    const messages: ChatCompletionRequestBase = {
      messages: this.messages(),
      stream: false,
    }
    console.log('Asking ai');
    this.loadingAnswer.set(true)


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

    this.loadingAnswer.set(false)

  }

  async findRelevantDocuments(message: string) {
    if (!this.engine()) return

    const texts = await this.engineService.splitText(JSON.stringify(
      this.documents()
        .map((doc) => ({
            summary: doc.summary,
            _id: doc._id
          }
        ))
    ))

    let response = "";

    console.log('texts', texts)

    for (let text of texts) {
      const messagesToFindRelevantDocs: ChatCompletionRequestBase = {
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI that has to find relevant documents for the user based on their question. ONLY FIND THE INFORMATION IN THE  ' +
              'Use the documents summary to select what documents to return. Only return the Ids of the documents as array.' +
              'ONLY GET INFORMATION FROM THIS DOCUMENTS IF DOCUMENTS DONT HOLD THE ANSWER JUST SAY THAT, DONT DO ANYTHING ELSE. HERES THE DOCUMENTS: ' + text
          },
          {
            role: 'user',
            content: message
          }
        ],
        stream: false,
      }

      const t1 = performance.now()


      const reply: ChatCompletion | AsyncIterable<ChatCompletionChunk> = await this.engine()!.chat.completions.create(
        messagesToFindRelevantDocs
      );

      const t2 = performance.now()


      console.log('AI replied in...', t2 - t1);
      console.log(console.log(reply))

      if ('choices' in reply && reply.choices.length > 0 && reply.choices[0].message.content) {
        response += reply.choices[0].message.content!
        // return reply.choices[0].message.content!
      }

    }

    return response


  }


}
