import { configureStore } from '@reduxjs/toolkit'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import { resetCitiesCache } from '@/entities/city'
import { usersReducer, type User } from '@/entities/user'
import { resetSkillCategoriesCache } from '@/entities/skill'
import { favoritesReducer } from '@/features/favorites'

import CatalogPage from './index'

const makeUser = (index: number): User => ({
  id: `user-${index}`,
  name: `Пользователь ${index}`,
  email: `user-${index}@example.com`,
  cityId: 'moscow',
  city: 'Москва',
  gender: 'male',
  birthDate: '1995-01-01',
  avatarUrl: null,
  createdAt: new Date(2024, 0, index).toISOString(),
  likesCount: 100 - index,
  teachSkill: { id: 'guitar', title: 'Гитара', category: 'Творчество и искусство' },
  learnSkills: [{ id: 'english', title: 'Английский', category: 'Иностранные языки' }],
  favorites: [],
})

const users = Array.from({ length: 8 }, (_, index) => makeUser(index + 1))

const cities = [{ id: 'moscow', title: 'Москва' }]
const categories = [
  {
    id: 'creativity-art',
    title: 'Творчество и искусство',
    skills: [{ id: 'guitar', title: 'Гитара' }],
  },
]

const fetchMock = jest.fn()

const okResponse = (url: string) => {
  const data = url.includes('users') ? users : url.includes('cities') ? cities : categories
  return Promise.resolve({ ok: true, json: async () => data })
}

const makeStore = () =>
  configureStore({
    reducer: { users: usersReducer, favorites: favoritesReducer },
  })

const renderPage = (store = makeStore()) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    </Provider>,
  )

const getCardNames = () =>
  screen.getAllByRole('link', { name: 'Подробнее' }).map((link) => {
    const card = link.parentElement as HTMLElement
    return within(card).getByRole('heading', { level: 3 }).textContent
  })

beforeEach(() => {
  resetCitiesCache()
  resetSkillCategoriesCache()

  Object.defineProperty(globalThis, 'fetch', {
    writable: true,
    configurable: true,
    value: fetchMock,
  })

  fetchMock.mockImplementation(okResponse)
})

afterEach(() => {
  fetchMock.mockReset()
})

describe('CatalogPage', () => {
  test('без активных фильтров показывает подборки', async () => {
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Новое' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Рекомендуем' })).toBeInTheDocument()
    expect(screen.queryByText(/Фильтры \(/)).not.toBeInTheDocument()
  })

  test('выбор типа фильтра включает сетку с чипсом и пагинацией', async () => {
    renderPage()

    await screen.findByRole('heading', { name: 'Популярное' })
    await userEvent.click(screen.getByRole('radio', { name: 'Могу научить' }))

    expect(await screen.findByText('Фильтры (1)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Убрать фильтр по типу' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Подходящие предложения: 8' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Подробнее' })).toHaveLength(6)

    await userEvent.click(screen.getByRole('button', { name: 'Показать ещё' }))

    expect(screen.getAllByRole('link', { name: 'Подробнее' })).toHaveLength(8)
  })

  test('снятие чипса возвращает подборки', async () => {
    renderPage()

    await screen.findByRole('heading', { name: 'Популярное' })
    await userEvent.click(screen.getByRole('radio', { name: 'Могу научить' }))
    await screen.findByText('Фильтры (1)')

    await userEvent.click(screen.getByRole('button', { name: 'Убрать фильтр по типу' }))

    expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    expect(screen.queryByText(/Фильтры \(/)).not.toBeInTheDocument()
  })

  test('сортировка меняет порядок карточек', async () => {
    renderPage()

    await screen.findByRole('heading', { name: 'Популярное' })
    await userEvent.click(screen.getByRole('radio', { name: 'Могу научить' }))
    await screen.findByText('Фильтры (1)')

    expect(getCardNames()[0]).toBe('Пользователь 8')

    await userEvent.click(screen.getByRole('button', { name: /Сначала новые/ }))
    await userEvent.click(screen.getByRole('option', { name: 'По популярности' }))

    expect(getCardNames()[0]).toBe('Пользователь 1')
  })

  test('ошибка загрузки показывает alert и повторный запрос возвращает карточки', async () => {
    fetchMock.mockImplementation((url: string) =>
      url.includes('users') ? Promise.reject(new Error('Сеть недоступна')) : okResponse(url),
    )

    renderPage()

    await screen.findByRole('heading', { name: 'Популярное' })
    await userEvent.click(screen.getByRole('radio', { name: 'Могу научить' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Сеть недоступна')

    fetchMock.mockImplementation(okResponse)
    await userEvent.click(screen.getByRole('button', { name: 'Повторить' }))

    expect(await screen.findAllByRole('link', { name: 'Подробнее' })).toHaveLength(6)
  })
})
