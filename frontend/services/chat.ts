import api from "./api";
import { ChatRequest, ChatStreamEvent } from "@/types";

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
