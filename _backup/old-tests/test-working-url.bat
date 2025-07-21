@echo off
color 0A
title Working N8N Test

echo ================================================================
echo              ✅ WORKING N8N WEBHOOK TEST
echo              https://n8n.luwi.dev/webhook/rag-chatbot-pro
echo ================================================================
echo.

echo 🎯 Testing the WORKING webhook URL...
echo.

echo 📡 URL: https://n8n.luwi.dev/webhook/rag-chatbot-pro
echo.

curl -v -X POST ^
    -H "Content-Type: application/json" ^
    -H "Accept: application/json" ^
    -H "User-Agent: Luwi-Test/1.0" ^
    -d "{\"message\": \"KDV oranları nelerdir?\", \"sessionId\": \"test_working_url\", \"timestamp\": \"%date% %time%\", \"source\": \"batch_test\"}" ^
    "https://n8n.luwi.dev/webhook/rag-chatbot-pro"

echo.
echo.
echo ================================================================
echo 📊 ANALIZ:
echo ================================================================
echo.
echo ✅ Status 200 = Webhook erişilebilir
echo 📄 JSON response = Workflow çalışıyor  
echo 📋 Empty response = Workflow output problemi
echo ❌ Error = Bağlantı/Workflow problemi
echo.
echo 🔧 Bir sonraki adımlar:
echo [1] Next.js'i yeniden başlat: npm run dev
echo [2] localhost:3000 test et
echo [3] Console'da response'u kontrol et
echo.

pause
