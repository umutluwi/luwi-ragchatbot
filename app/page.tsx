'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      addMessage('Merhaba! Ben Luwi RAG ChatBot. Vergi mevzuatları hakkında sorularınızı yanıtlayabilirim. Ne öğrenmek istiyorsunuz?', 'bot')
    }, 1000)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    if (sender === 'user') {
      setShowWelcome(false)
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return
    
    addMessage(inputValue, 'user')
    setInputValue('')
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      addMessage('KDV oranları 2024 yılı için %1, %10 ve %20 olarak belirlenmiştir. Temel ihtiyaç maddelerinde %1, gıda ve kitap gibi ürünlerde %10, diğer mal ve hizmetlerde %20 uygulanır.', 'bot')
    }, 1500)
  }

  const sendQuickMessage = (message: string) => {
    setInputValue(message)
    setTimeout(() => sendMessage(), 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div>
      {/* Floating Background Animation - MORE CUBES! */}
      <div className="floating-bg">
        <div className="floating-cube"></div>
        <div className="floating-cube"></div>
        <div className="floating-cube"></div>
        <div className="floating-cube"></div>
        <div className="floating-cube"></div>
        <div className="floating-cube"></div>
        <div className="floating-cube"></div>
        <div className="floating-cube"></div>
        <div className="floating-cube"></div>
        <div className="floating-cube"></div>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div className="company-logo">✨ Luwi RAG ChatBot</div>
          <div className="status-indicator"></div>
        </div>

        <div className="chat-messages">
          {showWelcome && (
            <div className="welcome-message">
              <div className="welcome-title">🎯 Vergi Mevzuatı RAG ChatBot'a Hoş Geldiniz</div>
              <div className="welcome-subtitle">Vergi konularında sorularınızı sorun, size yardımcı olmaya hazırım!</div>
              <div className="quick-actions">
                <div className="quick-action" onClick={() => sendQuickMessage('KDV oranları nedir?')}>
                  💰 KDV Oranları
                </div>
                <div className="quick-action" onClick={() => sendQuickMessage('Gelir vergisi dilimi nasıl hesaplanır?')}>
                  📊 Gelir Vergisi
                </div>
                <div className="quick-action" onClick={() => sendQuickMessage('Kurumlar vergisi oranı kaçtır?')}>
                  🏢 Kurumlar Vergisi
                </div>
                <div className="quick-action" onClick={() => sendQuickMessage('Damga vergisi ne zaman ödenir?')}>
                  📋 Damga Vergisi
                </div>
                <div className="quick-action" onClick={() => sendQuickMessage('Vergi beyannamesi nasıl verilir?')}>
                  📝 Beyanname
                </div>
                <div className="quick-action" onClick={() => sendQuickMessage('MTV tutarları güncel mi?')}>
                  🚗 MTV
                </div>
              </div>
            </div>
          )}

          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-avatar">
                {message.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="typing-indicator">
              🤖 RAG ChatBot yazıyor
              <span className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="input-wrapper">
            <input
              type="text"
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="✍️ Mesajınızı yazın..."
            />
            <button className="send-button" onClick={sendMessage}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9"></polygon>
              </svg>
            </button>
          </div>
        </div>

        <div className="chat-footer">
          <div className="footer-logo-container">
            <Image 
              src="/images/luwi-logo.png" 
              alt="Luwi Logo" 
              width={24} 
              height={24}
              className="footer-logo-img"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://luwi.dev/images/luwi-logo.png'
              }}
            />
            <div className="footer-company">🔥 Luwi Developments</div>
          </div>
          <div className="footer-tagline">✨ DREAM · DESIGN · DEVELOP ✨</div>
        </div>
      </div>
    </div>
  )
}