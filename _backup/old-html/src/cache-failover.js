// Redis-based Caching & Failover Strategy for RAG Chatbot

import Redis from 'ioredis';
import CircuitBreaker from 'opossum';

// Redis Cluster Configuration
const redis = new Redis.Cluster([
  { port: 6379, host: 'redis-1' },
  { port: 6379, host: 'redis-2' },
  { port: 6379, host: 'redis-3' }
], {
  redisOptions: {
    password: process.env.REDIS_PASSWORD,
    enableReadyCheck: true,
    maxRetriesPerRequest: 3
  },
  clusterRetryStrategy: (times) => Math.min(times * 100, 3000)
});

// Circuit Breaker for n8n webhook
const webhookBreaker = new CircuitBreaker(callN8nWebhook, {
  timeout: 30000, // 30 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
  volumeThreshold: 10
});

// Cache Configuration
const CACHE_CONFIG = {
  embedding: {
    ttl: 86400, // 24 hours for embeddings
    prefix: 'emb:'
  },
  response: {
    ttl: 3600, // 1 hour for responses
    prefix: 'resp:'
  },
  conversation: {
    ttl: 7200, // 2 hours for conversation context
    prefix: 'conv:'
  }
};

// Main RAG Query Function with Caching & Failover
export async function queryRAG(userId, message, conversationId) {
  const cacheKey = `${CACHE_CONFIG.response.prefix}${conversationId}:${hashMessage(message)}`;
  
  // 1. Check Redis Cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return {
        ...JSON.parse(cached),
        fromCache: true
      };
    }
  } catch (error) {
    console.error('Redis read error:', error);
    // Continue without cache
  }

  // 2. Try primary n8n webhook with circuit breaker
  try {
    const response = await webhookBreaker.fire({
      userId,
      message,
      conversationId
    });
    
    // Cache successful response
    await redis.setex(
      cacheKey, 
      CACHE_CONFIG.response.ttl, 
      JSON.stringify(response)
    );
    
    return response;
  } catch (error) {
    console.error('Primary webhook failed:', error);
    
    // 3. Fallback to direct database query
    return await fallbackQuery(message, conversationId);
  }
}

// Fallback: Direct PostgreSQL Vector Search
async function fallbackQuery(message, conversationId) {
  const embedding = await getCachedEmbedding(message);
  
  const query = `
    SELECT * FROM search_similar_documents_optimized($1, 0.8, 5)
  `;
  
  const results = await pgPool.query(query, [embedding]);
  
  // Generate response using cached context
  return {
    response: generateFallbackResponse(results.rows),
    fallback: true,
    timestamp: new Date()
  };
}

// Embedding Cache Strategy
async function getCachedEmbedding(text) {
  const cacheKey = `${CACHE_CONFIG.embedding.prefix}${hashMessage(text)}`;
  
  // Check cache
  const cached = await redis.getBuffer(cacheKey);
  if (cached) {
    return new Float32Array(cached.buffer);
  }
  
  // Generate new embedding
  const embedding = await generateEmbedding(text);
  
  // Cache as buffer
  await redis.setex(
    cacheKey,
    CACHE_CONFIG.embedding.ttl,
    Buffer.from(embedding.buffer)
  );
  
  return embedding;
}

// Conversation Context Caching
export async function cacheConversationContext(conversationId, messages) {
  const cacheKey = `${CACHE_CONFIG.conversation.prefix}${conversationId}`;
  
  await redis.setex(
    cacheKey,
    CACHE_CONFIG.conversation.ttl,
    JSON.stringify(messages)
  );
}

// Health Check Endpoint
export async function healthCheck() {
  const checks = {
    redis: false,
    n8n: false,
    postgres: false
  };
  
  // Check Redis
  try {
    await redis.ping();
    checks.redis = true;
  } catch (error) {
    console.error('Redis health check failed:', error);
  }
  
  // Check n8n webhook
  try {
    const response = await fetch(`${process.env.N8N_WEBHOOK_URL}/health`);
    checks.n8n = response.ok;
  } catch (error) {
    console.error('n8n health check failed:', error);
  }
  
  // Check PostgreSQL
  try {
    await pgPool.query('SELECT 1');
    checks.postgres = true;
  } catch (error) {
    console.error('PostgreSQL health check failed:', error);
  }
  
  return {
    healthy: Object.values(checks).every(v => v),
    services: checks,
    timestamp: new Date()
  };
}

// Utility Functions
function hashMessage(message) {
  return require('crypto')
    .createHash('sha256')
    .update(message)
    .digest('hex')
    .substring(0, 16);
}

async function callN8nWebhook(data) {
  const response = await fetch(`${process.env.N8N_WEBHOOK_URL}/rag-chatbot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.WEBHOOK_API_KEY
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }
  
  return response.json();
}