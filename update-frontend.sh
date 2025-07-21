#!/bin/bash

# Frontend'i yeniden build et ve restart et
echo "🔄 Frontend yeniden build ediliyor..."

# Sadece frontend'i rebuild et
docker-compose build frontend --no-cache

# Frontend container'ını restart et
docker-compose restart frontend

echo "✅ Frontend güncellendi!"
echo "🌐 ChatBot: http://localhost:3000"

# N8N workflow import talimatları
echo ""
echo "📋 N8N Workflow Import Adımları:"
echo "1. http://localhost:5678 adresine git"
echo "2. Workflows > Import seçeneğini kullan"
echo "3. /workflows/RAGChat-Pro-v2.json dosyasını import et"
echo "4. Webhook URL: http://localhost:5678/webhook/ragchat-pro-v2"