import type { FavoritesState } from './favoritesSlice'
import type { User } from '@/shared/types'

/** Минимальный срез состояния: фича не зависит от app-стора */
export type FavoritesRootState = { favorites: FavoritesState }

export const selectFavoriteIds = (state: FavoritesRootState) => state.favorites.ids

export const selectIsFavorite = (state: FavoritesRootState, id: string) =>
  state.favorites.ids.includes(id)

export const selectFavoriteUsers = (
  state: FavoritesRootState & { users: { users: User[] } },
) => {
  const favoriteIds = new Set(state.favorites.ids)
  return state.users.users.filter((user) => favoriteIds.has(user.id))
}
