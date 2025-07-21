@echo off
:: Luwi RAG ChatBot Build Script - Windows
echo 🚀 Luwi RAG ChatBot Build Başlatılıyor (v2.0)...

:: Change to project directory
cd /d "C:\Users\umut.demirci\Desktop\n8n\rag-chatbot"

:: Docker Compose ile build ve başlatma
echo 📦 Docker servisleri build ediliyor...
docker-compose down --remove-orphans
docker-compose build --no-cache

echo 🔧 Servisleri başlatma...
docker-compose up -d

echo ⏳ Servislerin hazır olması bekleniyor...
timeout /t 15 /nobreak

:: Sağlık kontrolü
echo 🏥 Sağlık kontrolü yapılıyor...

:: PostgreSQL kontrolü
echo 🐘 PostgreSQL kontrolü...
docker exec rag_postgres pg_isready -U postgres

:: N8N kontrolü
echo 🔄 N8N kontrolü...
curl -f http://localhost:5678/healthz

:: Frontend kontrolü
echo 🌐 Frontend kontrolü...
curl -f http://localhost:3000

echo.
echo ✅ Build tamamlandı!
echo.
echo 🔗 Erişim Linkleri:
echo    Frontend (ChatBot): http://localhost:3000
echo    N8N Admin: http://localhost:5678
echo    PostgreSQL: localhost:5432
echo.
echo 📊 Durum kontrolü için: docker-compose ps
echo 📝 Logları görmek için: docker-compose logs -f
echo.
pause
