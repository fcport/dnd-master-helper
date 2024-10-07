export interface PouchDbResponse {
  total_rows: number;
  offset: number;
  rows?: (RowsEntity)[] | null;
}

export interface RowsEntity {
  id: string;
  key: string;
  value: Value;
  doc: Doc;
}

export interface Value {
  rev: string;
}

export interface Doc {
  content?: string | null;
  _id: string;
  _rev: string;
  title?: string | null;
  summary?: string | null
  originalDocumentTitle?: string | null
  keywords?: string[] | null
}


