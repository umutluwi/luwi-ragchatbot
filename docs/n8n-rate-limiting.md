# n8n Workflow Rate Limiting & Error Handling Configuration

## Enhanced RAG Chatbot Workflow

This configuration adds rate limiting, error handling, and monitoring to the RAG chatbot workflow.

### New Components:

1. **Rate Limiting (Redis-based)**
   - 10 requests per minute per user
   - Automatic TTL cleanup
   - IP-based fallback

2. **Error Handling**
   - Try/Catch branches
   - Error logging to PostgreSQL
   - Webhook retry mechanism

3. **Security**
   - Token validation
   - IP whitelist support
   - Request signature verification

### Implementation Steps:

```javascript
// 1. Add Redis node for rate limiting
{
  "type": "n8n-nodes-base.redis",
  "name": "Rate Limiter",
  "parameters": {
    "operation": "incr",
    "key": "rate_limit:{{$json.user_id}}:{{$now.format('YYYY-MM-DD-HH-mm')}}",
    "expire": true,
    "ttl": 60
  }
}

// 2. Add IF node to check rate limit
{
  "type": "n8n-nodes-base.if",
  "name": "Check Rate Limit",
  "parameters": {
    "conditions": {
      "conditions": [{
        "leftValue": "={{$json.value}}",
        "rightValue": 10,
        "operator": {"operation": "lte"}
      }]
    }
  }
}

// 3. Add error trigger node
{
  "type": "n8n-nodes-base.errorTrigger",
  "name": "Error Handler"
}

// 4. Add error logging
{
  "type": "n8n-nodes-base.postgres",
  "name": "Log Error",
  "parameters": {
    "operation": "insert",
    "table": "error_logs",
    "columns": "workflow_id,error_message,timestamp"
  }
}
```

### Webhook Security Configuration:

```javascript
// Token validation in webhook node
{
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "X-API-Key",
    "value": "{{$env.WEBHOOK_API_KEY}}"
  }
}
```

### Environment Variables:

```bash
# n8n environment
WEBHOOK_API_KEY=your-secure-api-key
REDIS_HOST=redis
REDIS_PORT=6379
RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_BURST=20
```

### Error Log Table:

```sql
CREATE TABLE IF NOT EXISTS error_logs (
    id SERIAL PRIMARY KEY,
    workflow_id VARCHAR(255),
    execution_id VARCHAR(255),
    error_message TEXT,
    error_stack TEXT,
    node_name VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE INDEX idx_error_logs_workflow ON error_logs(workflow_id);
CREATE INDEX idx_error_logs_timestamp ON error_logs(timestamp);
```