# Claude MCP Integration Guide

## 🤝 Claude + ChatGPT Collaboration Strategy

Bu proje, Claude'un MCP (Model Context Protocol) yetenekleri ile ChatGPT'nin analitik ve strateji yeteneklerini birleştirerek geliştirilmektedir.

## 🎯 İş Bölümü

### Claude (MCP Expert)
- ✅ PostgreSQL vector store yönetimi
- ✅ n8n workflow orchestration
- ✅ GitHub repo management
- ✅ Filesystem operations
- ✅ Memory/Knowledge graph maintenance
- ✅ Real-time system integration

### ChatGPT (Strategy & Architecture)
- 📋 Frontend architecture design
- 📋 Deployment strategies
- 📋 Performance optimization
- 📋 Security best practices
- 📋 Monitoring setup
- 📋 Documentation

## 🔄 Bilgi Senkronizasyonu

1. **Memory Provider**: Ortak knowledge graph
2. **GitHub**: Kod ve doküman senkronizasyonu
3. **Prompt Exchange**: Detaylı durum özetleri

## 📡 Aktif MCP Bağlantıları

```yaml
mcp_connections:
  postgres:
    status: "active"
    purpose: "Vector store & data persistence"
    
  n8n-mcp:
    status: "active"
    workflow_id: "2NhTSbSyaBRaSPqG"
    webhook: "/webhook/rag-chatbot"
    
  github:
    status: "active"
    repo: "umutluwi/rag-chatbot-mcp"
    
  filesystem:
    status: "active"
    base_path: "C:\\Users\\umut.demirci\\Desktop\\n8n\\rag-chatbot"
    
  memory:
    status: "active"
    entities: ["RAG_Chatbot_System", "PostgreSQL_VectorStore", "ChatGPT_Claude_Integration"]
```

## 🚀 Quick MCP Commands

### PostgreSQL Operations
```javascript
// Vector similarity search
postgres:query({
  sql: "SELECT content, 1 - (embedding <=> $1::vector) AS similarity FROM rag_documents WHERE similarity > 0.8 LIMIT 5"
})

// Insert chat message
postgres:query({
  sql: "INSERT INTO chat_messages (conversation_id, role, content) VALUES ($1, $2, $3)"
})
```

### n8n Workflow Management
```javascript
// Activate workflow
n8n-mcp:n8n_update_partial_workflow({
  id: "2NhTSbSyaBRaSPqG",
  operations: [{type: "updateSettings", settings: {active: true}}]
})

// Trigger webhook
n8n-mcp:n8n_trigger_webhook_workflow({
  webhookUrl: "http://n8n.luwi.dev:5678/webhook/rag-chatbot",
  data: {message: "test"}
})
```

### GitHub Sync
```javascript
// Push multiple files
github:push_files({
  owner: "umutluwi",
  repo: "rag-chatbot-mcp",
  branch: "main",
  files: [{path: "file.js", content: "..."}],
  message: "Update via MCP"
})
```

## 📊 Project Status Dashboard

| Component | Status | Progress |
|-----------|--------|----------|
| PostgreSQL Setup | ✅ Complete | 100% |
| n8n Workflow | ✅ Active | 100% |
| GitHub Repo | ✅ Created | 100% |
| Docker Config | ✅ Ready | 100% |
| Frontend | 🔄 In Progress | 20% |
| Deployment | ⏳ Planned | 0% |

## 🔗 Integration Points

1. **Webhook Endpoint**: `http://n8n.luwi.dev:5678/webhook/rag-chatbot`
2. **PostgreSQL**: `localhost:5432/rag_chatbot`
3. **GitHub**: `https://github.com/umutluwi/rag-chatbot-mcp`

---
*Last Updated: via Claude MCP*