-- PostgreSQL Vector Search Optimization for RAG Chatbot

-- 1. Optimal IVFFlat Index Configuration
-- For datasets < 1M vectors
CREATE INDEX idx_rag_docs_embedding_ivfflat 
ON rag_documents USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100); -- sqrt(n) rule: 100 lists for 10k vectors

-- For datasets > 1M vectors
-- WITH (lists = 1000); -- 1000 lists for 1M vectors

-- 2. Query Optimization with CTEs
CREATE OR REPLACE FUNCTION search_similar_documents_optimized(
    query_embedding vector(1536),
    similarity_threshold float DEFAULT 0.8,
    max_results int DEFAULT 5,
    metadata_filter jsonb DEFAULT NULL
)
RETURNS TABLE(
    document_id uuid,
    content text,
    similarity float,
    metadata jsonb,
    chunk_index int
) AS $$
BEGIN
    -- Set probes for accuracy/speed tradeoff
    SET LOCAL ivfflat.probes = 10; -- Increase for better recall
    
    RETURN QUERY
    WITH candidates AS (
        SELECT 
            d.document_id,
            d.content,
            d.metadata,
            d.chunk_index,
            d.embedding <=> query_embedding AS distance,
            1 - (d.embedding <=> query_embedding) AS similarity
        FROM rag_documents d
        WHERE 
            -- Pre-filter by metadata if provided
            CASE 
                WHEN metadata_filter IS NOT NULL 
                THEN d.metadata @> metadata_filter
                ELSE true
            END
        ORDER BY d.embedding <=> query_embedding
        LIMIT max_results * 2 -- Over-fetch for post-filtering
    )
    SELECT 
        c.document_id,
        c.content,
        c.similarity,
        c.metadata,
        c.chunk_index
    FROM candidates c
    WHERE c.similarity > similarity_threshold
    ORDER BY c.distance
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE PARALLEL SAFE;

-- 3. Batch Vector Search for Multiple Queries
CREATE OR REPLACE FUNCTION batch_vector_search(
    query_embeddings vector(1536)[],
    similarity_threshold float DEFAULT 0.8,
    max_results_per_query int DEFAULT 5
)
RETURNS TABLE(
    query_index int,
    document_id uuid,
    content text,
    similarity float
) AS $$
DECLARE
    i int;
BEGIN
    FOR i IN 1..array_length(query_embeddings, 1) LOOP
        RETURN QUERY
        SELECT 
            i as query_index,
            d.document_id,
            d.content,
            1 - (d.embedding <=> query_embeddings[i]) as similarity
        FROM rag_documents d
        WHERE 1 - (d.embedding <=> query_embeddings[i]) > similarity_threshold
        ORDER BY d.embedding <=> query_embeddings[i]
        LIMIT max_results_per_query;
    END LOOP;
END;
$$ LANGUAGE plpgsql STABLE;

-- 4. Maintenance Tasks
-- Regular VACUUM for optimal performance
ALTER TABLE rag_documents SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE rag_documents SET (fillfactor = 95); -- Less updates expected

-- 5. Monitoring Query
CREATE OR REPLACE VIEW v_vector_search_stats AS
SELECT 
    n.nspname AS schema_name,
    c.relname AS table_name,
    i.relname AS index_name,
    pg_size_pretty(pg_relation_size(i.oid)) AS index_size,
    idx_scan AS index_scans,
    idx_tup_read AS tuples_read,
    idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes s
JOIN pg_class c ON c.oid = s.relid
JOIN pg_class i ON i.oid = s.indexrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE i.relname LIKE '%embedding%';

-- 6. Connection Pooling Optimization
-- Use these settings with PgBouncer
-- pool_mode = transaction
-- default_pool_size = 25
-- max_client_conn = 1000