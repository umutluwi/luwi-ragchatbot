// WebSocket Server for RAG Chatbot Streaming
// Supports both WebSocket and SSE (Server-Sent Events)

import express from 'express';
import { WebSocketServer } from 'ws';
import { EventEmitter } from 'events';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting for HTTP endpoints
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Event emitter for real-time updates
const messageEmitter = new EventEmitter();

// Middleware
app.use(express.json());

// SSE endpoint for streaming responses
app.get('/api/sse/chat/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no' // Disable Nginx buffering
  });

  // Send initial connection message
  res.write(`event: connected\ndata: {"status": "connected", "conversationId": "${conversationId}"}\n\n`);

  // Listen for messages
  const messageHandler = (data) => {
    if (data.conversationId === conversationId) {
      res.write(`event: ${data.type}\ndata: ${JSON.stringify(data)}\n\n`);
    }
  };

  messageEmitter.on('message', messageHandler);

  // Handle client disconnect
  req.on('close', () => {
    messageEmitter.off('message', messageHandler);
    res.end();
  });

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(':ping\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive);
  });
});

// HTTP server
const server = app.listen(port, () => {
  console.log(`Streaming server running on port ${port}`);
});

// WebSocket server
const wss = new WebSocketServer({ 
  server,
  path: '/ws',
  perMessageDeflate: false, // Better for streaming
  clientTracking: true
});

// WebSocket rate limiting
const wsClients = new Map();
const WS_RATE_LIMIT = 10; // messages per minute

wss.on('connection', (ws, req) => {
  const clientId = req.headers['x-client-id'] || req.socket.remoteAddress;
  
  // Initialize rate limiting for this client
  wsClients.set(clientId, {
    messages: 0,
    resetTime: Date.now() + 60000
  });

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      // Rate limiting check
      const clientData = wsClients.get(clientId);
      if (Date.now() > clientData.resetTime) {
        clientData.messages = 0;
        clientData.resetTime = Date.now() + 60000;
      }
      
      if (clientData.messages >= WS_RATE_LIMIT) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Rate limit exceeded'
        }));
        return;
      }
      
      clientData.messages++;

      // Handle different message types
      switch (data.type) {
        case 'chat':
          await handleChatMessage(ws, data);
          break;
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type'
          }));
      }
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });

  ws.on('close', () => {
    wsClients.delete(clientId);
  });

  // Send initial connection confirmation
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'WebSocket connection established'
  }));
});

// Handle chat messages
async function handleChatMessage(ws, data) {
  const { conversationId, message, userId } = data;
  
  try {
    // Call n8n webhook
    const response = await fetch(`${process.env.N8N_WEBHOOK_URL}/rag-chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.WEBHOOK_API_KEY
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        message: message,
        user_id: userId,
        stream: true
      })
    });

    // Stream response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      
      // Send chunk via WebSocket
      ws.send(JSON.stringify({
        type: 'stream',
        conversationId: conversationId,
        chunk: chunk
      }));

      // Also emit for SSE clients
      messageEmitter.emit('message', {
        type: 'stream',
        conversationId: conversationId,
        chunk: chunk
      });
    }

    // Send completion message
    ws.send(JSON.stringify({
      type: 'complete',
      conversationId: conversationId
    }));

  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to process message',
      error: error.message
    }));
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
  });
  
  wss.clients.forEach((ws) => {
    ws.close();
  });
});

export default server;