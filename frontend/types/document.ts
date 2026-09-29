export type DocumentType = "pdf" | "docx" | "txt";

export type DocumentStatus = "ready" | "processing" | "error";

export interface SourceFile {
  id: string;
  name: string;
  size: string;
  type: DocumentType;
  status: DocumentStatus;
}
export interface Document {
  file_path: string;
  file_size: number;
  id: number;
  file_name: string;
  created_at: string;
  status: string;
}
export interface DeleteDocumentRespons {
  message: string;
  doc_id: number;
}
