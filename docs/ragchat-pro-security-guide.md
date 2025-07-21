# 🚨 RAGChat Pro Workflow - Production Güvenlik ve Optimizasyon

## 1. ❗ Webhook URL Problemi

**Mevcut Durum:**
- Webhook path: `/webhook/rag-chatbot-pro`
- **SORUN:** URL'ler localhost olarak görünüyor

**Çözüm:**
```javascript
// Production webhook URL
https://n8n.luwi.dev/webhook/rag-chatbot-pro

// Test webhook URL  
https://n8n.luwi.dev/webhook-test/rag-chatbot-pro
```

## 2. 🔧 Workflow Hataları ve Düzeltmeleri

### A. Node Type Hataları
```json
// YANLIŞ:
"type": "n8n-nodes-base.postgresTool"

// DOĞRU:
"type": "@n8n/n8n-nodes-langchain.toolSql"
```

### B. Error Handling Eksik
Her node'a error handling eklenmeli:
```json
{
  "onError": "continueRegularOutput",
  "retryOnFail": true,
  "maxTries": 3,
  "waitBetweenTries": 1000
}
```

## 3. 🔐 Güvenlik Önerileri

### A. Webhook Security
```javascript
// 1. API Key Validation
{
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "X-API-Key",
    "value": "={{$env.WEBHOOK_API_KEY}}"
  }
}

// 2. IP Whitelist (Nginx level)
location /webhook {
  allow 85.105.123.0/24;  # Your app server IP range
  deny all;
}

// 3. Request Signature
const signature = crypto
  .createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(JSON.stringify(body))
  .digest('hex');
```

### B. SQL Injection Protection
```javascript
// Mevcut workflow'da SQL injection riski var!
// Bu satır tehlikeli:
const searchTerm = `%${keyword.replace(/'/g, "''")}%`;

// Güvenli alternatif:
{
  "query": "SELECT * FROM table WHERE column LIKE $1",
  "additionalFields": {
    "queryParams": ["%" + keyword + "%"]
  }
}
```

## 4. 📝 Düzeltilmiş Workflow Yapısı

```javascript
// Webhook Node - Güvenli Versiyon
{
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2.1,
  "parameters": {
    "httpMethod": "POST",
    "path": "rag-chatbot-pro",
    "authentication": "headerAuth",
    "responseMode": "responseNode",
    "options": {
      "responseHeaders": {
        "entries": [
          {
            "name": "Content-Type",
            "value": "application/json; charset=utf-8"
          },
          {
            "name": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "name": "X-Frame-Options",
            "value": "DENY"
          }
        ]
      }
    }
  },
  "webhookId": "36f68717-2e77-4063-9e9f-146ef62eeb93",
  "onError": "continueRegularOutput"
}

// PostgreSQL Tool - Güvenli Versiyon
{
  "name": "Search All Tables",
  "type": "@n8n/n8n-nodes-langchain.toolSql",
  "parameters": {
    "query": `
      WITH search_results AS (
        SELECT 
          'Danıştay Kararı' as "Tablo_Tipi",
          "Kaynak",
          TO_CHAR("Tarih", 'DD.MM.YYYY') as "Tarih",
          "Konusu",
          "Ozeti"
        FROM public."danistaykararlari" 
        WHERE 
          "Konusu" ILIKE $1 OR 
          "Ozeti" ILIKE $1
        LIMIT $2
      )
      SELECT * FROM search_results
    `,
    "additionalFields": {
      "queryParams": [
        "{{`%${$fromAI('keyword').replace(/[%_]/g, '\\\\$&')}%`}}",
        "{{$fromAI('limit', 5)}}"
      ]
    }
  },
  "onError": "continueRegularOutput",
  "retryOnFail": true
}
```

## 5. 🚀 Production Deployment Checklist

### Environment Variables (.env)
```bash
# n8n Configuration
N8N_HOST=n8n.luwi.dev
N8N_PROTOCOL=https
N8N_PORT=443
WEBHOOK_URL=https://n8n.luwi.dev
N8N_WEBHOOK_BASE_URL=https://n8n.luwi.dev

# Security
WEBHOOK_API_KEY=your-secure-api-key-here
WEBHOOK_SECRET=your-webhook-secret-here
N8N_ENCRYPTION_KEY=your-encryption-key

# Database
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=pgbouncer
DB_POSTGRESDB_PORT=6432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=secure-password

# OpenAI
OPENAI_API_KEY=your-openai-key

# Community Packages
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name n8n.luwi.dev;
    
    # Webhook specific location
    location ~ ^/webhook/rag-chatbot-pro$ {
        # Rate limiting
        limit_req zone=webhook_limit burst=20 nodelay;
        
        # IP whitelist (optional)
        # allow 85.105.123.0/24;
        # deny all;
        
        # Security headers
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "DENY" always;
        
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Large body for file uploads
        client_max_body_size 50M;
        
        # Timeouts
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
    
    # Test webhook endpoint
    location ~ ^/webhook-test/rag-chatbot-pro$ {
        # More relaxed settings for testing
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
    }
}
```

## 6. 🔍 Monitoring & Logging

### n8n Execution Monitoring
```javascript
// Add to workflow
{
  "name": "Execution Logger",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "httpMethod": "POST",
    "url": "https://monitoring.luwi.dev/n8n-executions",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "workflowId",
          "value": "={{$workflow.id}}"
        },
        {
          "name": "executionId", 
          "value": "={{$execution.id}}"
        },
        {
          "name": "status",
          "value": "={{$execution.error ? 'error' : 'success'}}"
        },
        {
          "name": "duration",
          "value": "={{$execution.duration}}"
        }
      ]
    }
  },
  "continueOnFail": true
}
```

## 7. 📱 Frontend Integration

### Secure API Call Example
```javascript
// Frontend API Service
class RAGChatAPI {
  constructor() {
    this.baseURL = 'https://n8n.luwi.dev';
    this.apiKey = process.env.REACT_APP_WEBHOOK_API_KEY;
  }
  
