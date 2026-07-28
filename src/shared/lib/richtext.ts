type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
}

const BLOCK_TYPES = new Set(['paragraph', 'heading', 'listitem', 'quote', 'linebreak'])

function collect(node: LexicalNode, out: string[]): void {
  if (typeof node.text === 'string') out.push(node.text)
  node.children?.forEach((child) => collect(child, out))
  if (BLOCK_TYPES.has(node.type ?? '')) out.push(' ')
}

export function richTextToPlain(content: unknown, maxLength = 500): string | undefined {
  const root = (content as { root?: LexicalNode } | null | undefined)?.root
  if (!root) return undefined

  const parts: string[] = []
  collect(root, parts)
  const text = parts.join('').replace(/\s+/g, ' ').trim()

  if (!text) return undefined
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}
