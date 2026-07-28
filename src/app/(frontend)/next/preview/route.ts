import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/shared/api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') ?? '/'
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return new Response('Unauthorized', { status: 403 })
  }
  const draft = await draftMode()
  draft.enable()
  redirect(path.startsWith('/') ? path : '/')
}