  async sendMessage(message, sessionId) {
    const body = JSON.stringify({ message, sessionId });
    
    // Generate signature
    const signature = await this.generateSignature(body);
    
    const response = await fetch(`${this.baseURL}/webhook/rag-chatbot-pro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'X-Signature': signature,
        'X-Timestamp': Date.now().toString()
      },
      body: body
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
  
  async generateSignature(body) {
    const encoder = new TextEncoder();
    const data = encoder.encode(body);
    const key = encoder.encode(process.env.REACT_APP_WEBHOOK_SECRET);
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      await crypto.subtle.importKey(
        'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
      ),
      data
    );
    
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
```

## 8. 🧪 Test Script

```bash
#!/bin/bash
# test-webhook.sh

WEBHOOK_URL="https://n8n.luwi.dev/webhook/rag-chatbot-pro"
API_KEY="your-api-key"

# Test 1: Basic request
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"message": "KDV oranları nelerdir?", "sessionId": "test-123"}'

# Test 2: SQL injection attempt (should be safe)
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"message": "KDV''; DROP TABLE users; --", "sessionId": "test-456"}'

# Test 3: Large payload
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"message": "'$(python -c "print('A' * 10000))'", "sessionId": "test-789"}'
```

## 9. ⚡ Performance Optimizasyonları

1. **Connection Pooling**: PgBouncer kullanımı
2. **Query Caching**: Redis ile 1 saatlik cache
3. **Rate Limiting**: IP başına dakikada 20 istek
4. **Timeout Settings**: 30 saniye max execution time
5. **Batch Processing**: Toplu sorgular için queue sistemi

## 10. 🎯 Özet

**Kritik Değişiklikler:**
1. ✅ Webhook URL'leri production'a uygun hale getirildi
2. ✅ SQL injection koruması eklendi
3. ✅ Error handling tüm node'lara eklendi
4. ✅ API key authentication zorunlu hale getirildi
5. ✅ Rate limiting ve monitoring eklendi

**Production URL:**
```
https://n8n.luwi.dev/webhook/rag-chatbot-pro
```

**Test URL:**
```
https://n8n.luwi.dev/webhook-test/rag-chatbot-pro
```