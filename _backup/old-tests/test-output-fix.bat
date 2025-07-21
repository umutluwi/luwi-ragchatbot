@echo off
color 0E
title N8N Output Fix Test

echo ================================================================
echo              🔧 N8N OUTPUT FIX TEST
echo ================================================================
echo.

echo 🎯 Testing array output fix...
echo 📊 Expected: {"response": "Actual AI response text..."}
echo ❌ Current: {"error": "Invalid JSON..."}
echo.

echo 📡 Sending test request...
echo.

curl -X POST ^
    -H "Content-Type: application/json" ^
    -H "Accept: application/json" ^
    -w "\n\n📈 HTTP Code: %%{http_code}\n📏 Size: %%{size_download} bytes\n⏱️  Time: %%{time_total}s\n\n" ^
    -d "{\"message\": \"KDV oranları test\", \"sessionId\": \"output_fix_test\", \"timestamp\": \"%date% %time%\"}" ^
    "https://n8n.luwi.dev/webhook/rag-chatbot-pro"

echo ================================================================
echo 🔍 RESPONSE ANALYSIS:
echo ================================================================
echo.
echo ✅ Success: Valid JSON with "response" field
echo ❌ Error: "Invalid JSON" or empty response  
echo 🐛 Debug: Use debug option to see data structure
echo.
echo 📋 Next steps:
echo [1] Update N8N Response Body with correct expression
echo [2] Save workflow  
echo [3] Test again
echo [4] Check frontend at localhost:3000
echo.

pause
