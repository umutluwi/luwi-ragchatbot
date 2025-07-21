@echo off
echo 🔍 Node.js kurulum kontrolü...

:: Node.js versiyonu kontrol et
node --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js kurulu değil!
    echo 📥 Node.js indirme linkini açıyor...
    start https://nodejs.org/en/download/
    echo.
    echo ⚠️  Node.js'i indirip kurduktan sonra bu scripti tekrar çalıştırın
    pause
    exit /b 1
) else (
    echo ✅ Node.js kurulu
    node --version
)

:: NPM versiyonu kontrol et
npm --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ NPM kurulu değil!
    pause
    exit /b 1
) else (
    echo ✅ NPM kurulu
    npm --version
)

echo.
echo 🚀 Frontend kuruluma geçiliyor...
cd /d "C:\Users\umut.demirci\Desktop\n8n\rag-chatbot\frontend-nextjs"

echo 📦 Dependencies yükleniyor...
npm install

if %errorlevel% neq 0 (
    echo ❌ NPM install başarısız!
    pause
    exit /b 1
)

echo ✅ Dependencies yüklendi!
echo.
echo 🌐 Development server başlatılıyor...
npm run dev

pause
