# Luwi RAG ChatBot - Frontend

## 🚀 Hızlı Başlangıç

### Kurulum
```bash
cd C:\Users\umut.demirci\Desktop\n8n\rag-chatbot\frontend-nextjs
npm install
```

### Çalıştırma
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 🔧 Özellikler

### 1. Chat Arayüzü
- Gerçek zamanlı sohbet
- n8n webhook entegrasyonu
- Session yönetimi
- Yazma göstergesi

### 2. Veritabanı Sorgulama (Yeni!)
- PostgreSQL veritabanını sorgulama
- 3 farklı sorgu tipi:
  - **Arama**: Vergi konularında arama
  - **Analitik**: İstatistiksel sorgular
  - **Metadata**: Sistem bilgileri

### 3. UI Özellikleri
- Modern glassmorphism tasarım
- Animasyonlu arka plan
- Responsive tasarım
- Hızlı erişim butonları

## 📡 API Endpoints

### Chat API
```
POST /api/chat
Body: {
  "message": "Kullanıcı mesajı",
  "session_id": "opsiyonel-session-id"
}
```

### Query API
```
POST /api/query
Body: {
  "query": "Sorgu metni",
  "type": "search|analytics|metadata"
}
```

## 🧪 Test Senaryoları

### 1. Chat Testi
```javascript
// Test mesajları:
- "KDV oranları nelerdir?"
- "Gelir vergisi dilimi nasıl hesaplanır?"
- "Damga vergisi ne zaman ödenir?"
```

### 2. Veritabanı Sorgu Testi
```javascript
// Arama sorguları:
- "KDV oranları"
- "Gelir vergisi"
- "Stopaj"

// Analitik sorguları:
- "En çok sorulan konular"
- "Son 7 günlük aktivite"

// Metadata sorguları:
- "Toplam döküman sayısı"
- "Veri kaynakları"
```

## 🔌 n8n Webhook Bağlantısı

Webhook URL: `https://n8n.luwi.dev/webhook/rag-chatbot-pro`

### Bağlantı Kontrolü
1. n8n workflow'unun aktif olduğundan emin olun
2. Webhook URL'nin doğru olduğunu kontrol edin
3. CORS ayarlarının yapılandırıldığını doğrulayın

## 🛠️ Ortam Değişkenleri

`.env.local` dosyası:
```env
N8N_WEBHOOK_URL=https://n8n.luwi.dev/webhook/rag-chatbot-pro
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
POSTGRES_DATABASE=rag_chatbot
```

## 📝 Notlar

- PostgreSQL bağlantısı şu anda n8n üzerinden yapılmaktadır
- Direkt veritabanı bağlantısı için ek paketler gerekebilir
- Session bilgisi otomatik olarak oluşturulur

## 🐛 Sorun Giderme

### n8n Bağlantı Hatası
- n8n workflow'unun aktif olduğundan emin olun
- Webhook URL'yi kontrol edin
- Network sekmesinde hataları inceleyin

### Veritabanı Sorgu Hatası
- n8n'de PostgreSQL tool'larının yapılandırıldığından emin olun
- Sorgu tipinin doğru seçildiğini kontrol edin

## 📞 Destek

Sorunlar için: umut.demirci@luwi.dev