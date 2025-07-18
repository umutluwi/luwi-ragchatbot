import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luwi RAG ChatBot - AI Assistant',
  description: 'Vergi Mevzuatı Uzmanı RAG ChatBot',
  keywords: ['chatbot', 'rag', 'luwi', 'vergi', 'mevzuat'],
  authors: [{ name: 'Luwi Developments' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}