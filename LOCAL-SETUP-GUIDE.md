# 🚀 Luwi RAG ChatBot - Local Setup Rehberi

## ✅ HIZLI BAŞLATMA

### 1️⃣ N8N'i Başlatın
```bash
# Terminal 1'de
cd C:\Users\umut.demirci\Desktop\n8n
npx n8n
```

### 2️⃣ Workflow'u İçe Aktarın
- http://localhost:5678 adresine gidin
- Workflows > Import seçin
- `C:\Users\umut.demirci\Desktop\n8n\rag-chatbot\workflows\RAGChat-Pro-v2.json` dosyasını seçin
- Workflow'u aktif hale getirin

### 3️⃣ Frontend'i Başlatın (İki Seçenek)

#### A) Next.js Development Server
```bash
# Terminal 2'de
cd C:\Users\umut.demirci\Desktop\n8n\rag-chatbot\frontend-nextjs
npm install
npm run dev
```
Sonra: http://localhost:3000

#### B) Hızlı HTML Test
- `C:\Users\umut.demirci\Desktop\n8n\rag-chatbot\src\test-local.html` dosyasını tarayıcıda açın

## 🔧 SORUN GİDERME

### N8N Bağlantı Sorunları
1. N8N çalışıyor mu? → http://localhost:5678
2. Workflow aktif mi? → Workflows listesinde kontrol edin
3. Webhook path doğru mu? → `/webhook/ragchat-pro-v2`

### Test Komutları
```bash
# N8N webhook test
.\test-n8n-webhooks.bat

# Full development setup
.\start-local-development.bat
```

### Manuel Test
```bash
curl -X POST -H "Content-Type: application/json" -d "{\"message\":\"test\",\"sessionId\":\"debug\"}" http://localhost:5678/webhook/ragchat-pro-v2
```

## 📁 DOSYA YAPIsı

```
rag-chatbot/
├── workflows/
│   └── RAGChat-Pro-v2.json     # N8N workflow
├── frontend-nextjs/
│   ├── .env.local              # Webhook URL (güncellendi)
│   ├── app/api/chat/route.ts   # API endpoint
│   └── app/page.tsx            # Main chat component
├── src/
│   ├── test-local.html         # Hızlı test sayfası
│   └── luwi-rag-chatbot.html   # Ana HTML versiyonu
├── start-local-development.bat  # Otomatik setup
└── test-n8n-webhooks.bat      # Webhook test
```

## 🎯 WEBHOOK URL'LER

Sırasıyla test edilecek:
1. `http://localhost:5678/webhook/ragchat-pro-v2` (ana)
2. `http://localhost:5678/webhook/luwi-rag-chat` (alternatif)
3. `http://localhost:5678/webhook/rag-chatbot-pro` (eski)

## 🐛 DEBUG

Tarayıcı console'unda:
```javascript
// Next.js app için
console.log('Frontend debug bilgileri:', window.location)

// HTML test için
window.debugRAG()
```

## ✨ BAŞARILI KURULUM KONTROLÜ

✅ N8N http://localhost:5678 açılıyor
✅ Workflow "RAGChat Pro - v2" aktif
✅ Frontend http://localhost:3000 çalışıyor
✅ Mesaj gönderince yanıt alınıyor
✅ Bağlantı durumu "online" görünüyor

## 🚨 ACİL DURUMDA

Hiçbir şey çalışmıyorsa:
1. `test-local.html` dosyasını açın
2. "Bağlantı Test" butonuna tıklayın
3. Debug bilgilerini kontrol edin
4. Console'dan hata mesajlarını kopyalayın

## 🏆 ÖNERİLER

- İlk test için `test-local.html` kullanın
- Çalıştıktan sonra Next.js versiyonuna geçin
- Webhook URL'ini .env.local'de güncelleyin
- N8N workflow'unu export edip yedekleyin
