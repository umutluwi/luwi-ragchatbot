@echo off
color 0E
title N8N Webhook Test

echo ================================================================
echo              🧪 N8N WEBHOOK TEST UTILITY
echo ================================================================
echo.

set WEBHOOK_URLS[0]=http://localhost:5678/webhook/ragchat-pro-v2
set WEBHOOK_URLS[1]=http://localhost:5678/webhook/luwi-rag-chat
set WEBHOOK_URLS[2]=http://localhost:5678/webhook/rag-chatbot-pro

echo 🔍 Test edilecek webhook URL'leri:
echo [1] %WEBHOOK_URLS[0]%
echo [2] %WEBHOOK_URLS[1]%
echo [3] %WEBHOOK_URLS[2]%
echo [4] Özel URL gir
echo [5] Tümünü test et
echo.

set /p "choice=Seçiminizi yapın (1-5): "

if "%choice%"=="1" set TEST_URL=%WEBHOOK_URLS[0]%
if "%choice%"=="2" set TEST_URL=%WEBHOOK_URLS[1]%
if "%choice%"=="3" set TEST_URL=%WEBHOOK_URLS[2]%
if "%choice%"=="4" (
    set /p "TEST_URL=Webhook URL'inizi girin: "
)
if "%choice%"=="5" goto TEST_ALL

if not defined TEST_URL (
    echo ❌ Geçersiz seçim!
    pause
    exit /b 1
)

:TEST_SINGLE
echo.
echo 📡 Test ediliyor: %TEST_URL%
echo.

curl -X POST ^
    -H "Content-Type: application/json" ^
    -H "Accept: application/json" ^
    -d "{\"message\": \"Merhaba, bu bir test mesajıdır\", \"sessionId\": \"test_%RANDOM%\", \"timestamp\": \"%date% %time%\"}" ^
    %TEST_URL%

echo.
echo.
if %errorlevel% equ 0 (
    echo ✅ Test başarılı!
) else (
    echo ❌ Test başarısız!
    echo 🔧 Kontrol edilecekler:
    echo    - N8N çalışıyor mu? ^(http://localhost:5678^)
    echo    - Workflow aktif mi?
    echo    - Webhook path doğru mu?
)
goto END

:TEST_ALL
echo.
echo 🔄 Tüm URL'ler test ediliyor...

for %%i in (0 1 2) do (
    echo.
    echo 📡 Test ediliyor: !WEBHOOK_URLS[%%i]!
    
    curl -s -X POST ^
        -H "Content-Type: application/json" ^
        -d "{\"message\": \"Test %%i\", \"sessionId\": \"test_%%i\"}" ^
        !WEBHOOK_URLS[%%i]! > nul
    
    if !errorlevel! equ 0 (
        echo ✅ Başarılı: !WEBHOOK_URLS[%%i]!
    ) else (
        echo ❌ Başarısız: !WEBHOOK_URLS[%%i]!
    )
)

:END
echo.
echo 📊 Test tamamlandı!
pause
