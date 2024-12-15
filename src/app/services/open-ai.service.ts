import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  openAiKey = signal<string | null>(null)

  constructor() {
  }
}
