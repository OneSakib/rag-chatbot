export type MessageRole = "user" | "assistant";

export interface Chat {
  id: string;
  title: string;
  time: string;
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
  type: "token" | "sources" | "done";
  response?: string;
  sources?: ChatSource[];
}

export interface ChatStreamToken {
  type: "token";
  content: string;
}

export interface ChatStreamSources {
  type: "sources";
  sources: ChatSource[];
}

export interface ChatStreamDone {
  type: "done";
}

export type ChatStreamEvent =
  | ChatStreamToken
  | ChatStreamSources
  | ChatStreamDone;

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  sources?: ChatSource[];
}
