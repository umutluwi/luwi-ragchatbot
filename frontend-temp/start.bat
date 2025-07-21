@echo off
echo 🚀 Luwi RAG ChatBot Baslatiliyor...
echo ==================================
echo.

:: Bağımlılıkları kontrol et
if not exist node_modules (
    echo 📦 Paketler yukleniyor...
    npm install
    echo.
)

:: .env.local dosyasını kontrol et
if not exist .env.local (
    echo ⚠️  .env.local dosyasi bulunamadi!
    echo 📝 Ornekten kopyalaniyor...
    copy .env.local.example .env.local
    echo ✅ .env.local olusturuldu. Lutfen ayarlari kontrol edin.
    echo.
)

:: n8n webhook'u test et
echo 🔗 n8n Webhook kontrol ediliyor...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" -X POST https://n8n.luwi.dev/webhook/rag-chatbot-pro -H "Content-Type: application/json" -d "{\"message\":\"ping\"}"
echo.

:: Uygulamayı başlat
echo ✨ Uygulama baslatiliyor...
echo 🌐 Tarayicinizda http://localhost:3000 adresini acin
echo.
echo Durdurmak icin Ctrl+C
echo.

npm run dev