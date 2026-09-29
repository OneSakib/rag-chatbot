import api from "./api";
import { Document, DeleteDocumentRespons } from "@/types";

export interface DocumentCountResponse {
  total_documents: number;
  completed: number;
  queued: number;
  processing: number;
}

export const getDocumentCount = async (): Promise<DocumentCountResponse> => {
  const response = await api.get<DocumentCountResponse>(
    "/api/v1/ingestion/documents/count",
  );

  return response.data;
};
export const getDocuments = async (): Promise<Array<Document>> => {
  const response = await api.get<Array<Document>>(
    "/api/v1/ingestion/documents",
  );

  return response.data;
};
export const deleteDocuments = async (
  doc_id: number,
): Promise<DeleteDocumentRespons> => {
  const response = await api.delete<DeleteDocumentRespons>(
    "/api/v1/ingestion/document/" + doc_id,
  );

  return response.data;
};
