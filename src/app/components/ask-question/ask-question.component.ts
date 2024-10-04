import {Component, computed, inject, model, OnInit} from '@angular/core';
import {ChatMessageComponent} from "../chat-message/chat-message.component";
import {FormsModule} from "@angular/forms";
import {ConversationService} from "../../services/conversation.service";
import {DocumentsService} from "../../services/documents.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-ask-question',
  standalone: true,
  imports: [
    ChatMessageComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './ask-question.component.html',
  styleUrl: './ask-question.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('500ms', style({opacity: 1})),
      ]),
      transition(':leave', [
        animate('500ms', style({opacity: 0})),
      ]),
    ]),
  ]

})
export class AskQuestionComponent implements OnInit {
  message = model('');
  conversationService = inject(ConversationService);
  conversation = this.conversationService.messages;
  conversationDisplay = computed(() => {
    //removes the first message
    return this.conversation().slice(1);
  })
  documentsService = inject(DocumentsService);

  loadingAnswer = this.conversationService.loadingAnswer;

  async submitMessage() {
    console.log('submitting message');
    const message = this.message();
    this.message.set('');

    await this.conversationService.sendMessage(message);

    console.log('finished2', this.message(), this.conversation(), this.conversationDisplay());

  }

  ngOnInit() {
    this.documentsService.fetchDocuments()
  }
}
