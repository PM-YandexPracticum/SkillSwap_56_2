import { byCreatedAtDesc, byLikesDesc } from '@/entities/user'
import type { User } from '@/shared/types'

import type { SortOption } from './types'

const comparators: Record<SortOption, (a: User, b: User) => number> = {
  newest: byCreatedAtDesc,
  popular: byLikesDesc,
}

export const sortUsers = (users: User[], option: SortOption): User[] =>
  [...users].sort(comparators[option])
