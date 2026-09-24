export { default as favoritesReducer, toggleFavorite } from './model/favoritesSlice'
export type { FavoritesState } from './model/favoritesSlice'

export { selectFavoriteIds, selectIsFavorite, selectFavoriteUsers } from './model/selectors'
export type { FavoritesRootState } from './model/selectors'

export { useFavorites } from './model/useFavorites'
