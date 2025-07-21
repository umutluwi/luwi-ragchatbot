@echo off
color 0D
title JSON Expression Fix Test

echo ================================================================
echo              🔧 JSON EXPRESSION FIX TEST
echo ================================================================
echo.

echo 🎯 Testing N8N JSON expression fix...
echo.
echo 📋 Try these expressions in N8N:
echo [1] ={ "response": $json[0].output }
echo [2] ={{ JSON.stringify({ response: $json[0].output }) }}
echo [3] Change "Respond With" to "JSON" and use: ={ response: $json[0].output }
echo.

echo 📡 Testing current setup...
echo.

curl -X POST ^
    -H "Content-Type: application/json" ^
    -H "Accept: application/json" ^
    -w "\n\n📈 HTTP: %%{http_code} | ⏱️  %%{time_total}s | 📏 %%{size_download}b\n\n" ^
    -d "{\"message\": \"JSON test\", \"sessionId\": \"json_fix_test\", \"timestamp\": \"%date% %time%\"}" ^
    "https://n8n.luwi.dev/webhook/rag-chatbot-pro"

echo ================================================================
echo 🔍 EXPECTED RESULTS:
echo ================================================================
echo.
echo ✅ SUCCESS: {"response": "Real AI text response..."}
echo ❌ ERROR: [{"error": "Invalid JSON..."}]  
echo 🔄 PROGRESS: Any other JSON structure
echo.
echo 📋 N8N Expression Debugging:
echo - Remove quotes around expressions
echo - Use = instead of {{ }} for object expressions  
echo - Test with Set node first
echo.

pause
