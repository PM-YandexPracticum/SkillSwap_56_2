import type { FavoritesState } from './favoritesSlice'

/** Минимальный срез состояния: фича не зависит от app-стора */
export type FavoritesRootState = { favorites: FavoritesState }

export const selectFavoriteIds = (state: FavoritesRootState) => state.favorites.ids

export const selectIsFavorite = (state: FavoritesRootState, id: string) =>
  state.favorites.ids.includes(id)
