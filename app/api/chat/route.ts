import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, session_id } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // N8N Webhook'a istek gönder
    const webhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/ragchat-pro-v2'
    
    console.log('🔗 N8N URL:', webhookUrl)
    console.log('📤 Sending to N8N:', { message, session_id })
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        timestamp: new Date().toISOString(),
        session_id: session_id || `session_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
      })
    })

    console.log('📥 N8N Response status:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ N8N Response data:', data)
    
    return NextResponse.json({
      response: data.response || data.message || 'Yanıt alınamadı.',
      session_id: session_id
    })

  } catch (error) {
    console.error('❌ N8N Connection failed:', error)
    
    // Fallback responses
    const fallbackResponses = [
      "KDV oranları 2024 yılı için %1, %10 ve %20 olarak belirlenmiştir. Temel ihtiyaç maddelerinde %1, gıda ve kitap gibi ürünlerde %10, diğer mal ve hizmetlerde %20 uygulanır.",
      "Gelir vergisi dilimleri 2024 için: 70.000 TL'ye kadar %15, 70.000-180.000 TL arası %20, 180.000-500.000 TL arası %27, 500.000 TL üzeri %35 oranında uygulanır.",
      "Kurumlar vergisi oranı 2024 yılı için %25'tir. Ancak bankalar ve finansal kuruluşlar için farklı oranlar uygulanabilir. Küçük işletmeler için indirimli oranlar mevcuttur.",
      "Damga vergisi, belge ve kağıtların düzenlenmesi sırasında ödenir. 2024 minimum damga vergisi tutarı 52 TL'dir. Sözleşmeler, makbuzlar ve çeşitli belgeler damga vergisine tabidir.",
      "Vergi beyannameleri e-Beyanname sistemi üzerinden verilebilir. Gelir vergisi beyannamesi Mart ayında, kurumlar vergisi beyannamesi ise dördüncü ayın sonuna kadar verilir.",
      "2024 MTV tutarları araç cinsi ve motor hacmine göre değişir. Özel otomobiller için 1.362 TL ile 34.040 TL arasında değişen tutarlar uygulanır."
    ]
    
    const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    
    return NextResponse.json({
      response: `🔴 N8N bağlantı hatası! Test mesajı: "${message}" - ${fallbackResponse}`,
      error: true
    }, { status: 500 })
  }
}