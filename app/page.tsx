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
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      // Default to light mode
      setTheme('light')
      document.documentElement.setAttribute('data-theme', 'light')
    }

    setTimeout(() => {
      addMessage('Merhaba! Ben Luwi RAG ChatBot. Vergi mevzuatları hakkında sorularınızı yanıtlayabilirim. Size nasıl yardımcı olabilirim?', 'bot')
    }, 1000)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

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
    
    // Simulated response for demo
    setTimeout(() => {
      setIsTyping(false)
      const responses = [
        'KDV oranları 2024 yılı için %1, %10 ve %20 olarak belirlenmiştir. Temel ihtiyaç maddelerinde %1, gıda ve kitap gibi ürünlerde %10, diğer mal ve hizmetlerde %20 uygulanır.',
        'Gelir vergisi, Türkiye\'de artan oranlı bir vergi sistemidir. 2024 yılı için gelir vergisi dilimleri güncellendi.',
        'Kurumlar vergisi oranı 2024 yılı için %25 olarak uygulanmaktadır.',
        'Damga vergisi, kağıtlar üzerinden alınan bir vergidir. Sözleşmeler, senetler ve resmi belgeler için uygulanır.',
        'Motorlu Taşıtlar Vergisi (MTV) her yıl yeniden değerleme oranında güncellenir.',
        'Vergi beyannameleri elektronik ortamda e-Beyanname sistemi üzerinden verilmektedir.'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      addMessage(randomResponse, 'bot')
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

      {/* Zen Cubes Background */}
      <div className="zen-background">
        {/* 3D Zen Cubes */}
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
        
        {/* Glow Effects */}
        <div className="zen-glow"></div>
        <div className="zen-glow"></div>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div className="company-logo">
            <span className="zen-icon">◇</span>
            Luwi RAG ChatBot
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
              width={28} 
              height={28}
              className="footer-logo-img"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://luwi.dev/images/luwi-logo.png'
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