-- PostgreSQL Performance Optimization Script
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Create optimized tables with proper indexes
CREATE TABLE IF NOT EXISTS rag_documents (
    id SERIAL PRIMARY KEY,
    document_id UUID DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB,
    source VARCHAR(255),
    chunk_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversations table with partitioning support
CREATE TABLE IF NOT EXISTS chat_conversations (
    id SERIAL PRIMARY KEY,
    conversation_id UUID DEFAULT gen_random_uuid() UNIQUE,
    user_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    conversation_id UUID REFERENCES chat_conversations(conversation_id),
    role VARCHAR(50) CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    embedding vector(1536),
    tokens_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optimized IVFFlat indexes for production (1000+ embeddings)
CREATE INDEX IF NOT EXISTS idx_rag_documents_embedding 
ON rag_documents USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 200); -- Increased for better performance

CREATE INDEX IF NOT EXISTS idx_chat_messages_embedding 
ON chat_messages USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Regular B-tree indexes
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON rag_documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_source ON rag_documents(source);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON chat_messages(created_at);

-- JSONB GIN index for metadata search
CREATE INDEX IF NOT EXISTS idx_documents_metadata ON rag_documents USING gin(metadata);

-- Updated trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger
DROP TRIGGER IF EXISTS update_rag_documents_updated_at ON rag_documents;
CREATE TRIGGER update_rag_documents_updated_at 
BEFORE UPDATE ON rag_documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Connection pool optimization settings
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET work_mem = '4MB';

-- Vector-specific optimizations
ALTER SYSTEM SET ivfflat.probes = 10;

-- Auto-vacuum settings for vector indexes
ALTER TABLE rag_documents SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE chat_messages SET (autovacuum_vacuum_scale_factor = 0.1);

-- Function for similarity search with performance hints
CREATE OR REPLACE FUNCTION search_similar_documents(
    query_embedding vector(1536),
    similarity_threshold float DEFAULT 0.8,
    max_results int DEFAULT 5
)
RETURNS TABLE(
    document_id uuid,
    content text,
    similarity float,
    metadata jsonb
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.document_id,
        d.content,
        1 - (d.embedding <=> query_embedding) AS similarity,
        d.metadata
    FROM rag_documents d
    WHERE 1 - (d.embedding <=> query_embedding) > similarity_threshold
    ORDER BY d.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE PARALLEL SAFE;

-- Stats view for monitoring
CREATE OR REPLACE VIEW v_rag_stats AS
SELECT 
    (SELECT COUNT(*) FROM rag_documents) as total_documents,
    (SELECT COUNT(*) FROM chat_conversations) as total_conversations,
    (SELECT COUNT(*) FROM chat_messages) as total_messages,
    (SELECT pg_size_pretty(pg_total_relation_size('rag_documents'))) as documents_size,
    (SELECT pg_size_pretty(pg_total_relation_size('chat_messages'))) as messages_size;

-- ANALYZE tables for query planner
ANALYZE rag_documents;
ANALYZE chat_conversations;
ANALYZE chat_messages;