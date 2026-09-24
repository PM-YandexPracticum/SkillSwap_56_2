import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import type { User } from '@/shared/types'

import favoritesReducer from '@/features/favorites/model/favoritesSlice'
import usersReducer, { type UsersState } from '@/entities/user/model/usersSlice'

import FavoritesPage from './index'

const makeUser = (id: string, name: string): User => ({
  id,
  name,
  email: `${id}@example.com`,
  cityId: 'moscow',
  city: 'Москва',
  gender: 'male',
  birthDate: '1994-04-10',
  avatarUrl: null,
  createdAt: '2024-01-10T10:00:00.000Z',
  likesCount: 7,
  teachSkill: {
    id: `teach-${id}`,
    title: 'Игра на барабанах',
    category: 'Творчество и искусство',
  },
  learnSkills: [
    { id: `learn-${id}-1`, title: 'Тайм менеджмент', category: 'Бизнес и карьера' },
    { id: `learn-${id}-2`, title: 'Медитация', category: 'Здоровье и лайфстайл' },
  ],
  favorites: [],
})

const users = [makeUser('user-1', 'Иван'), makeUser('user-2', 'Анна'), makeUser('user-3', 'Максим')]

const createWrapper = (favoriteIds: string[] = []) => {
  const store = configureStore({
    reducer: {
      favorites: favoritesReducer,
      users: usersReducer,
    },
    preloadedState: {
      favorites: { ids: favoriteIds },
      users: {
        users,
        status: 'succeeded' as const,
        error: null,
        visible: 6,
      } as UsersState,
    },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  )

  return Wrapper
}

const renderPage = (favoriteIds: string[] = []) =>
  render(<FavoritesPage />, { wrapper: createWrapper(favoriteIds) })

describe('FavoritesPage', () => {
  test('показывает текст пустого состояния, когда избранное пусто', () => {
    renderPage()

    expect(screen.getByText('Вы пока не добавили никого в избранное')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Подробнее' })).not.toBeInTheDocument()
  })

  test('показывает карточки избранных пользователей', () => {
    renderPage(['user-1'])

    expect(screen.getByText('Иван')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Подробнее' })).toHaveAttribute('href', '/skill/user-1')
  })

  test('показывает все избранные карточки', () => {
    renderPage(['user-1', 'user-2'])

    expect(screen.getByText('Иван')).toBeInTheDocument()
    expect(screen.getByText('Анна')).toBeInTheDocument()
    expect(screen.queryByText('Максим')).not.toBeInTheDocument()
  })
})
