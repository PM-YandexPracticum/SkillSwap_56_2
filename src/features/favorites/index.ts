export { default as favoritesReducer, toggleFavorite } from './model/favoritesSlice'
export type { FavoritesState } from './model/favoritesSlice'

export { selectFavoriteIds, selectIsFavorite } from './model/selectors'
export type { FavoritesRootState } from './model/selectors'

export { useFavorites } from './model/useFavorites'
