'use server'

import { headers } from 'next/headers'

import { leadSchema, type LeadInput } from '../lib/lead-schema'
import { getPayloadClient } from '../api/client'

const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 5
const hits = new Map<string, number[]>()

export type CreateLeadResult = { ok: true } | { ok: false; error: string }

export async function createLead(input: LeadInput): Promise<CreateLeadResult> {
  const parsed = leadSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Некорректные данные' }
  }
  if (parsed.data.company) return { ok: true }

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= LIMIT) {
    return { ok: false, error: 'Слишком много заявок. Попробуйте позже.' }
  }
  recent.push(now)
  hits.set(ip, recent)

  const { company: _company, details, ...rest } = parsed.data
  const payload = await getPayloadClient()
  await payload.create({
    collection: 'leads',
    data: { ...rest, details: details ?? null, status: 'new' },
  })
  return { ok: true }
}
