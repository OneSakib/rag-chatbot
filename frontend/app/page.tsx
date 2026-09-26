
"use client"
import { useState, useEffect } from "react"
import { FileText, File, Upload, MessageSquare, Trash2, X, Loader2, Copy, Check, Plus, History, Menu, Sparkles, FileCode2 } from "lucide-react"

type SourceFile = { id: string; name: string; size: string; type: "pdf" | "docx" | "txt"; status: "ready" | "processing" | "error" }
type Chat = { id: string; title: string; time: string }
type Message = { id: string; role: "user" | "assistant"; content: string }

const mockFiles: SourceFile[] = [
  { id: "1", name: "Product_Requirements.pdf", size: "2.4 MB", type: "pdf", status: "ready" },
]

const mockChats: Chat[] = [
  { id: "1", title: "Summarize Q3 roadmap", time: "2h ago" },
  { id: "2", title: "Extract code from API docs", time: "Yesterday" },
  { id: "3", title: "Key insights from research", time: "2 days ago" },
]

export default function Page() {
  const [files, setFiles] = useState<SourceFile[]>()
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [activeChat, setActiveChat] = useState<string>("1")
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hey! I'm your RAG assistant. Upload a PDF, DOCX or TXT and ask anything about it.\n\nTry: \n- \`Summarize this document\`\n- \`Give me code for chunking\`\n\n\n```python\nfrom langchain.document_loaders import PyPDFLoader\nloader = PyPDFLoader('./docs.pdf')\npages = loader.load_and_split()\nprint(f'Loaded {len(pages)} pages')\n```" },
    { id: "2", role: "user", content: "Summarize the API doc" },
    { id: "3", role: "assistant", content: "Based on **API_Documentation.docx**, here's the summary:\n\n- REST endpoints under `/api/v1`\n- Auth via Bearer token\n- File upload uses Celery worker\n- Polling endpoint: `GET /api/file-status/:id`\n\nWant code to integrate the polling?" }
  ])
  const [input, setInput] = useState("")
  const [uploading, setUploading] = useState<{ show: boolean; name: string; progress: number; logs: string[] }>({ show: false, name: "", progress: 0, logs: [] })
  const [showUpload, setShowUpload] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    console.log("useEffect")
    setFiles(mockFiles)
  }, [])
  const simulateUpload = (fileName: string) => {
    setShowUpload(false)
    setUploading({ show: true, name: fileName, progress: 0, logs: ["POST /api/upload -> 200 OK", "file_id: rag_" + Math.random().toString(36).slice(2)] })
    let p = 0
    const logs = [
      "Celery worker picked task: process_document",
      "Extracting text...",
      "Chunking with 512 tokens...",
      "Generating embeddings...",
      "GET /api/file-status/rag_xxx -> pending",
      "GET /api/file-status/rag_xxx -> processing",
    ]
    const iv = setInterval(() => {
      p += Math.random() * 18
      if (p >= 100) {
        p = 100
        clearInterval(iv)
        setTimeout(() => {
          setFiles(f => [{ id: Date.now().toString(), name: fileName, size: "1.3 MB", type: fileName.endsWith(".pdf") ? "pdf" : fileName.endsWith(".docx") ? "docx" : "txt", status: "ready" }, ...f])
          setUploading({ show: false, name: "", progress: 0, logs: [] })
        }, 600)
      }
      setUploading(prev => ({ ...prev, progress: p, logs: p > 20 && prev.logs.length < 6 ? [...prev.logs, logs[prev.logs.length - 2] || "GET /api/file-status/rag_xxx -> ready"] : prev.logs }))
    }, 400)
  }

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input }
    setMessages(m => [...m, userMsg])
    setInput("")
    setTimeout(() => {
      let reply = ""
      if (input.toLowerCase().includes("code")) {
        reply = "Here's a clean RAG setup using your uploaded sources:\n\n```python\nimport os\nfrom langchain_community.document_loaders import PyPDFLoader\nfrom langchain_text_splitters import RecursiveCharacterTextSplitter\nfrom langchain_community.vectorstores import Chroma\nfrom langchain_openai import OpenAIEmbeddings\n\n# 1. Load\nloader = PyPDFLoader('./" + files[0]?.name + "')\ndocs = loader.load()\n\n# 2. Split\nsplitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)\nchunks = splitter.split_documents(docs)\n\n# 3. Vector store\nvec = Chroma.from_documents(chunks, OpenAIEmbeddings())\n\n# 4. Ask\nq = \"" + input + "\"\nresults = vec.similarity_search(q, k=4)\nfor r in results:\n    print(r.page_content[:300])\n```\n\nWant me to adapt it to FastAPI + Celery?"
      } else {
        reply = "Based on your " + files.length + " sources, I found relevant context.\n\n**Answer:** The document processing pipeline uses a Celery worker for async upload, status polling via `/api/file-status`, then chunking and embeddings stored in vector DB.\n\nYou can ask me to summarize, extract tables, or generate code."
      }
      setMessages(m => [...m, { id: (Date.now() + 1).toString(), role: "assistant", content: reply }])
    }, 800)
  }

  const renderMessage = (m: Message) => {
    const parts = m.content.split(/(```[\s\S]*?```)/g)
    return (
      <div key={m.id} className={"flex gap-3 " + (m.role === "user" ? "justify-end" : "")}>
        {m.role === "assistant" && <div className="w-8 h-8 rounded-full bg-[#7c5cff] flex items-center justify-center shrink-0 mt-1"><Sparkles size={16} /></div>}
        <div className={"max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-[14px] leading-6 " + (m.role === "user" ? "bg-[#7c5cff] text-white rounded-br-md" : "bg-[#1a1a24] border border-[#252530] rounded-bl-md")}>
          {parts.map((part, i) => {
            if (part.startsWith("```")) {
              const match = part.match(/```(\w+)?\n?([\s\S]*?)```/)
              const lang = match?.[1] || "code"
              const code = match?.[2] || part
              return (
                <div key={i} className="my-3 rounded-xl overflow-hidden border border-[#252530] code-block">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#12121a] text-[12px]"><span className="text-zinc-400">{lang}</span><button onClick={() => { navigator.clipboard.writeText(code); setCopied(m.id + "-" + i); setTimeout(() => setCopied(null), 1500) }} className="flex gap-1 items-center text-zinc-400 hover:text-white">{copied === m.id + "-" + i ? <Check size={14} /> : <Copy size={14} />}Copy</button></div>
                  <pre className="p-3 overflow-x-auto text-[13px]"><code>{code}</code></pre>
                </div>
              )
            } else {
              return <div key={i} className="whitespace-pre-wrap">{part.split(/`([^`]+)`/g).map((s, idx) => idx % 2 === 1 ? <code key={idx} className="bg-[#252530] px-1.5 py-0.5 rounded text-[12px]">{s}</code> : <span key={idx}>{s}</span>)}</div>
            }
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Sidebar */}
      <div className={"fixed md:static z-40 h-full w-[300px] bg-[#12121a] border-r border-[#252530] flex flex-col transition-transform " + (showDrawer ? "translate-x-0" : "-translate-x-full md:translate-x-0")}>
        <div className="p-5 border-b border-[#252530] flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[18px]"><div className="w-8 h-8 bg-gradient-to-br from-[#7c5cff] to-[#00d9ff] rounded-lg flex items-center justify-center">R</div>RAG Chatbot</div>
          <button className="md:hidden" onClick={() => setShowDrawer(false)}><X size={18} /></button>
        </div>
        <div className="p-4 space-y-5 overflow-y-auto flex-1">
          <button onClick={() => setShowUpload(true)} className="w-full border-2 border-dashed border-[#252530] hover:border-[#7c5cff]/50 rounded-xl p-4 flex flex-col items-center gap-2 text-sm text-zinc-400 hover:text-white transition"><Upload size={20} />Upload Source</button>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-zinc-500 mb-3">Source Files ({files.length})</div>
            <div className="space-y-2">{files.map(f => <div key={f.id} className="group flex items-center gap-3 p-2.5 rounded-lg bg-[#1a1a24] border border-[#252530] hover:border-[#7c5cff]/30">
              <div className="w-8 h-8 rounded bg-[#252530] flex items-center justify-center">{f.type === "pdf" ? <FileText size={16} className="text-red-400" /> : f.type === "docx" ? <FileCode2 size={16} className="text-blue-400" /> : <File size={16} />}</div>
              <div className="flex-1 min-w-0"><div className="text-[13px] truncate">{f.name}</div><div className="text-[11px] text-zinc-500">{f.size} • {f.status}</div></div>
              <button onClick={() => setFiles(files.filter(x => x.id !== f.id))} className="opacity-0 group-hover:opacity-100"><Trash2 size={14} className="text-zinc-500 hover:text-red-400" /></button>
            </div>)}</div>
          </div>
          <button onClick={() => { setMessages([]); setActiveChat(""); setChats(c => [{ id: Date.now().toString(), title: "New conversation", time: "now" }, ...c]) }} className="w-full bg-[#1a1a24] border border-[#252530] rounded-xl p-3 flex items-center justify-center gap-2 text-sm hover:bg-[#252530]"><Plus size={16} />Start New Chat</button>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2"><History size={12} /> Chat History</div>
            <div className="space-y-1">{chats.map(ch => <button key={ch.id} onClick={() => setActiveChat(ch.id)} className={"w-full text-left p-2.5 rounded-lg text-[13px] " + (activeChat === ch.id ? "bg-[#7c5cff]/20 border border-[#7c5cff]/30 text-white" : "hover:bg-[#1a1a24] text-zinc-400")}><div className="truncate">{ch.title}</div><div className="text-[11px] opacity-60">{ch.time}</div></button>)}</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-3 border-b border-[#252530] flex items-center gap-3"><button onClick={() => setShowDrawer(true)}><Menu /></button><span className="font-semibold">RAG Chatbot</span></div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto mt-20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#00d9ff] flex items-center justify-center mb-6"><MessageSquare /></div>
              <h1 className="text-2xl font-bold mb-2">Chat with your documents</h1>
              <p className="text-zinc-400 text-sm mb-6">Upload PDF, DOCX, TXT files on the left and ask questions. Powered by RAG + Celery workers.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">{["Summarize this document", "Give me code for chunking", "What are key insights?", "Extract tables as JSON"].map(s => <button key={s} onClick={() => setInput(s)} className="p-3 rounded-xl bg-[#1a1a24] border border-[#252530] text-sm text-left hover:border-[#7c5cff]/30">{s}</button>)}</div>
            </div>
          ) : messages.map(renderMessage)}
        </div>
        <div className="p-4 border-t border-[#252530] bg-[#12121a]/80 backdrop-blur">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 flex-wrap mb-2">{files.slice(0, 3).map(f => <span key={f.id} className="text-[11px] px-2 py-1 rounded-full bg-[#1a1a24] border border-[#252530]">{f.name}</span>)}</div>
            <div className="flex items-end gap-3 bg-[#1a1a24] border border-[#252530] rounded-2xl p-2">
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }} placeholder="Ask about your documents..." className="flex-1 bg-transparent resize-none outline-none text-sm min-h-[40px] max-h-[120px] p-2" rows={1} />
              <button onClick={sendMessage} className="w-9 h-9 rounded-xl bg-[#7c5cff] flex items-center justify-center hover:bg-[#6a4de6]"><span className="text-white">↑</span></button>
            </div>
            <div className="text-[11px] text-zinc-500 mt-2 text-center">RAG uses Celery worker for file processing • status polling at /api/file-status</div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-[#1a1a24] border border-[#252530] rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5"><h3 className="font-semibold">Upload Source</h3><button onClick={() => setShowUpload(false)}><X size={18} /></button></div>
            <div onClick={() => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.pdf,.docx,.txt,.md'; inp.onchange = (e: any) => { const f = e.target.files[0]?.name; if (f) simulateUpload(f) }; inp.click() }} className="border-2 border-dashed border-[#252530] rounded-xl p-8 text-center cursor-pointer hover:border-[#7c5cff]/50">
              <Upload className="mx-auto mb-3 text-zinc-500" /><p className="text-sm">Drop PDF, DOCX, TXT here</p><p className="text-xs text-zinc-500 mt-1">or click to browse</p>
            </div>
            <div className="mt-4 text-[11px] text-zinc-500">Files are processed async via Celery worker. You'll see full-page loader with polling.</div>
          </div>
        </div>
      )}

      {/* Full page loader - Celery */}
      {uploading.show && (
        <div className="fixed inset-0 z-[60] bg-[#0a0a0f]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#12121a] border border-[#252530] rounded-2xl p-8 text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-[#7c5cff]" size={32} />
            <h3 className="font-semibold mb-1">Processing {uploading.name}</h3>
            <p className="text-xs text-zinc-400 mb-5">Uploading via Celery worker • Please wait</p>
            <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden mb-4"><div className="h-full bg-gradient-to-r from-[#7c5cff] to-[#00d9ff] transition-all" style={{ width: uploading.progress + "%" }} /></div>
            <div className="bg-[#0a0a0f] rounded-lg p-3 text-left font-mono text-[11px] space-y-1 max-h-32 overflow-y-auto">{uploading.logs.map((l, i) => <div key={i} className="text-zinc-400">› {l}</div>)}</div>
            <div className="mt-4 text-[11px] text-zinc-500">API: GET /api/file-status/{uploading.name} • {Math.round(uploading.progress)}%</div>
          </div>
        </div>
      )}
    </div>
  )
}
