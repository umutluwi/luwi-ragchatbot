# 🚀 Luwi RAG ChatBot - Manuel Kurulum Rehberi

## ❌ Sorun: Node.js Kurulu Değil

### 1. Node.js Kurulumu
1. https://nodejs.org/en/download/ adresine git
2. **Windows Installer (.msi)** indir
3. İndirilen dosyayı çalıştır ve kur
4. Command Prompt'u **yeniden aç**

### 2. Kurulum Doğrulama
```cmd
node --version
npm --version
```

### 3. Frontend Kurulumu
```cmd
cd C:\Users\umut.demirci\Desktop\n8n\rag-chatbot\frontend-nextjs
npm install
npm run dev
```

## 🔄 Alternatif: Docker Kullan

Node.js kurmak istemiyorsan Docker ile:

```cmd
cd C:\Users\umut.demirci\Desktop\n8n\rag-chatbot
docker-compose up frontend
```

## 🎯 Hızlı Test

Node.js kurduktan sonra:
```cmd
cd C:\Users\umut.demirci\Desktop\n8n\rag-chatbot
setup-and-run.bat
```

## 📞 Sorun Giderme

### Node.js Kurulumu Sorunları
- Windows'u yeniden başlat
- PATH environment variable kontrol et
- PowerShell'i admin olarak çalıştır

### NPM Install Hataları
```cmd
npm cache clean --force
npm install --legacy-peer-deps
```

---
✨ **Luwi Developments** - DREAM · DESIGN · DEVELOP ✨
