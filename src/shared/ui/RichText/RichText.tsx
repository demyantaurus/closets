import React from 'react'

import styles from './RichText.module.scss'

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  format?: number | string
  children?: LexicalNode[]
  listType?: string
}

type LexicalContent = {
  root?: LexicalNode
}

function renderText(node: LexicalNode, key: number): React.ReactNode {
  let content: React.ReactNode = node.text ?? ''
  const format = typeof node.format === 'number' ? node.format : 0
  if (format & 1) content = <strong key={key}>{content}</strong>
  if (format & 2) content = <em key={key}>{content}</em>
  return <React.Fragment key={key}>{content}</React.Fragment>
}

function renderNode(node: LexicalNode, key: number): React.ReactNode {
  const children = node.children?.map((child, index) => renderNode(child, index))

  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'paragraph':
      return <p key={key}>{children}</p>
    case 'heading': {
      const Tag = (node.tag === 'h1' ? 'h2' : (node.tag ?? 'h3')) as 'h2' | 'h3' | 'h4'
      return <Tag key={key}>{children}</Tag>
    }
    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return <Tag key={key}>{children}</Tag>
    }
    case 'listitem':
      return <li key={key}>{children}</li>
    case 'quote':
      return <blockquote key={key}>{children}</blockquote>
    case 'linebreak':
      return <br key={key} />
    default:
      return <React.Fragment key={key}>{children}</React.Fragment>
  }
}

export function RichText({ content }: { content: unknown }) {
  const root = (content as LexicalContent)?.root
  if (!root?.children) return null
  return (
    <div className={styles.richText}>
      {root.children.map((node, index) => renderNode(node, index))}
    </div>
  )
}
