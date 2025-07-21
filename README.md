# 🤖 Luwi RAG ChatBot v2.0

Türkiye Vergi Mevzuatı odaklı RAG (Retrieval-Augmented Generation) ChatBot uygulaması.

## 🚀 Hızlı Başlangıç

### 1. Full Build (Docker)
```bash
# Windows
build.bat

# Linux/Mac
./build.sh
```

### 2. Sadece Frontend Development
```bash
cd frontend-nextjs
npm install
npm run dev
```

### 3. API Test
```bash
# Windows
test-api.bat

# Manuel curl test
curl -X POST -H "Content-Type: application/json" -d '{"message": "Test mesajı", "sessionId": "test-123"}' https://n8n.luwi.dev/webhook/rag-chatbot-pro
```

## 🔗 Erişim URL'leri

- **Frontend**: http://localhost:3000
- **N8N Admin**: http://localhost:5678  
- **PostgreSQL**: localhost:5432
- **Live N8N Webhook**: https://n8n.luwi.dev/webhook/rag-chatbot-pro

## 📊 Aktif N8N Workflow'ları

1. **RAGChat Pro** - ✅ Çalışıyor
   - URL: `/webhook/rag-chatbot-pro`
   - Features: OpenAI GPT-4o-mini, PostgreSQL tools, Vector search

2. **RagChatBot gpt style** - ⚠️ Hata var
   - URL: `/webhook/ragchatbotpro-fixed`

3. **MM RAG ChatBot** - ⚠️ Hata var
   - URL: `/webhook/27cdacd2-db50-4040-a3bb-ce0c63fdd90f`

## 🛠️ Sorun Giderme

### Bağlantı Hatası
```bash
# N8N servis kontrolü
docker ps | grep n8n

# N8N logları
docker logs rag_n8n

# Manuel webhook test
curl https://n8n.luwi.dev/webhook/rag-chatbot-pro
```

### Frontend Hatası
```bash
# Dependencies yeniden yükle
cd frontend-nextjs
rm -rf node_modules
npm install

# Environment kontrol
cat .env.local
```

## 🔧 Konfigürasyon

### Environment Variables
```env
N8N_WEBHOOK_URL=https://n8n.luwi.dev/webhook/rag-chatbot-pro
POSTGRES_HOST=localhost
POSTGRES_PASSWORD=your_password_here
```

### N8N Workflow Import
1. N8N Admin Panel: http://localhost:5678
2. Import workflow: `RAGChat Pro.json`
3. Activate workflow

## 📋 Teknoloji Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: N8N Workflows, OpenAI GPT-4o-mini
- **Database**: PostgreSQL + pgvector
- **Deployment**: Docker Compose

## 📞 Destek

- **Geliştirici**: Luwi Developments
- **Tagline**: ✨ DREAM · DESIGN · DEVELOP ✨
- **Website**: https://luwi.dev

---
🔥 **Luwi RAG ChatBot v2.0** - Updated with working webhooks!
