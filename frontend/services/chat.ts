import api from "./api";
import { ChatRequest, ChatResponse } from "@/types";

export const askQuestion = async (data: ChatRequest): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>("/api/v1/chat/ask", data);

  return response.data;
};
