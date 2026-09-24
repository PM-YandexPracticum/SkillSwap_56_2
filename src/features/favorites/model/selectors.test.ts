import { configureStore } from '@reduxjs/toolkit'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'

import favoritesReducer from './favoritesSlice'
import { selectFavoriteUsers } from './selectors'
import { useFavorites } from './useFavorites'

const createWrapper = (extraReducers = {}) => {
  const store = configureStore({
    reducer: { favorites: favoritesReducer, ...extraReducers },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  return Wrapper
}

describe('selectFavoriteUsers', () => {
  const users = [
    { id: 'user-1', name: 'Анна' },
    { id: 'user-2', name: 'Борис' },
    { id: 'user-3', name: 'Вера' },
  ] as const

  test('возвращает только пользователей из избранного', () => {
    const state = {
      favorites: { ids: ['user-1', 'user-3'] },
      users,
    }

    const result = selectFavoriteUsers(state)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('user-1')
    expect(result[1].id).toBe('user-3')
  })

  test('возвращает пустой массив, когда избранное пустое', () => {
    const state = { favorites: { ids: [] }, users }

    expect(selectFavoriteUsers(state)).toEqual([])
  })

  test('возвращает пустой массив, когда нет пользователей', () => {
    const state = { favorites: { ids: ['user-1'] }, users: [] }

    expect(selectFavoriteUsers(state)).toEqual([])
  })

  test('игнорирует id, которых нет в users', () => {
    const state = { favorites: { ids: ['user-1', 'unknown'] }, users }

    expect(selectFavoriteUsers(state)).toHaveLength(1)
    expect(selectFavoriteUsers(state)[0].id).toBe('user-1')
  })
})

describe('useFavorites с selectFavoriteUsers', () => {
  test('toggleFavorite обновляет ids, которые использует selectFavoriteUsers', () => {
    const users = [
      { id: 'user-1', name: 'Анна' },
      { id: 'user-2', name: 'Борис' },
    ] as const

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    })

    expect(result.current.favoriteIds).toEqual([])

    act(() => result.current.toggleFavorite('user-1'))

    expect(result.current.favoriteIds).toEqual(['user-1'])
    expect(result.current.isFavorite('user-1')).toBe(true)
  })
})
