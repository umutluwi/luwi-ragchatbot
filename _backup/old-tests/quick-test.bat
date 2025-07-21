@echo off
color 0A
title N8N Quick Test

echo ================================================================
echo                   🧪 N8N WEBHOOK QUICK TEST
echo ================================================================
echo.

echo 🔄 Testing all possible webhook URLs...
echo.

set URLS[0]=http://localhost:5678/webhook/ragchat-pro-v2
set URLS[1]=http://localhost:5678/webhook/luwi-rag-chat
set URLS[2]=http://localhost:5678/webhook/rag-chatbot-pro

for %%i in (0 1 2) do (
    echo 📡 Testing: !URLS[%%i]!
    
    curl -s -X POST ^
        -H "Content-Type: application/json" ^
        -H "Accept: application/json" ^
        -d "{\"message\": \"Test mesajı %%i\", \"sessionId\": \"test_%%i\", \"timestamp\": \"%date% %time%\"}" ^
        !URLS[%%i]! 2>nul
    
    if !errorlevel! equ 0 (
        echo ✅ ÇALIŞIYOR: !URLS[%%i]!
        echo.
    ) else (
        echo ❌ Çalışmıyor: !URLS[%%i]!
        echo.
    )
)

echo ================================================================
echo 🌐 Frontend Test: http://localhost:3000
echo 🔧 N8N Admin: http://localhost:5678
echo ================================================================

echo.
echo 📋 Kontrol Listesi:
echo [1] N8N çalışıyor mu? (http://localhost:5678)
echo [2] RAGChat Pro v2 workflow aktif mi?
echo [3] Frontend çalışıyor mu? (http://localhost:3000)
echo.

pause
