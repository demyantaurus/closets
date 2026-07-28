import type { Access } from 'payload'

export const anyone: Access = () => true

export const isStaff: Access = ({ req }) => Boolean(req.user)

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const publishedStatusOrStaff: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

export const publishedOrStaff: Access = ({ req }) => {
  if (req.user) return true
  return { published: { equals: true } }
}
