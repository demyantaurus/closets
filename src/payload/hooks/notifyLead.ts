import type { CollectionAfterChangeHook, Payload } from 'payload'

const TYPE_LABELS: Record<string, string> = {
  callback: 'Обратный звонок',
  calculator: 'Калькулятор стоимости',
  project3d: 'Заявка на 3D-проект',
  contact: 'Контактная форма',
}

type LeadDoc = {
  id: number | string
  type: string
  name: string
  phone: string
  message?: string | null
  details?: unknown
}

async function withRetry(fn: () => Promise<void>, attempts = 3): Promise<void> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await fn()
      return
    } catch (error) {
      if (attempt === attempts) throw error
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }
}

function leadText(doc: LeadDoc): string {
  const lines = [
    `Новая заявка: ${TYPE_LABELS[doc.type] ?? doc.type}`,
    `Имя: ${doc.name}`,
    `Телефон: ${doc.phone}`,
  ]
  if (doc.message) lines.push(`Сообщение: ${doc.message}`)
  if (doc.details) lines.push(`Детали: ${JSON.stringify(doc.details, null, 2)}`)
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  lines.push(`${serverUrl}/admin/collections/leads/${doc.id}`)
  return lines.join('\n')
}

async function sendTelegram(text: string, payload: Payload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    payload.logger.info('lead notification: telegram not configured, skipped')
    return
  }
  await withRetry(async () => {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
    if (!res.ok) throw new Error(`telegram responded ${res.status}`)
  })
}

async function sendEmail(text: string, doc: LeadDoc, payload: Payload): Promise<void> {
  const to = process.env.LEADS_EMAIL_TO
  if (!to || !process.env.SMTP_HOST) {
    payload.logger.info('lead notification: email not configured, skipped')
    return
  }
  await withRetry(async () => {
    await payload.sendEmail({
      to,
      subject: `Новая заявка: ${TYPE_LABELS[doc.type] ?? doc.type} — ${doc.name}`,
      text,
    })
  })
}

export const notifyLead: CollectionAfterChangeHook = ({ doc, operation, req }) => {
  if (operation !== 'create' || req.context?.disableNotifications) return doc
  const text = leadText(doc as LeadDoc)
  void Promise.allSettled([
    sendTelegram(text, req.payload),
    sendEmail(text, doc as LeadDoc, req.payload),
  ]).then((results) => {
    for (const result of results) {
      if (result.status === 'rejected') {
        req.payload.logger.error({ err: result.reason }, 'lead notification failed')
      }
    }
  })
  return doc
}
