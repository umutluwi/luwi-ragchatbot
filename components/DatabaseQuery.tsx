import React, { useState } from 'react'

interface QueryResult {
  success: boolean
  results: any[]
  count: number
  error?: string
}

export default function DatabaseQuery() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [queryType, setQueryType] = useState<'search' | 'analytics' | 'metadata'>('search')

  const executeQuery = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          type: queryType
        })
      })

      const data = await response.json()
      setResults(data)
    } catch (error) {
      setResults({
        success: false,
        results: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Query failed'
      })
    } finally {
      setLoading(false)
    }
  }

  const sampleQueries = {
    search: [
      "KDV oranları",
      "Gelir vergisi",
      "Damga vergisi"
    ],
    analytics: [
      "En çok sorulan konular",
      "Kategori bazlı soru dağılımı",
      "Son 7 günlük aktivite"
    ],
    metadata: [
      "Toplam döküman sayısı",
      "Veri kaynakları",
      "Güncelleme tarihleri"
    ]
  }

  return (
    <div className="database-query-container">
      <h3>📊 Veritabanı Sorgulama</h3>
      
      <div className="query-type-selector">
        <button 
          className={`type-btn ${queryType === 'search' ? 'active' : ''}`}
          onClick={() => setQueryType('search')}
        >
          🔍 Arama
        </button>
        <button 
          className={`type-btn ${queryType === 'analytics' ? 'active' : ''}`}
          onClick={() => setQueryType('analytics')}
        >
          📈 Analitik
        </button>
        <button 
          className={`type-btn ${queryType === 'metadata' ? 'active' : ''}`}
          onClick={() => setQueryType('metadata')}
        >
          📋 Metadata
        </button>
      </div>

      <div className="query-input-section">
        <textarea
          className="query-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`${queryType} sorgunuzu yazın...`}
          rows={3}
        />
        <button 
          className="execute-btn"
          onClick={executeQuery}
          disabled={loading || !query.trim()}
        >
          {loading ? '⏳ Sorgulanıyor...' : '▶️ Çalıştır'}
        </button>
      </div>

      <div className="sample-queries">
        <p>Örnek sorgular:</p>
        <div className="sample-list">
          {sampleQueries[queryType].map((sample, idx) => (
            <span 
              key={idx}
              className="sample-query"
              onClick={() => setQuery(sample)}
            >
              {sample}
            </span>
          ))}
        </div>
      </div>

      {results && (
        <div className="query-results">
          <h4>Sonuçlar:</h4>
          {results.success ? (
            <>
              <p className="result-count">Toplam: {results.count} kayıt</p>
              <div className="result-data">
                <pre>{JSON.stringify(results.results, null, 2)}</pre>
              </div>
            </>
          ) : (
            <div className="error-message">
              ❌ Hata: {results.error || 'Sorgu başarısız'}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .database-query-container {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 20px;
          margin: 20px 0;
          backdrop-filter: blur(10px);
        }

        .query-type-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .type-btn {
          padding: 8px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .type-btn.active {
          background: rgba(59, 130, 246, 0.5);
          border-color: rgba(59, 130, 246, 0.8);
        }

        .type-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .query-input-section {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .query-input {
          flex: 1;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 10px;
          border-radius: 8px;
          font-family: monospace;
          resize: vertical;
        }

        .execute-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        }

        .execute-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .execute-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .sample-queries {
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.7);
        }

        .sample-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .sample-query {
          padding: 4px 12px;
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.4);
          border-radius: 15px;
          font-size: 0.9em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sample-query:hover {
          background: rgba(59, 130, 246, 0.4);
          transform: translateY(-1px);
        }

        .query-results {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 15px;
        }

        .result-count {
          color: #4ade80;
          margin-bottom: 10px;
        }

        .result-data {
          max-height: 300px;
          overflow-y: auto;
        }

        .result-data pre {
          margin: 0;
          color: #e2e8f0;
          font-size: 0.85em;
        }

        .error-message {
          color: #ef4444;
          padding: 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
        }
      `}</style>
    </div>
  )
}