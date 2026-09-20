import { configureStore } from '@reduxjs/toolkit'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'

import favoritesReducer from './favoritesSlice'
import { useFavorites } from './useFavorites'

const createWrapper = () => {
  const store = configureStore({ reducer: { favorites: favoritesReducer } })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  return Wrapper
}

describe('useFavorites', () => {
  test('переключает избранное и отдаёт признак isFavorite', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper: createWrapper() })

    expect(result.current.favoriteIds).toEqual([])
    expect(result.current.isFavorite('user-1')).toBe(false)

    act(() => result.current.toggleFavorite('user-1'))

    expect(result.current.favoriteIds).toEqual(['user-1'])
    expect(result.current.isFavorite('user-1')).toBe(true)

    act(() => result.current.toggleFavorite('user-1'))

    expect(result.current.isFavorite('user-1')).toBe(false)
  })
})
