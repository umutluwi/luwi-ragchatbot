import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, session_id } = body

    console.log('🚀 === LUWI RAG CHATBOT API ===')
    console.log('📥 Request received:', { message, session_id })
    console.log('🔗 Webhook URL from env:', process.env.N8N_WEBHOOK_URL)

    if (!message) {
      console.log('❌ Message is missing')
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // 🎯 Working webhook URL (from N8N MCP analysis)
    const webhookUrls = [
      'https://n8n.luwi.dev/webhook/rag-chatbot-pro', // ✅ WORKING URL
      process.env.N8N_WEBHOOK_URL || 'https://n8n.luwi.dev/webhook/rag-chatbot-pro',
      'https://n8n.luwi.dev/webhook/ragchat-pro-v2',
      'https://n8n.luwi.dev/webhook/luwi-rag-chat'
    ]

    console.log('🔄 Trying webhook URLs:', webhookUrls)

    let lastError = null
    let workingUrl = null

    // Her URL'yi sırasıyla dene
    for (const webhookUrl of webhookUrls) {
      try {
        console.log(`📡 Trying: ${webhookUrl}`)
        
        // 25 saniye timeout (n8n workflow uzun sürebilir)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 25000)
        
        const requestBody = {
          message: message,
          sessionId: session_id || `session_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: 'luwi-frontend'
        }

        console.log('📤 Request body:', JSON.stringify(requestBody, null, 2))
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Luwi-RAG-ChatBot/2.0',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)

        console.log(`📥 Response from ${webhookUrl}:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        })

        if (response.ok) {
          workingUrl = webhookUrl
          
          // Response'u text olarak al
          const responseText = await response.text()
          console.log('📄 Raw response text:', responseText)
          
          if (!responseText || responseText.trim() === '') {
            console.log('⚠️ Empty response from N8N')
            throw new Error('Empty response from N8N workflow')
          }
          
          try {
            // JSON parse dene
            const data = JSON.parse(responseText)
            console.log('✅ Parsed JSON:', JSON.stringify(data, null, 2))
            
            // N8N MCP workflow response formatını analiz et
            let finalResponse = ''
            
            if (typeof data === 'string') {
              finalResponse = data
              console.log('📝 Response type: direct string')
            } else if (data && data.success && data.response) {
              finalResponse = data.response
              console.log('📝 Response type: data.response (success format)')
            } else if (data && data.output) {
              finalResponse = data.output
              console.log('📝 Response type: data.output (AI Agent format)')
            } else if (data && data.message) {
              finalResponse = data.message
              console.log('📝 Response type: data.message')
            } else if (data && data.text) {
              finalResponse = data.text
              console.log('📝 Response type: data.text')
            } else if (data && data.content) {
              finalResponse = data.content
              console.log('📝 Response type: data.content')
            } else if (data && data.result) {
              finalResponse = data.result
              console.log('📝 Response type: data.result')
            } else if (data && data.data) {
              finalResponse = data.data
              console.log('📝 Response type: data.data')
            } else if (Array.isArray(data) && data.length > 0) {
              // Array response - ilk elemanı kontrol et
              const firstItem = data[0]
              finalResponse = firstItem.output || firstItem.response || firstItem.message || JSON.stringify(firstItem)
              console.log('📝 Response type: array first element')
            } else if (data && typeof data === 'object') {
              // Object ise tüm değerleri kontrol et
              const possibleResponseFields = ['output', 'response', 'message', 'text', 'content', 'result', 'data']
              for (const field of possibleResponseFields) {
                if (data[field]) {
                  finalResponse = data[field]
                  console.log(`📝 Response type: data.${field}`)
                  break
                }
              }
              
              if (!finalResponse) {
                console.log('⚠️ No known response field found, using full object')
                console.log('📊 Available fields:', Object.keys(data))
                finalResponse = JSON.stringify(data, null, 2)
              }
            } else {
              console.log('⚠️ Unknown response format, using JSON string')
              finalResponse = JSON.stringify(data, null, 2)
            }
            
            if (!finalResponse || finalResponse.trim() === '') {
              finalResponse = `N8N workflow çalıştı ama boş yanıt döndü.\n\nDebug Info:\n${JSON.stringify(data, null, 2)}`
            }
            
            console.log('🎯 Final response to send:', finalResponse)
            
            return NextResponse.json({
              response: finalResponse,
              session_id: session_id,
              webhook_url: workingUrl,
              success: true,
              metadata: {
                responseType: typeof data === 'string' ? 'string' : 'object',
                timestamp: new Date().toISOString(),
                model: 'n8n-rag-workflow',
                dataStructure: typeof data === 'object' ? Object.keys(data) : []
              }
            })
            
          } catch (parseError) {
            console.error('❌ JSON Parse error:', parseError)
            console.log('📄 Treating as plain text response')
            
            // JSON parse edilemiyorsa text olarak döndür
            return NextResponse.json({
              response: responseText || 'N8N\'den yanıt alındı ama parse edilemedi',
              session_id: session_id,
              webhook_url: workingUrl,
              success: true,
              metadata: {
                responseType: 'plain_text',
                timestamp: new Date().toISOString(),
                parseError: parseError.message
              }
            })
          }
          
        } else {
          const errorText = await response.text()
          console.log(`❌ HTTP Error ${response.status}:`, errorText)
          lastError = new Error(`HTTP ${response.status}: ${errorText}`)
          continue // Bir sonraki URL'yi dene
        }

      } catch (error) {
        console.log(`❌ Error with ${webhookUrl}:`, error.message)
        lastError = error
        
        // Timeout error ise diğer URL'leri dene
        if (error.name === 'AbortError') {
          console.log('⚠️ Timeout error, trying next URL...')
        }
        
        continue // Bir sonraki URL'yi dene
      }
    }

    // Hiçbir URL çalışmadı
    console.log('❌ All webhook URLs failed')
    console.log('📊 Last error:', lastError)

    return NextResponse.json({
      response: `🔴 N8N bağlantı hatası!\n\n🔧 Doğru URL: https://n8n.luwi.dev/webhook/rag-chatbot-pro\n\n💬 Mesajınız: "${message}"\n\n🔍 Son hata: ${lastError?.message || 'Bilinmeyen hata'}\n\n📋 Kontrol edilecekler:\n- N8N workflow aktif mi?\n- Internet bağlantısı var mı?\n- Webhook timeout olmadı mı?`,
      error: true,
      session_id: session_id,
      debug: {
        testedUrls: webhookUrls,
        lastError: lastError?.message,
        timestamp: new Date().toISOString(),
        workingUrl: 'https://n8n.luwi.dev/webhook/rag-chatbot-pro'
      }
    }, { status: 500 })

  } catch (error) {
    console.error('❌ API Route Error:', error)
    
    return NextResponse.json({
      response: `🔥 API hatası!\n\nHata: ${error.message}\n\nDebug için browser console'unu kontrol edin.`,
      error: true,
      debug: {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

// OPTIONS request için CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  })
}