
import "./globals.css"
import type { Metadata } from "next"
export const metadata: Metadata = { title: "RAG Chatbot", description: "Upload docs and chat" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className="dark"><body className="antialiased bg-[#0a0a0f]">{children}</body></html>
}
