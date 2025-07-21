@echo off
color 0B
title Remote N8N Test

echo ================================================================
echo              🌐 REMOTE N8N WEBHOOK TEST
echo              https://n8n.luwi.dev
echo ================================================================
echo.

echo 🔄 Testing remote webhook URLs...
echo.

set "URLS[0]=https://n8n.luwi.dev/webhook/ragchat-pro-v2"
set "URLS[1]=https://n8n.luwi.dev/webhook/luwi-rag-chat"
set "URLS[2]=https://n8n.luwi.dev/webhook/rag-chatbot-pro"

echo 📍 Test URL 1: %URLS[0]%
curl -X POST ^
    -H "Content-Type: application/json" ^
    -H "Accept: application/json" ^
    -H "User-Agent: Luwi-Test/1.0" ^
    -d "{\"message\": \"Test mesajı 1\", \"sessionId\": \"test_remote_1\", \"timestamp\": \"%date% %time%\", \"source\": \"batch_test\"}" ^
    "%URLS[0]%"

echo.
echo.

echo 📍 Test URL 2: %URLS[1]%
curl -X POST ^
    -H "Content-Type: application/json" ^
    -H "Accept: application/json" ^
    -H "User-Agent: Luwi-Test/1.0" ^
    -d "{\"message\": \"Test mesajı 2\", \"sessionId\": \"test_remote_2\", \"timestamp\": \"%date% %time%\", \"source\": \"batch_test\"}" ^
    "%URLS[1]%"

echo.
echo.

echo 📍 Test URL 3: %URLS[2]%
curl -X POST ^
    -H "Content-Type: application/json" ^
    -H "Accept: application/json" ^
    -H "User-Agent: Luwi-Test/1.0" ^
    -d "{\"message\": \"Test mesajı 3\", \"sessionId\": \"test_remote_3\", \"timestamp\": \"%date% %time%\", \"source\": \"batch_test\"}" ^
    "%URLS[2]%"

echo.
echo.
echo ================================================================
echo 🎯 SONUÇLAR:
echo ================================================================
echo.
echo ✅ Eğer JSON yanıt aldıysanız = Webhook çalışıyor
echo ❌ Eğer HTML/Error aldıysanız = Webhook problemi var
echo 🔌 Eğer connection error = Sunucu erişilemiyor
echo.
echo 🌐 Frontend Test: http://localhost:3000
echo 🔧 N8N Admin: https://n8n.luwi.dev
echo.
echo 📋 Bir sonraki adım:
echo [1] Next.js server'ı yeniden başlatın: npm run dev
echo [2] localhost:3000'e gidin
echo [3] Debug mode'u açın
echo [4] "Bağlantı Test" yapın
echo.

pause
