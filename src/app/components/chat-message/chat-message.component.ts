import {Component, computed, input} from '@angular/core';
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {faSolidDiceD20, faSolidHatWizard} from "@ng-icons/font-awesome/solid";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  providers: [provideIcons({faSolidHatWizard, faSolidDiceD20})]
})
export class ChatMessageComponent {

  messageSender = input.required<"user" | "system" | "assistant">()

  iconName = computed(() => {
    return this.messageSender() === "user" ? "faSolidDiceD20" : "faSolidHatWizard";
  })

  message = input.required<string>()


}
