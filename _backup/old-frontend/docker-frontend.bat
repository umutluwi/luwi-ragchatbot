@echo off
echo 🐳 Docker ile frontend başlatma...

cd /d "C:\Users\umut.demirci\Desktop\n8n\rag-chatbot"

echo 📦 Docker kontrolü...
docker --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Docker kurulu değil!
    echo 📥 Docker Desktop indirme linkini açıyor...
    start https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo ✅ Docker mevcut
echo.
echo 🚀 Frontend container başlatılıyor...
docker-compose up -d frontend

echo.
echo ⏳ Container hazır olmayı bekliyor...
timeout /t 10 /nobreak

echo.
echo 🌐 Frontend erişim: http://localhost:3000
echo 📊 Container durumu:
docker-compose ps

echo.
echo 📝 Logları görmek için: docker-compose logs -f frontend
pause
