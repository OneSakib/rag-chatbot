import api from "./api";
import { ChatRequest, ChatStreamEvent, ChatSession, Message } from "@/types";

// export const askQuestion = async (
//   data: ChatRequest,
// ): Promise<ChatStreamEvent> => {
//   const response = await api.post<ChatStreamEvent>("/api/v1/chat/ask", data);

//   return response.data;
// };

export const askQuestion = async (data: ChatRequest): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/chat/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  return response;
};

export const createChatSession = async (): Promise<ChatSession> => {
  const response = await api.post<ChatSession>("/api/v1/chat/sessions");

  return response.data;
};
export const getChatSessions = async (): Promise<Array<ChatSession>> => {
  const response = await api.get<Array<ChatSession>>("/api/v1/chat/sessions");

  return response.data;
};
export const getSessionMessages = async (
  session_id: string,
): Promise<Array<Message>> => {
  const response = await api.get<Array<Message>>(
    "/api/v1/chat/sessions/" + session_id + "/messages",
  );

  return response.data;
};
export const sendChatMessage = async (): Promise<Array<ChatSession>> => {
  const response = await api.get<Array<ChatSession>>("/api/v1/chat/sessions");

  return response.data;
};
