@echo off
:: Luwi RAG ChatBot API Test
echo 🧪 API Test başlatılıyor...

echo.
echo 📍 Test URL: https://n8n.luwi.dev/webhook/rag-chatbot-pro
echo.

curl -X POST ^
  -H "Content-Type: application/json" ^
  -H "User-Agent: Luwi-RAG-ChatBot-Test/2.0" ^
  -d "{\"message\": \"Merhaba, bu bir test mesajıdır\", \"sessionId\": \"test-session-123\"}" ^
  https://n8n.luwi.dev/webhook/rag-chatbot-pro

echo.
echo.
echo ✅ Test tamamlandı!
pause
