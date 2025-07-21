@echo off
echo ========================================
echo Luwi RAG ChatBot - Production Build
echo ========================================
echo.

:: Navigate to frontend-nextjs directory
cd /d "C:\Users\umut.demirci\Desktop\n8n\rag-chatbot\frontend-nextjs"

echo 🧹 Eski build dosyalarini temizleme...
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"

echo.
echo 📦 NPM paketlerini kontrol ediyor...
call npm install

echo.
echo 🔨 Production build baslatiliyor...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build basarisiz! Hatalari kontrol edin.
    pause
    exit /b 1
)

echo.
echo ✅ Build basarili!
echo.
echo 🚀 Production sunucusu baslatiliyor...
echo 📍 Uygulama http://localhost:3000 adresinde calisacak
echo 🛑 Durdurmak icin Ctrl+C tuslayin
echo.

:: Production modda başlat
call npm start

pause
