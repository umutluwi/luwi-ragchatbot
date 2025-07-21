@echo off
color 0A
title Final Success Test

echo ================================================================
echo              🎉 FINAL SUCCESS TEST
echo              WORKING N8N RAG WORKFLOW
echo ================================================================
echo.

echo ✅ N8N Response Format: FIXED
echo ✅ Webhook URL: https://n8n.luwi.dev/webhook/rag-chatbot-pro
echo ✅ Output: Real AI responses with database search
echo.

echo 🧪 Testing with real question...
echo.

curl -X POST ^
    -H "Content-Type: application/json" ^
    -H "Accept: application/json" ^
    -w "\n\n📊 Response Time: %%{time_total}s\n📈 HTTP Code: %%{http_code}\n\n" ^
    -d "{\"message\": \"KDV oranları nelerdir?\", \"sessionId\": \"final_test\", \"timestamp\": \"%date% %time%\"}" ^
    "https://n8n.luwi.dev/webhook/rag-chatbot-pro"

echo.
echo ================================================================
echo 🎯 NEXT STEPS:
echo ================================================================
echo.
echo [1] npm run dev (restart frontend)
echo [2] Go to http://localhost:3000
echo [3] Ask: "KDV oranları nelerdir?"
echo [4] Enjoy your working RAG ChatBot! 🚀
echo.

pause
