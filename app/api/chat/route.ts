import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // n8n webhook URL from environment variable
    const webhookUrl = process.env.N8N_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL is not configured')
      return NextResponse.json(
        { 
          response: 'Üzgünüm, şu anda bağlantı kurulamıyor. Lütfen daha sonra tekrar deneyin.',
          debug: 'N8N webhook URL not configured'
        },
        { status: 500 }
      )
    }

    // Send message to n8n webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        timestamp: new Date().toISOString(),
        userId: 'web-user', // You can implement user identification later
      }),
    })

    if (!n8nResponse.ok) {
      console.error('n8n webhook error:', n8nResponse.status, n8nResponse.statusText)
      return NextResponse.json(
        { 
          response: 'Bağlantıda bir sorun oluştu. Lütfen tekrar deneyin.',
          debug: `n8n returned ${n8nResponse.status}`
        },
        { status: 500 }
      )
    }

    const n8nData = await n8nResponse.json()
    
    // Log the n8n response for debugging
    console.log('n8n response:', n8nData)

    // Return the response from n8n
    return NextResponse.json({
      response: n8nData.response || n8nData.message || 'Yanıt alınamadı.',
      debug: n8nData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { 
        response: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}