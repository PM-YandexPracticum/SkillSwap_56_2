import { configureStore } from '@reduxjs/toolkit'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'

import type { User } from '@/shared/types'

import favoritesReducer from './favoritesSlice'
import { selectFavoriteUsers } from './selectors'
import { useFavorites } from './useFavorites'

const createWrapper = (extraReducers: Record<string, unknown> = {}) => {
  const store = configureStore({
    reducer: { favorites: favoritesReducer, ...extraReducers },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  return Wrapper
}

describe('selectFavoriteUsers', () => {
  const users: User[] = [
    {
      id: 'user-1',
      name: 'Анна',
      email: 'anna@example.com',
      cityId: 'moscow',
      city: 'Москва',
      gender: 'female',
      birthDate: '1990-01-01',
      avatarUrl: null,
      createdAt: '2024-01-01',
      likesCount: 5,
      teachSkill: { id: 'guitar', title: 'Гитара', category: 'Музыка' },
      learnSkills: [{ id: 'english', title: 'Английский', category: 'Языки' }],
      favorites: [],
    },
    {
      id: 'user-2',
      name: 'Борис',
      email: 'boris@example.com',
      cityId: 'moscow',
      city: 'Москва',
      gender: 'male',
      birthDate: '1992-05-05',
      avatarUrl: null,
      createdAt: '2024-02-01',
      likesCount: 10,
      teachSkill: { id: 'piano', title: 'Фортепиано', category: 'Музыка' },
      learnSkills: [{ id: 'drums', title: 'Барабаны', category: 'Музыка' }],
      favorites: [],
    },
    {
      id: 'user-3',
      name: 'Вера',
      email: 'vera@example.com',
      cityId: 'spb',
      city: 'Санкт-Петербург',
      gender: 'female',
      birthDate: '1995-10-10',
      avatarUrl: null,
      createdAt: '2024-03-01',
      likesCount: 3,
      teachSkill: { id: 'painting', title: 'Живопись', category: 'Творчество' },
      learnSkills: [{ id: 'photography', title: 'Фотография', category: 'Творчество' }],
      favorites: [],
    },
  ]

  test('возвращает только пользователей из избранного', () => {
    const state = {
      favorites: { ids: ['user-1', 'user-3'] },
      users: { users },
    }

    const result = selectFavoriteUsers(state)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('user-1')
    expect(result[1].id).toBe('user-3')
  })

  test('возвращает пустой массив, когда избранное пустое', () => {
    const state = { favorites: { ids: [] }, users: { users } }

    expect(selectFavoriteUsers(state)).toEqual([])
  })

  test('возвращает пустой массив, когда нет пользователей', () => {
    const state = { favorites: { ids: ['user-1'] }, users: { users: [] } }

    expect(selectFavoriteUsers(state)).toEqual([])
  })

  test('игнорирует id, которых нет в users', () => {
    const state = { favorites: { ids: ['user-1', 'unknown'] }, users: { users } }

    expect(selectFavoriteUsers(state)).toHaveLength(1)
    expect(selectFavoriteUsers(state)[0].id).toBe('user-1')
  })
})

describe('useFavorites', () => {
  test('toggleFavorite обновляет ids', () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    })

    expect(result.current.favoriteIds).toEqual([])

    act(() => result.current.toggleFavorite('user-1'))

    expect(result.current.favoriteIds).toEqual(['user-1'])
    expect(result.current.isFavorite('user-1')).toBe(true)
  })
})
