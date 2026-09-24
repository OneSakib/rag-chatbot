import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "RAG Chatbot", description: "Document RAG chatbot UI" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
