type SecureModeRequest = {
  model: string
  message: string
  max_tokens: number
  temperature: number
  dialog_id?: string
}

type Secret = {
  original: string
  replacement: string
  type: string
}

type SecureModeResponse = {
  decrypted_response: string
  reply: string
  secrets: Secret[]
  content_type: string
  dialog_id?: string
  dialogId?: string
  encrypted_response: string
}

type FactCheckRequest = {
  message: string
}

type FactCheckResponse = {
  response: string
  urls: string[]
}

type ChatResponse = {
  response: string
  dialog_id: string
}

export async function sendSecureMessage(
  message: string, 
  dialogId?: string, 
  settings?: { model?: string; temperature?: number; maxTokens?: number }
): Promise<SecureModeResponse> {
  try {
    const requestBody: SecureModeRequest = {
      model: settings?.model || 'openai/o4-mini-high',
      message: message,
      max_tokens: settings?.maxTokens || 4096,
      temperature: settings?.temperature || 0.7,
    }

    if (dialogId) {
      requestBody.dialog_id = dialogId
    }

    const response = await fetch('/api/chat/secure-mode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    // Ensure backward compatibility with existing response format
    if (data.decrypted_response && !data.reply) {
      data.reply = data.decrypted_response
    }
    if (data.dialog_id && !data.dialogId) {
      data.dialogId = data.dialog_id
    }
    return data
  } catch (error) {
    console.error('Failed to send message:', error)
    throw error
  }
}

export async function sendMessage(
  message: string, 
  dialogId?: string, 
  settings?: { model?: string; temperature?: number; maxTokens?: number }
): Promise<ChatResponse> {
  try {
    const requestBody: SecureModeRequest = {
      model: settings?.model || 'openai/o4-mini-high',
      message: message,
      max_tokens: settings?.maxTokens || 4096,
      temperature: settings?.temperature || 0.7,
    }

    if (dialogId) {
      requestBody.dialog_id = dialogId
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Server error: ${error}`)
    }

    const data: ChatResponse = await response.json()
    console.log('Chat response received:', { 
      dialogId: data.dialog_id, 
      responseLength: data.response.length 
    })
    return data
  } catch (error) {
    console.error('Failed to send message:', error)
    throw error
  }
}

export async function checkFacts(message: string): Promise<FactCheckResponse> {
  try {
    const requestBody: FactCheckRequest = {
      message: message,
    }

    const response = await fetch('/api/chat/fact-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to check facts:', error)
    throw error
  }
}