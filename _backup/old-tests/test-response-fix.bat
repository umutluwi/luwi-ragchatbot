@echo off
color 0C
title N8N Response Fix Test

echo ================================================================
echo              🔧 N8N RESPONSE FIX TEST
echo ================================================================
echo.

echo 🎯 Testing fixed webhook response...
echo.

echo 📡 URL: https://n8n.luwi.dev/webhook/rag-chatbot-pro
echo 💬 Message: "KDV oranları test"
echo.

curl -X POST ^
    -H "Content-Type: application/json" ^
    -H "Accept: application/json" ^
    -w "\n\n📊 Response Time: %%{time_total}s\n📏 Response Size: %%{size_download} bytes\n📈 HTTP Code: %%{http_code}\n\n" ^
    -d "{\"message\": \"KDV oranları nelerdir?\", \"sessionId\": \"fix_test_123\", \"timestamp\": \"%date% %time%\"}" ^
    "https://n8n.luwi.dev/webhook/rag-chatbot-pro"

echo.
echo ================================================================
echo 🔍 BEKLENEN SONUÇ:
echo ================================================================
echo.
echo ✅ {"response": "Gerçek AI yanıtı..."}
echo ❌ {"error": "Invalid JSON..."}  
echo ❌ Boş response veya timeout
echo.
echo 📋 N8N'de düzeltme adımları:
echo [1] Respond Success node'unu açın
echo [2] Response Body'yi düzeltin
echo [3] Workflow'u kaydedin
echo [4] Bu testi tekrar çalıştırın
echo.

pause
