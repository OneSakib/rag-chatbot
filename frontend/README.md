# RAG Chatbot - Next.js Theme

Premium dark RAG chatbot theme.

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Features implemented
- Left sidebar: Upload Source (PDF/DOCX/TXT) button
- Full-page loader with spinner + polling logs for Celery worker flow
  - POST /api/upload
  - GET /api/file-status/:id polling simulation
- Source files list (left)
- Start Chat + Chat History (left)
- Center Chatbot with ChatGPT-style code blocks, copy button
- Mobile responsive with drawer

## Integrate with your backend
Replace simulateUpload() with real API:
```ts
const res = await fetch('/api/upload', {method:'POST', body: formData})
const {file_id} = await res.json()
// Poll
const interval = setInterval(async ()=>{
  const s = await fetch(`/api/file-status/${file_id}`).then(r=>r.json())
  if(s.status==='ready') clearInterval(interval)
}, 1000)
```

## Stack
Next.js 14 App Router + Tailwind + lucide-react
