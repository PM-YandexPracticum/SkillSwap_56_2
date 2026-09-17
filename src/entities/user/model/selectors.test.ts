import { expect, test, describe } from '@jest/globals'
import { selectFilteredUsers, selectHasMore } from './selectors'
import type { RootState } from '@/store'
import type { User } from '@/shared/types'
import type { CatalogFilters } from '@/widgets/FiltersBar'

// 1. Тестовые пользователи для проверки
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Иван',
    email: 'ivan@test.com',
    city: 'Москва',
    cityId: 'moscow',
    gender: 'male',
    birthDate: '1990-01-01',
    avatarUrl: null,
    createdAt: '2024-01-01',
    likesCount: 5,
    teachSkill: { id: 'guitar', title: 'Гитара', category: 'Музыка' },
    learnSkills: [{ id: 'english', title: 'Английский', category: 'Языки' }],
    favorites: [],
  },
  {
    id: '2',
    name: 'Анна',
    email: 'anna@test.com',
    city: 'Санкт-Петербург',
    cityId: 'saint-petersburg',
    gender: 'female',
     birthDate: '1995-05-05',
    avatarUrl: null,
    createdAt: '2024-02-01',
    likesCount: 10,
    teachSkill: { id: 'english', title: 'Английский', category: 'Языки' },
    learnSkills: [{ id: 'guitar', title: 'Гитара', category: 'Музыка' }],
    favorites: [],
  },
]

// Фильтры по умолчанию (ничего не выбрано)
const defaultFilters: CatalogFilters = {
  type: 'all',
  skills: [],
  gender: 'any',
  cities: [],
}

describe('тесты селекторов пользователей', () => {
  test('возвращает всех пользователей, если фильтры не установлены', () => {
    const state = {
      users: {
        users: mockUsers,
        status: 'succeeded',
        error: null,
        visible: 6,
      },
    } as unknown as RootState

    const result = selectFilteredUsers(state, defaultFilters)
    expect(result).toHaveLength(2)
  })

  test('фильтрует по полу (gender = female)', () => {
    const state = {
      users: {
        users: mockUsers,
        status: 'succeeded',
        error: null,
        visible: 6,
      },
    } as unknown as RootState

    const result = selectFilteredUsers(state, { ...defaultFilters, gender: 'female' })
    expect(result).toEqual([mockUsers[1]]) // ждем только Анну
  })

  test('фильтрует по городу (cities = [moscow])', () => {
     const state = {
      users: {
        users: mockUsers,
        status: 'succeeded',
        error: null,
        visible: 6,
      },
    } as unknown as RootState

    const result = selectFilteredUsers(state, { ...defaultFilters, cities: ['moscow'] })
    expect(result).toEqual([mockUsers[0]]) // ждем только Ивана
  })

  test('фильтрует по типу teach и навыку', () => {
    const state = {
      users: {
        users: mockUsers,
        status: 'succeeded',
        error: null,
        visible: 6,
      },
    } as unknown as RootState

    const result = selectFilteredUsers(state, {
      ...defaultFilters,
      type: 'teach',
      skills: ['guitar'],
    })
    expect(result).toEqual([mockUsers[0]]) // учить гитаре может только Иван
  })

  test('проверка пагинации selectHasMore', () => {
    // В стейте видно 6 человек, а отфильтровано всего 2
    const state = {
      users: {
        users: mockUsers,
        status: 'succeeded',
        error: null,
        visible: 6,
      },
    } as unknown as RootState

    const hasMore = selectHasMore(state, defaultFilters)
    expect(hasMore).toBe(false)
  })
})