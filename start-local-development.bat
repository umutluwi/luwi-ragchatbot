@echo off
color 0A
title Luwi RAG ChatBot - Local Setup

echo ================================================================
echo        🚀 LUWI RAG CHATBOT - LOCAL DEVELOPMENT SETUP
echo ================================================================
echo.

:: Step 1: Node.js Check
echo [1/6] 🔍 Node.js kontrol ediliyor...
node --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js kurulu değil!
    echo 📥 https://nodejs.org adresinden Node.js'i indirin
    pause
    exit /b 1
) else (
    echo ✅ Node.js kurulu: 
    node --version
)

:: Step 2: NPM Check
echo.
echo [2/6] 📦 NPM kontrol ediliyor...
npm --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ NPM kurulu değil!
    pause
    exit /b 1
) else (
    echo ✅ NPM kurulu:
    npm --version
)

:: Step 3: N8N Check
echo.
echo [3/6] 🔗 N8N durumu kontrol ediliyor...
echo 📍 N8N'in http://localhost:5678 adresinde çalıştığından emin olun
echo.
curl -s -o nul http://localhost:5678 2>nul
if %errorlevel% equ 0 (
    echo ✅ N8N erişilebilir
) else (
    echo ⚠️  N8N'e erişilemiyor
    echo 🔧 N8N'i başlatmak için ayrı bir terminal'de şu komutu çalıştırın:
    echo    npx n8n
    echo.
    set /p "continue=Devam etmek istiyor musunuz? (y/n): "
    if /i not "%continue%"=="y" exit /b 1
)

:: Step 4: Project Directory
echo.
echo [4/6] 📁 Proje dizinine geçiliyor...
cd /d "C:\Users\umut.demirci\Desktop\n8n\rag-chatbot\frontend-nextjs"
if %errorlevel% neq 0 (
    echo ❌ Proje dizini bulunamadı!
    pause
    exit /b 1
)
echo ✅ Proje dizini: %cd%

:: Step 5: Dependencies
echo.
echo [5/6] 🔄 Dependencies kontrol ediliyor...
if not exist "node_modules" (
    echo 📥 Dependencies yükleniyor...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ NPM install başarısız!
        pause
        exit /b 1
    )
    echo ✅ Dependencies yüklendi
) else (
    echo ✅ Dependencies mevcut
)

:: Step 6: Environment Check
echo.
echo [6/6] ⚙️  Environment dosyası kontrol ediliyor...
if exist ".env.local" (
    echo ✅ .env.local dosyası mevcut
    echo 📋 Webhook URL:
    findstr "N8N_WEBHOOK_URL" .env.local
) else (
    echo ❌ .env.local dosyası bulunamadı!
    pause
    exit /b 1
)

:: Start Development Server
echo.
echo ================================================================
echo                    🎉 SETUP TAMAMLANDI!
echo ================================================================
echo.
echo 🚀 Development server başlatılıyor...
echo 🌐 Tarayıcınızda http://localhost:3000 açılacak
echo 🔄 Değişiklikleri canlı izleyebilirsiniz
echo 🛑 Durdurmak için Ctrl+C kullanın
echo.
pause

echo 🚀 Starting Next.js development server...
npm run dev

echo.
echo 👋 Development server durduruldu.
pause
