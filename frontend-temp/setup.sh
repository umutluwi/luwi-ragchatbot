#!/bin/bash

echo "========================================"
echo "Luwi RAG ChatBot - Next.js Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js bulunamadı! Lütfen Node.js yükleyin:"
    echo "https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js bulundu"
node --version

# Navigate to script directory
cd "$(dirname "$0")"

echo ""
echo "📦 NPM paketleri yükleniyor..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ NPM install başarısız!"
    exit 1
fi

echo ""
echo "✅ Paketler başarıyla yüklendi!"

echo ""
echo "🔧 Environment dosyası kontrol ediliyor..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local dosyası bulunamadı, oluşturuluyor..."
    cp .env.example .env.local 2>/dev/null || true
fi

echo ""
echo "🚀 Development sunucusu başlatılıyor..."
echo ""
echo "📍 Uygulama http://localhost:3000 adresinde çalışacak"
echo "🛑 Durdurmak için Ctrl+C tuşlayın"
echo ""

npm run dev