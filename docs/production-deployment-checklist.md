# Production Deployment Checklist: PM2 + Nginx + Docker

## ✅ PM2 Configuration

### ecosystem.config.js
```javascript
module.exports = {
  apps: [
    {
      name: 'rag-streaming-server',
      script: './src/streaming-server.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '1G',
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      max_restarts: 10,
      min_uptime: '10s',
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      // Health check
      health_check: {
        interval: 30,
        path: '/health',
        timeout: 5000
      }
    },
    {
      name: 'rag-mcp-server',
      script: './src/mcp-server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        MCP_PORT: 8080
      }
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['web1.luwi.dev', 'web2.luwi.dev'],
      ref: 'origin/main',
      repo: 'git@github.com:umutluwi/rag-chatbot-mcp.git',
      path: '/var/www/rag-chatbot',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'npm test'
    }
  }
};
```

## ✅ Nginx Configuration

### /etc/nginx/sites-available/rag-chatbot
```nginx
# Upstream definitions
upstream streaming_backend {
    least_conn;
    server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3002 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3003 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

upstream n8n_backend {
    server 127.0.0.1:5678;
    keepalive 16;
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=webhook_limit:10m rate=20r/s;
limit_conn_zone $binary_remote_addr zone=ws_limit:10m;

# SSL configuration
server {
    listen 443 ssl http2;
    server_name api.luwi.dev;
    
    ssl_certificate /etc/letsencrypt/live/api.luwi.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.luwi.dev/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # WebSocket configuration
    location /ws {
        limit_conn ws_limit 5;
        
        proxy_pass http://streaming_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Disable buffering for WebSocket
        proxy_buffering off;
    }
    
    # SSE endpoint
    location /api/sse {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://streaming_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # SSE specific
        proxy_set_header Cache-Control "no-cache";
        proxy_set_header X-Accel-Buffering "no";
        proxy_buffering off;
        chunked_transfer_encoding on;
        
        # Timeouts for SSE
        proxy_read_timeout 86400s;
        keepalive_timeout 86400s;
    }
    
    # API endpoints
    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://streaming_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Connection pooling
        proxy_set_header Connection "";
        
        # Timeouts
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://streaming_backend;
        proxy_set_header Host $host;
    }
    
    # Static files with caching
    location /static {
        alias /var/www/rag-chatbot/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
        gzip_static on;
    }
}

# n8n webhook server
server {
    listen 443 ssl http2;
    server_name n8n.luwi.dev;
    
    ssl_certificate /etc/letsencrypt/live/n8n.luwi.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/n8n.luwi.dev/privkey.pem;
    
    # Webhook endpoint with higher rate limit
    location /webhook {
        limit_req zone=webhook_limit burst=50 nodelay;
        
        proxy_pass http://n8n_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Large payloads for webhooks
        client_max_body_size 50M;
        client_body_buffer_size 128k;
    }
    
    location / {
        proxy_pass http://n8n_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Connection "";
    }
}
```

## ✅ Docker Production Setup

### docker-compose.prod.yml
```yaml
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg15
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
    secrets:
      - postgres_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 5

  pgbouncer:
    image: pgbouncer/pgbouncer:latest
    restart: unless-stopped
    depends_on:
      - postgres
    volumes:
      - ./config/pgbouncer.ini:/etc/pgbouncer/pgbouncer.ini:ro
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 768M

  streaming-server:
    build:
      context: .
      dockerfile: Dockerfile.streaming
    restart: unless-stopped
    env_file: .env.production
    depends_on:
      - redis
      - pgbouncer
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
      resources:
        limits:
          cpus: '1'
          memory: 1G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

secrets:
  postgres_password:
    external: true

networks:
  default:
    driver: overlay
    attachable: true
```

## ✅ Monitoring & Logging

### PM2 Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7

# Enable metrics endpoint
pm2 web
```

### System Monitoring
```bash
# Install monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d

# Prometheus targets
- job_name: 'node'
  static_configs:
    - targets: ['localhost:9100']
    
- job_name: 'postgres'
  static_configs:
    - targets: ['localhost:9187']
    
- job_name: 'nginx'
  static_configs:
    - targets: ['localhost:9113']
```

## ✅ Backup Strategy

### backup.sh
```bash
#!/bin/bash
# PostgreSQL backup with pgvector data
BACKUP_DIR="/var/backups/rag-chatbot"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Database backup
docker exec postgres pg_dump -U postgres rag_chatbot | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"

# Vector data backup (binary format for efficiency)
docker exec postgres pg_dump -U postgres -Fc -t rag_documents rag_chatbot > "$BACKUP_DIR/vectors_$TIMESTAMP.dump"

# Retain only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

# Sync to S3
aws s3 sync $BACKUP_DIR s3://backups-luwi/rag-chatbot/ --delete
```

## ✅ Security Hardening

1. **Environment Variables**
   ```bash
   # .env.production
   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@pgbouncer:6432/rag_chatbot
   REDIS_URL=redis://redis:6379
   JWT_SECRET=$(openssl rand -base64 32)
   WEBHOOK_API_KEY=$(openssl rand -base64 32)
   ```

2. **Firewall Rules**
   ```bash
   # UFW configuration
   ufw default deny incoming
   ufw default allow outgoing
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

3. **SSL/TLS Automation**
   ```bash
   # Certbot auto-renewal
   certbot renew --pre-hook "nginx -t" --post-hook "nginx -s reload"
   ```

## ✅ Performance Tuning

1. **Kernel Parameters**
   ```bash
   # /etc/sysctl.conf
   net.core.somaxconn = 65535
   net.ipv4.tcp_max_syn_backlog = 65535
   net.ipv4.ip_local_port_range = 1024 65535
   net.ipv4.tcp_tw_reuse = 1
   ```

2. **Node.js Optimization**
   ```bash
   # PM2 with Node.js flags
   node --max-old-space-size=4096 --optimize-for-size
   ```

## ✅ Deployment Commands

```bash
# Initial deployment
git clone https://github.com/umutluwi/rag-chatbot-mcp.git
cd rag-chatbot-mcp
npm install --production
npm run build
pm2 start ecosystem.config.js --env production

# Update deployment
git pull
npm install --production
npm run build
pm2 reload ecosystem.config.js --env production

# Health check
curl -f http://localhost:3001/health || exit 1
```