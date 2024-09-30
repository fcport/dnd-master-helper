import {Component, computed, inject, model} from '@angular/core';
import {ChatMessageComponent} from "../chat-message/chat-message.component";
import {FormsModule} from "@angular/forms";
import {ConversationService} from "../../services/conversation.service";

@Component({
  selector: 'app-ask-question',
  standalone: true,
  imports: [
    ChatMessageComponent,
    FormsModule
  ],
  templateUrl: './ask-question.component.html',
  styleUrl: './ask-question.component.scss'
})
export class AskQuestionComponent {
  message = model('test');
  conversationService = inject(ConversationService);
  conversation = this.conversationService.messages;
  conversationDisplay = computed(() => {
    //removes the first message
    return this.conversation().slice(1);
  })

  async submitMessage() {
    console.log('submitting message');
    await this.conversationService.sendMessage(this.message());

    this.message.set('');
    console.log('finished2', this.message(), this.conversation(), this.conversationDisplay());

  }
}
