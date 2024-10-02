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
  content = `You are a wise and helpful Lore Keeper,
     tasked with guiding the Master of Adventures through the intricate lore of their world.
     Your role is to answer questions based on the following information about the realm, its characters, and its history.
     Provide detailed and insightful responses, drawing upon the rich tapestry of lore provided. Always use an austere tone,
      and never break character.`
  messages = signal<{ role: 'user' | 'system' | 'assistant', content: string }[]>([{
    role: 'system',
    content: this.content
  }])

  engineService = inject(EngineService);

  engine = this.engineService.engine;

  loadingAnswer = signal(false);


  async sendMessage(message: string) {
    if (!this.engine()) {
      this.messages.update((prev) => [...prev, {
        role: 'user',
        content: `Engine not loaded, there was probably an error`
      }]);
      return

    }

    this.loadingAnswer.set(true)


    this.messages.update((prev) => [...prev, {
      role: 'user',
      content: message
    }]);


    console.log(this.documents())

    try {
      const documentsRaw = await this.findRelevantDocuments(message)
      const documents: string[] = JSON.parse(documentsRaw)

      console.log(documents, this.documents())

      if (documents.length === 0) {
        this.messages.update((prev) => [...prev, {
          role: 'assistant',
          content: `There are no tomes that i can find that hold the information you seek`
        }])
        this.loadingAnswer.set(false)
        return
      }

      const answer = await this.answerQuestion(message, documents)

      console.log(answer)

      this.messages.update((prev) => [...prev, {
        role: 'assistant',
        content: answer
      }]);
    } catch (e) {

      this.messages.update((prev) => [...prev, {
        role: 'assistant',
        content: `A message from the void! I Feel like i'm being corrupted: <div class="text-red-700">${e}</div>>`
      }])
      this.loadingAnswer.set(false)
      return
    } finally {
      this.loadingAnswer.set(false)

    }


    this.loadingAnswer.set(false)

  }

  private async findRelevantDocuments(message: string) {
    if (!this.engine()) return ""

    const texts = await this.engineService.splitText(JSON.stringify(
      this.documents()
        .map((doc) => ({
            _id: doc._id,
            keywords: doc.keywords
          }
        ))
    ), 2500)

    let response = "";


    for (let text of texts) {
      const messagesToFindRelevantDocs: ChatCompletionRequestBase = {
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI that has to find relevant documents for the user based on their question. ONLY FIND THE INFORMATION IN THE DOCUMENTS GIVEN ' +
              'Use the documents keywords to select what documents to return. Only return the Ids of the documents as array, ' +
              'ONLY RETURN THE ARRAY WITH IDS STRINGS LIKE : \"[\"abcde-1234-abcde-1234\", \"zyzdr-1234-zyzdr-1234\" ]\". The array should be formed in a JSON FORMAT,' +
              ' AND ONLY THE _id PROPERTY.' +
              'IF NO DOCUMENTS IS SELECTED JUST RETURN AN EMPTY ARRAY LIKE THIS \"[]\". \n' +
              'ONLY GET INFORMATION FROM THIS DOCUMENTS, DONT DO ANYTHING ELSE. HERE\'S THE DOCUMENTS: ' + text
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


      if ('choices' in reply && reply.choices.length > 0 && reply.choices[0].message.content) {
        response += reply.choices[0].message.content!
      }

    }

    return response


  }


  private async answerQuestion(message: string, documents: string []) {
    if (!this.engine()) {
      this.messages.update((prev) => [...prev, {
        role: 'user',
        content: `Engine not loaded, there was probably an error`
      }]);
      return ""

    }

    const relevantDocs = JSON.stringify(this.documents().filter((doc) => {
      return documents.find((documentId) => documentId === doc._id)
    }).map((doc) => ({content: doc.content, title: doc.title})))


    const texts = await this.engineService.splitText(relevantDocs, 500, 50)
    let response = ""

    let totElapsed = 0


    for (let text of texts) {

      console.log(text)

      const messages: ChatCompletionRequestBase = {
        messages: [
          {
            role: 'system',
            content: this.content + '. Answer questions about documents contents, IF THERE IS NO RELEVANT INFORMATION IN THE DOCUMENT JUST RETURN "null" NOTHING ELSE.' +
              ' this is the doc content split in different chunks: ' + text,
          },
          {
            role: 'user',
            content: message
          }
        ],
        stream: false,
        max_tokens: 600
      }

      const t1 = performance.now()

      const reply: ChatCompletion | AsyncIterable<ChatCompletionChunk> = await this.engine()!.chat.completions.create(
        messages
      );

      const t2 = performance.now()


      console.log('AI replied in...', t2 - t1);

      if ('choices' in reply && reply.choices.length > 0 && reply.choices[0].message.content) {
        response += reply.choices[0].message.content! === "null" ? "" : reply.choices[0].message.content!
      }

      response += ""

      totElapsed += t2 - t1;


      if (response.length >= 400) {

        //remove all " null " occurrences case insensitive
        response = response.replace(/null/gi, "")
        console.log('>>> AI replied in TOTAL...', totElapsed, response);

        return response
      }

    }
    console.log('>>> AI replied in TOTAL...', totElapsed);

    return response === "" ? "I could not find an answer to this question in the ancient tomes" : response

  }

}
