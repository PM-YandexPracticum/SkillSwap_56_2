import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { toggleFavorite } from './favoritesSlice'
import { selectFavoriteIds } from './selectors'

export const useFavorites = () => {
  const dispatch = useDispatch()
  const favoriteIds = useSelector(selectFavoriteIds)

  const isFavorite = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds])

  const handleToggle = useCallback(
    (id: string) => {
      dispatch(toggleFavorite(id))
    },
    [dispatch],
  )

  return { favoriteIds, isFavorite, toggleFavorite: handleToggle }
}
