import { NextRequest, NextResponse } from 'next/server'

// PostgreSQL sorgulaması için basit bir API endpoint
// Not: Production'da kesinlikle bir ORM (Prisma, TypeORM vb.) veya 
// daha güvenli bir yöntem kullanılmalıdır!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, type = 'search' } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // n8n webhook'a PostgreSQL sorgusu gönder
    const webhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.luwi.dev/webhook/rag-chatbot-pro'
    
    console.log('🔍 Sending query to n8n:', { query, type })
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        action: 'database_query',
        query_type: type,
        query_text: query,
        timestamp: new Date().toISOString()
      })
    })

    console.log('📥 n8n Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Query results:', data)
    
    return NextResponse.json({
      success: true,
      results: data.results || [],
      count: data.count || 0,
      query_type: type
    })

  } catch (error) {
    console.error('❌ Query failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Query failed',
      results: []
    }, { status: 500 })
  }
}

// GET endpoint for testing connection
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Query API is running',
    endpoints: {
      POST: '/api/query - Execute database queries',
      query_types: ['search', 'analytics', 'metadata']
    }
  })
}