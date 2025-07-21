import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);

  const WEBHOOK_URL = 'https://n8n.luwi.dev/webhook/rag-chatbot-pro';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Başlangıç mesajı
    setTimeout(() => {
      addMessage('Merhaba! Ben Luwi RAG ChatBot. Vergi mevzuatları hakkında sorularınızı yanıtlayabilirim. Ne öğrenmek istiyorsunuz?', 'bot');
    }, 1000);
  }, []);

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender, id: Date.now() }]);
    if (showWelcome) setShowWelcome(false);
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;

    // Kullanıcı mesajını ekle
    addMessage(message, 'user');
    setInputValue('');
    setIsTyping(true);

    try {
      // N8N webhook'una mesaj gönder
      const response = await axios.post(WEBHOOK_URL, {
        message: message,
        timestamp: new Date().toISOString(),
        userId: 'user-' + Date.now()
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 saniye timeout
      });

      setIsTyping(false);

      // Bot yanıtını ekle
      if (response.data && response.data.response) {
        addMessage(response.data.response, 'bot');
      } else if (response.data && typeof response.data === 'string') {
        addMessage(response.data, 'bot');
      } else {
        addMessage('Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.', 'bot');
      }
    } catch (error) {
      setIsTyping(false);
      console.error('Webhook error:', error);
      
      // Fallback yanıtlar
      const fallbackResponses = [
        'KDV oranları 2024 yılı için %1, %10 ve %20 olarak belirlenmiştir. Temel ihtiyaç maddelerinde %1, gıda ve kitap gibi ürünlerde %10, diğer mal ve hizmetlerde %20 uygulanır.',
        'Gelir vergisi dilimleri 2024 için: 70.000 TL\'ye kadar %15, 70.000-180.000 TL arası %20, 180.000-500.000 TL arası %27, 500.000 TL üzeri %35 oranında uygulanır.',
        'Kurumlar vergisi oranı 2024 yılı için %25\'tir. Ancak bankalar ve finansal kuruluşlar için farklı oranlar uygulanabilir.',
        'Vergi mevzuatı konusunda size yardımcı olmaya çalışıyorum. Şu anda bağlantı problemi yaşıyoruz, tekrar deneyin.'
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      addMessage(randomResponse, 'bot');
    }
  };

  const sendQuickMessage = (message) => {
    setInputValue(message);
    setTimeout(() => sendMessage(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>Luwi RAG ChatBot - AI Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="container">
        <div className="chat-container">
          <div className="chat-header">
            <div className="company-logo">Luwi RAG ChatBot</div>
            <div className="status-indicator"></div>
          </div>

          <div className="chat-messages">
            {showWelcome && (
              <div className="welcome-message">
                <div className="welcome-title">Vergi Mevzuatı RAG ChatBot'a Hoş Geldiniz</div>
                <div className="welcome-subtitle">Vergi konularında sorularınızı sorun, size yardımcı olmaya hazırım!</div>
                <div className="quick-actions">
                  <button className="quick-action" onClick={() => sendQuickMessage('KDV oranları nedir?')}>
                    KDV Oranları
                  </button>
                  <button className="quick-action" onClick={() => sendQuickMessage('Gelir vergisi dilimi nasıl hesaplanır?')}>
                    Gelir Vergisi
                  </button>
                  <button className="quick-action" onClick={() => sendQuickMessage('Kurumlar vergisi oranı kaçtır?')}>
                    Kurumlar Vergisi
                  </button>
                  <button className="quick-action" onClick={() => sendQuickMessage('Damga vergisi ne zaman ödenir?')}>
                    Damga Vergisi
                  </button>
                  <button className="quick-action" onClick={() => sendQuickMessage('Vergi beyannamesi nasıl verilir?')}>
                    Beyanname
                  </button>
                  <button className="quick-action" onClick={() => sendQuickMessage('MTV tutarları güncel mi?')}>
                    MTV
                  </button>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-avatar">
                  {message.sender === 'user' ? 'S' : 'L'}
                </div>
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="typing-indicator">
                RAG ChatBot yazıyor
                <span className="typing-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
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
                placeholder="Mesajınızı yazın..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={500}
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
              <img src="/images/luwi-logo.png" alt="Luwi Logo" className="footer-logo-img" />
              <div className="footer-company">Luwi Developments</div>
            </div>
            <div className="footer-tagline">DREAM · DESIGN · DEVELOP</div>
          </div>
        </div>

        <style jsx>{`
          .container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            padding: 20px;
          }

          .chat-container {
            width: 100%;
            max-width: 800px;
            height: 90vh;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .chat-header {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }

          .company-logo {
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 1px;
          }

          .status-indicator {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 12px;
            height: 12px;
            background: #2ecc71;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }

          .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8f9fa;
          }

          .message {
            margin-bottom: 15px;
            display: flex;
            animation: fadeIn 0.3s ease-in;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .message.user {
            justify-content: flex-end;
          }

          .message.bot {
            justify-content: flex-start;
          }

          .message-content {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
          }

          .message.user .message-content {
            background: linear-gradient(135deg, #0f3460, #16213e);
            color: white;
            border-bottom-right-radius: 4px;
          }

          .message.bot .message-content {
            background: white;
            color: #333;
            border: 1px solid #e1e8ed;
            border-bottom-left-radius: 4px;
            box-shadow: 0 2px 8px rgba(15, 52, 96, 0.1);
          }

          .message-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            margin: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            color: white;
          }

          .message.user .message-avatar {
            background: linear-gradient(135deg, #0f3460, #16213e);
            order: 2;
          }

          .message.bot .message-avatar {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
          }

          .welcome-message {
            text-align: center;
            padding: 40px 20px;
            color: #666;
          }

          .welcome-title {
            font-size: 18px;
            margin-bottom: 10px;
            color: #1a1a2e;
            font-weight: 300;
          }

          .welcome-subtitle {
            font-size: 14px;
            margin-bottom: 20px;
            color: #666;
            font-weight: 300;
          }

          .quick-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
          }

          .quick-action {
            padding: 8px 16px;
            background: #f8f9fa;
            border: 1px solid #e1e8ed;
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #666;
          }

          .quick-action:hover {
            background: linear-gradient(135deg, #0f3460, #16213e);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(15, 52, 96, 0.2);
          }

          .typing-indicator {
            padding: 10px 16px;
            font-style: italic;
            color: #666;
            font-size: 12px;
          }

          .typing-dots span {
            animation: typing 1.4s infinite;
            margin: 0 1px;
          }

          .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
          .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

          @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
          }

          .chat-input-container {
            padding: 20px;
            background: white;
            border-top: 1px solid #e1e8ed;
          }

          .input-wrapper {
            display: flex;
            gap: 10px;
            align-items: center;
          }

          .chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e1e8ed;
            border-radius: 25px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s ease;
          }

          .chat-input:focus {
            border-color: #0f3460;
            box-shadow: 0 0 0 3px rgba(15, 52, 96, 0.1);
          }

          .send-button {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #0f3460, #16213e);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .send-button:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(15, 52, 96, 0.3);
          }

          .send-button:active {
            transform: scale(0.95);
          }

          .chat-footer {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: white;
            padding: 15px 20px;
            text-align: center;
            border-top: 1px solid rgba(255,255,255,0.1);
            font-size: 12px;
          }

          .footer-logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 8px;
          }

          .footer-logo-img {
            width: 24px;
            height: 24px;
            object-fit: contain;
            filter: brightness(0) invert(1);
          }

          .footer-company {
            font-weight: 500;
            letter-spacing: 1px;
            font-size: 13px;
          }

          .footer-tagline {
            opacity: 0.8;
            font-weight: 300;
            letter-spacing: 2px;
            font-size: 10px;
          }
        `}</style>
      </div>
    </>
  );
}