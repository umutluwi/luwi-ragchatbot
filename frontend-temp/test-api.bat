@echo off
echo 🚀 Luwi RAG ChatBot Test Script
echo ================================
echo.

set API_URL=http://localhost:3000/api
set N8N_URL=https://n8n.luwi.dev/webhook/rag-chatbot-pro

echo 1️⃣ n8n Webhook Baglanti Testi...
echo URL: %N8N_URL%
echo.

echo Test mesaji gonderiliyor...
curl -X POST %N8N_URL% -H "Content-Type: application/json" -d "{\"message\": \"Test mesaji\", \"session_id\": \"test-123\"}"
echo.
echo.

echo 2️⃣ Chat API Testi...
echo URL: %API_URL%/chat
echo.

curl -X POST %API_URL%/chat -H "Content-Type: application/json" -d "{\"message\": \"KDV oranlari nelerdir?\", \"session_id\": \"test-session\"}"
echo.
echo.

echo 3️⃣ Query API Testi...
echo URL: %API_URL%/query
echo.

curl -X POST %API_URL%/query -H "Content-Type: application/json" -d "{\"query\": \"KDV\", \"type\": \"search\"}"
echo.
echo.

echo ✅ Test tamamlandi!
echo.
echo 📝 Manuel Test Adimlari:
echo 1. npm install
echo 2. npm run dev
echo 3. http://localhost:3000 adresini acin
echo 4. Chat arayuzunde test mesajlari gonderin
echo 5. Veritabani sorgulama butonuna (🗄️) tiklayin
echo 6. Ornek sorgulari test edin
echo.
pause