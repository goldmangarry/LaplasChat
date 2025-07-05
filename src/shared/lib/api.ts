type ChatMessage = {
  content: string
  role: 'system' | 'user'
}

type SecureModeRequest = {
  model: string
  messages: ChatMessage[]
  max_tokens: number
  temperature: number
}

type Secret = {
  original: string
  replacement: string
}

type SecureModeResponse = {
  llm_response: string
  secrets: Secret[]
}

export async function sendSecureMessage(message: string): Promise<SecureModeResponse> {
  try {
    const response = await fetch('/api/secure-mode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            content: message,
            role: 'user'
          }
        ],
        max_tokens: 1024,
        temperature: 0.3
      } as SecureModeRequest)
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to send message:', error)
    throw error
  }
}