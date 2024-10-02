import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-support-me',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './support-me.component.html',
  styleUrl: './support-me.component.scss'
})
export class SupportMeComponent {

}
