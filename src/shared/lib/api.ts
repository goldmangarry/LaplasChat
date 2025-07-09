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

export async function sendSecureMessage(message: string, dialogId?: string): Promise<SecureModeResponse> {
  try {
    const requestBody: SecureModeRequest = {
      model: 'gpt-4',
      message: message,
      max_tokens: 32000,
      temperature: 0.3,
    }

    if (dialogId) {
      requestBody.dialog_id = dialogId
    }

    const response = await fetch('/api/secure-mode', {
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