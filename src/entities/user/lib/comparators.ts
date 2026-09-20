import type { User } from '@/shared/types'

export const byCreatedAtDesc = (a: User, b: User) =>
  Date.parse(b.createdAt) - Date.parse(a.createdAt)

export const byLikesDesc = (a: User, b: User) => b.likesCount - a.likesCount
