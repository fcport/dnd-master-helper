import {Component, inject, model, output, Signal, signal} from '@angular/core';
import {injectAppSelector} from "../../injectables";
import {selectActiveDocument} from "../../store/document-slice";
import {Doc} from "../../models/db-response.model";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-document-side-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './document-side-panel.component.html',
  styleUrl: './document-side-panel.component.scss'
})
export class DocumentSidePanelComponent {

  activeDocument = injectAppSelector(selectActiveDocument)

  documentEdited = model({...this.activeDocument()})


  fb = inject(FormBuilder);
  form: FormGroup

  onSave = output<Partial<Doc>>()
  onCancel = output<void>()

  constructor() {
    this.form = this.fb.group({
      content: this.fb.control<string>(this.documentEdited().content || ''),
      keywords: this.fb.control<string>(this.documentEdited().keywords?.join() || ''),
      summary: this.fb.control<string>(this.documentEdited().summary || ''),
      title: this.fb.control<string>(this.documentEdited().title || ''),

    })


  }


  saveDocument() {
    console.log('saveDocument', {...this.activeDocument(), ...this.form.value}, this.activeDocument())
    this.onSave.emit({...this.activeDocument(), ...this.form.value})
  }

  cancel() {
    this.onCancel.emit()
  }

}
