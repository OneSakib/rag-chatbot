# RAG Chatbot — Next.js Theme

A responsive frontend theme for a document-grounded RAG chatbot.

## Features
- Responsive desktop/mobile layout
- Dark document/chat-history sidebar
- Upload document modal
- Document processing/ready states
- Chat interface with AI code blocks and Copy affordances
- Current-document information panel
- Mobile sidebar drawer
- Ready to connect to FastAPI/Django + Celery polling APIs

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Backend integration points
Replace the demo upload flow with:
1. `POST /documents/upload` → returns `task_id`
2. Poll `GET /documents/{id}/status` until `ready`/`failed`
3. `GET /documents` → sidebar document list
4. `POST /chats/{chat_id}/messages` → RAG answer
5. Stream tokens with SSE/WebSocket if desired.
