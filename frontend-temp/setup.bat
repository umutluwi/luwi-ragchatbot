@echo off
echo ========================================
echo Luwi RAG ChatBot - Next.js Setup
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js bulunamadi! Lutfen Node.js yukleyin:
    echo https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js bulundu
node --version

:: Navigate to project directory
cd /d "%~dp0"

echo.
echo 📦 NPM paketleri yukleniyor...
call npm install

if %errorlevel% neq 0 (
    echo ❌ NPM install basarisiz!
    pause
    exit /b 1
)

echo.
echo ✅ Paketler basariyla yuklendi!

echo.
echo 🔧 Environment dosyasi kontrol ediliyor...
if not exist ".env.local" (
    echo ⚠️  .env.local dosyasi bulunamadi, olusturuluyor...
    copy .env.example .env.local >nul 2>&1
)

echo.
echo 🚀 Development sunucusu baslatiliyor...
echo.
echo 📍 Uygulama http://localhost:3000 adresinde calisacak
echo 🛑 Durdurmak icin Ctrl+C tuslayın
echo.

call npm run dev

pause