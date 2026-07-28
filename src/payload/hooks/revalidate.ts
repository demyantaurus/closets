import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

async function revalidate(tag: string): Promise<void> {
  try {
    const { revalidateTag } = await import('next/cache')
    revalidateTag(tag, 'max')
  } catch {
    return
  }
}

export const revalidateAfterChange =
  (tag: string): CollectionAfterChangeHook =>
  async ({ doc, req }) => {
    if (!req.context?.disableRevalidate) await revalidate(tag)
    return doc
  }

export const revalidateAfterDelete =
  (tag: string): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    if (!req.context?.disableRevalidate) await revalidate(tag)
    return doc
  }

export const revalidateGlobal =
  (tag: string): GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    if (!req.context?.disableRevalidate) await revalidate(tag)
    return doc
  }
