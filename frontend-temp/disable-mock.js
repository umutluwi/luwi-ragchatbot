// N8N düzeldiğinde bu dosyayı çalıştır
// Mock mode'u kapatır ve gerçek N8N'e bağlar

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../app/api/chat/route.ts')
let content = fs.readFileSync(filePath, 'utf8')

// Mock mode'u false yap
content = content.replace('const mockMode = true', 'const mockMode = false')

fs.writeFileSync(filePath, content)
console.log('✅ Mock mode kapatıldı! Gerçek N8N bağlantısı aktif.')
