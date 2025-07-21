#!/bin/bash

echo "🚀 Luwi RAG ChatBot Test Script"
echo "================================"

# API URL
API_URL="http://localhost:3000/api"
N8N_URL="https://n8n.luwi.dev/webhook/rag-chatbot-pro"

echo ""
echo "1️⃣ n8n Webhook Bağlantı Testi..."
echo "URL: $N8N_URL"

# Test n8n connection
curl -X POST $N8N_URL \
  -H "Content-Type: application/json" \
  -d '{"message": "Test mesajı", "session_id": "test-123"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "2️⃣ Chat API Testi..."
echo "URL: $API_URL/chat"

# Test chat API
curl -X POST $API_URL/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "KDV oranları nelerdir?", "session_id": "test-session"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "3️⃣ Query API Testi..."
echo "URL: $API_URL/query"

# Test query API
curl -X POST $API_URL/query \
  -H "Content-Type: application/json" \
  -d '{"query": "KDV", "type": "search"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "✅ Test tamamlandı!"
echo ""
echo "📝 Manuel Test Adımları:"
echo "1. npm install"
echo "2. npm run dev"
echo "3. http://localhost:3000 adresini açın"
echo "4. Chat arayüzünde test mesajları gönderin"
echo "5. Veritabanı sorgulama butonuna (🗄️) tıklayın"
echo "6. Örnek sorguları test edin"