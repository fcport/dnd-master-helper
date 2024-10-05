import {Component, input, output} from '@angular/core';
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {jamSkull} from "@ng-icons/jam-icons";
import {Doc} from "../../models/db-response.model";

@Component({
  selector: 'app-documents-table',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './documents-table.component.html',
  styleUrl: './documents-table.component.scss',
  providers: [provideIcons({
    jamSkull
  })]
})
export class DocumentsTableComponent {

  articles = input.required<Doc[]>()

  onDeleteDocument = output<{ _id: string, _rev: string }>()

  deleteDocument(param: {
    _rev: string
    _id: string
  }) {
    const {_rev, _id} = param;

    this.onDeleteDocument.emit({_id, _rev})

  }
}
