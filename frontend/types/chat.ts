export type MessageRole = "user" | "assistant";

export interface Chat {
  id: string;
  title: string;
  time: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
}
export interface ChatRequest {
  query: string;
}

export interface SourceMetadata {
  creator?: string;
  creationdate?: string;
  document_id: number;
  page: number;
  page_label?: string;
  total_pages?: number;
  source: string;
  chunk_index: number;
  title?: string;
  producer?: string;
}

export interface ChatSource {
  id: string;
  metadata: SourceMetadata;
  page_content: string;
  type: "Document";
}

export interface ChatResponse {
  response: string;
  sources: ChatSource[];
}
