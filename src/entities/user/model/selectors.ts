import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import type { User } from '@/shared/types'

const selectUsersState = (state: RootState) => state.users

export const selectUsers = createSelector(
  [selectUsersState],
  (state) => state.users
)

export const selectUsersStatus = createSelector(
  [selectUsersState],
  (state) => state.status
)

export const selectUsersVisible = createSelector(
  [selectUsersState],
  (state) => state.visible
)

export const selectPopular = createSelector([selectUsers], (users: User[]) =>
  [...users].sort((a, b) => b.likesCount - a.likesCount).slice(0, 3)
)

export const selectNew = createSelector([selectUsers], (users: User[]) =>
  [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3)
)

export const selectRecommended = createSelector(
  [selectUsers, selectUsersVisible],
  (users: User[], visible: number) => users.slice(0, visible)
)

export const selectHasMore = createSelector(
  [selectUsersVisible, selectUsers],
  (visible: number, users: User[]) => visible < users.length
)
