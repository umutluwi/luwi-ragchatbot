'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  raw?: any // N8N raw response
  isHtml?: boolean // HTML content flag
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [sessionId] = useState(`session_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`)
  const [showDebug, setShowDebug] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (savedTheme) {
        setTheme(savedTheme)
        document.documentElement.setAttribute('data-theme', savedTheme)
      } else {
        // Default to light mode
        setTheme('light')
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
      }
    }

    // Welcome mesajı kaldırıldı
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }
  }

  const addMessage = (text: string, sender: 'user' | 'bot', raw?: any, isHtml?: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      raw,
      isHtml: isHtml || false
    }
    setMessages(prev => [...prev, newMessage])
    // showWelcome artık kullanılmıyor
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return
    
    const userMessage = inputValue
    addMessage(userMessage, 'user')
    setInputValue('')
    setIsTyping(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId
        }),
        signal: AbortSignal.timeout(30000) // 30 saniye timeout
      })

      const data = await response.json()
      
      setIsTyping(false)
      
      // Response handling'ini iyileştir - HTML desteği ekle
      if (data.response) {
        // HTML içeriği kontrol et
        const isHtmlContent = data.response.includes('<strong>') || 
                             data.response.includes('<br>') || 
                             data.response.includes('&bull;')
        
        addMessage(data.response, 'bot', data, isHtmlContent)
      } else if (data.error) {
        addMessage('🔴 Sistemde bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'bot', data)
      } else {
        addMessage('Yanıt alınamadı. Lütfen sorunuzu tekrar sormayı deneyin.', 'bot', data)
      }
      
      if (showDebug) {
        console.log('N8N Response:', data)
      }
      
    } catch (error) {
      setIsTyping(false)
      addMessage('Bağlantı hatası! Lütfen daha sonra tekrar deneyin.', 'bot')
      console.error('Chat error:', error)
    }
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
      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? (
          <svg className="moon-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="sun-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>

      {/* Debug Toggle */}
      <button 
        className="debug-toggle" 
        onClick={() => setShowDebug(!showDebug)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: showDebug ? '#10b981' : '#6b7280',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}
        title={showDebug ? 'Debug açık' : 'Debug kapalı'}
      >
        🐛
      </button>

      {/* Demo.luwi.dev Style Background */}
      <div className="zen-background">
        {/* Floating Light Blobs */}
        <div className="floating-blob"></div>
        <div className="floating-blob"></div>
        <div className="floating-blob"></div>
        
        {/* Floating Zen Cubes */}
        <div className="zen-cube">
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
        </div>
        <div className="zen-cube">
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
        </div>
        <div className="zen-cube">
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
        </div>
        <div className="zen-cube">
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
        </div>
        <div className="zen-cube">
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
        </div>
        <div className="zen-cube">
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
          <div className="zen-cube-face"></div>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div className="company-logo">
            <span className="zen-icon">◇</span>
            RAG ChatBot
          </div>
          <div className="status-indicator"></div>
        </div>

        <div className="chat-messages">
          {showWelcome && (
            <div className="welcome-message">
              <div className="welcome-title">Vergi Mevzuatı Asistanınız</div>
              <div className="welcome-subtitle">
                Vergi konularında size yardımcı olmak için buradayım.<br/>
                Aşağıdaki konulardan birini seçebilir veya kendi sorunuzu sorabilirsiniz.
              </div>
              <div className="quick-actions">
                <div className="quick-action" onClick={() => sendQuickMessage('KDV oranları nedir?')}>
                  KDV Oranları
                </div>
                <div className="quick-action" onClick={() => sendQuickMessage('Gelir vergisi dilimi nasıl hesaplanır?')}>
                  Gelir Vergisi
                </div>
                <div className="quick-action" onClick={() => sendQuickMessage('Kurumlar vergisi oranı kaçtır?')}>
                  Kurumlar Vergisi
                </div>
                <div className="quick-action" onClick={() => sendQuickMessage('Damga vergisi ne zaman ödenir?')}>
                  Damga Vergisi
                </div>
                <div className="quick-action" onClick={() => sendQuickMessage('Vergi beyannamesi nasıl verilir?')}>
                  Beyanname
                </div>
                <div className="quick-action" onClick={() => sendQuickMessage('MTV tutarları güncel mi?')}>
                  MTV
                </div>
              </div>
            </div>
          )}

          {messages.map(message => (
            <div key={message.id}>
              <div className={`message ${message.sender}`}>
                <div className="message-avatar">
                  {message.sender === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  {/* HTML içeriği için dangerouslySetInnerHTML kullan */}
                  {message.isHtml ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: message.text }}
                      style={{
                        lineHeight: '1.6',
                        wordBreak: 'break-word'
                      }}
                    />
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {message.text}
                    </div>
                  )}
                </div>
              </div>
              {showDebug && message.raw && (
                <div style={{
                  marginLeft: message.sender === 'user' ? 'auto' : '52px',
                  marginRight: message.sender === 'user' ? '52px' : 'auto',
                  maxWidth: '70%',
                  padding: '8px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  marginTop: '4px',
                  marginBottom: '8px',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  color: theme === 'dark' ? '#94a3b8' : '#64748b'
                }}>
                  📊 Debug: {JSON.stringify(message.raw, null, 2)}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="typing-indicator">
              RAG ChatBot düşünüyor
              <span className="typing-dots">
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
              placeholder="Sorunuzu yazın..."
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
              className="footer-logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                console.log('Footer PNG logo failed, trying SVG fallback')
                target.src = '/images/luwi-logo-fallback.svg'
                target.onerror = () => {
                  console.log('Footer SVG fallback also failed, hiding logo')
                  target.style.display = 'none'
                }
              }}
            />
            <div className="footer-company">Luwi Developments</div>
          </div>
          <div className="footer-tagline">DREAM · DESIGN · DEVELOP</div>
        </div>
      </div>
    </div>
  )
}