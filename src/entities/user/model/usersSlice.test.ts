import usersReducer, { loadUsers, showMore } from './usersSlice'
import type { UsersState } from './usersSlice'
import * as selectors from './selectors'
import type { RootState } from '@/store'
import type { User } from '@/shared/types'

const mockUsers = [
  {
    id: 'user-1',
    name: 'Иван',
    email: 'ivan@example.com',
    city: 'Санкт-Петербург',
    birthDate: '1992-02-12',
    avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
    createdAt: '2024-01-10T10:00:00.000Z',
    likesCount: 7,
    teachSkill: { id: 'music-sound', title: 'Музыка и звук', category: 'Творчество' },
    learnSkills: [],
    favorites: [],
  },
  {
    id: 'user-2',
    name: 'Анна',
    email: 'anna@example.com',
    city: 'Москва',
    birthDate: '1994-11-21',
    avatarUrl: 'https://randomuser.me/api/portraits/women/21.jpg',
    createdAt: '2024-04-02T08:40:00.000Z',
    likesCount: 11,
    teachSkill: { id: 'drawing', title: 'Рисование', category: 'Творчество' },
    learnSkills: [],
    favorites: [],
  },
  {
    id: 'user-3',
    name: 'Мария',
    email: 'maria@example.com',
    city: 'Казань',
    birthDate: '1990-05-08',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    createdAt: '2024-04-18T14:05:00.000Z',
    likesCount: 7,
    teachSkill: { id: 'cooking', title: 'Кулинария', category: 'Дом' },
    learnSkills: [],
    favorites: [],
  },
  {
    id: 'user-4',
    name: 'Олег',
    email: 'oleg@example.com',
    city: 'Новосибирск',
    birthDate: '2005-03-04',
    avatarUrl: null,
    createdAt: '2024-03-20T09:15:00.000Z',
    likesCount: 4,
    teachSkill: { id: 'japanese', title: 'Японский', category: 'Языки' },
    learnSkills: [],
    favorites: [],
  },
  {
    id: 'user-5',
    name: 'Дмитрий',
    email: 'dmitry@example.com',
    city: 'Екатеринбург',
    birthDate: '1991-01-30',
    avatarUrl: 'https://randomuser.me/api/portraits/men/52.jpg',
    createdAt: '2024-05-12T16:45:00.000Z',
    likesCount: 7,
    teachSkill: { id: 'project-mgmt', title: 'Управление', category: 'Бизнес' },
    learnSkills: [],
    favorites: [],
  },
  {
    id: 'user-6',
    name: 'Елена',
    email: 'elena@example.com',
    city: 'Краснодар',
    birthDate: '1988-09-15',
    avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
    createdAt: '2024-06-03T09:00:00.000Z',
    likesCount: 11,
    teachSkill: { id: 'yoga', title: 'Йога', category: 'Здоровье' },
    learnSkills: [],
    favorites: [],
  },
  {
    id: 'user-7',
    name: 'София',
    email: 'sofia@example.com',
    city: 'Нижний Новгород',
    birthDate: '2001-06-03',
    avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    createdAt: '2024-07-08T18:25:00.000Z',
    likesCount: 12,
    teachSkill: { id: 'photography', title: 'Фото', category: 'Творчество' },
    learnSkills: [],
    favorites: [],
  },
  {
    id: 'user-8',
    name: 'Павел',
    email: 'pavel@example.com',
    city: 'Сочи',
    birthDate: '1987-12-19',
    avatarUrl: 'https://randomuser.me/api/portraits/men/68.jpg',
    createdAt: '2024-08-04T10:15:00.000Z',
    likesCount: 1,
    teachSkill: { id: 'german', title: 'Немецкий', category: 'Языки' },
    learnSkills: [],
    favorites: [],
  },
]

const createInitialState = (): UsersState => ({
  users: [] as User[],
  status: 'idle',
  visible: 6,
})

describe('usersSlice', () => {
  describe('initialState', () => {
    test('возвращает начальное состояние', () => {
      const state = usersReducer(undefined, { type: 'unknown' })
      expect(state).toEqual(createInitialState())
    })
  })

  describe('loadUsers', () => {
    test('pending — устанавливает status: loading', () => {
      const action = loadUsers.pending('request-id')
      const state = usersReducer(createInitialState(), action)
      expect(state.status).toBe('loading')
      expect(state.users).toEqual([])
    })

    test('fulfilled — устанавливает users и status: succeeded', () => {
      const action = loadUsers.fulfilled([], 'request-id', undefined)
      const state = usersReducer(createInitialState(), action)
      expect(state.status).toBe('succeeded')
      expect(state.users).toEqual([])
    })

    test('fulfilled — сохраняет загруженных пользователей', () => {
      const initialState = createInitialState()
      const fulfillAction = loadUsers.fulfilled(mockUsers, 'request-id', undefined)
      const newState = usersReducer(initialState, fulfillAction)

      expect(newState.status).toBe('succeeded')
      expect(newState.users).toHaveLength(8)
      expect(newState.users[0].name).toBe('Иван')
    })

    test('rejected — устанавливает status: failed', () => {
      const action = loadUsers.rejected(new Error('Error message'), 'request-id', undefined)
      const state = usersReducer(createInitialState(), action)
      expect(state.status).toBe('failed')
    })
  })

  describe('showMore', () => {
    test('увеличивает visible на 6', () => {
      const state = { ...createInitialState(), visible: 6 }
      const action = showMore()
      const newState = usersReducer(state, action)
      expect(newState.visible).toBe(12)
    })

    test('может вызываться многократно', () => {
      let state = { ...createInitialState(), visible: 6 }
      state = usersReducer(state, showMore())
      state = usersReducer(state, showMore())
      expect(state.visible).toBe(18)
    })
  })
})

describe('selectors', () => {
  const usersState = {
    users: mockUsers,
    status: 'succeeded' as const,
    visible: 6,
  }

  const rootState = { users: usersState }

  describe('selectUsers', () => {
    test('возвращает массив пользователей', () => {
      expect(selectors.selectUsers(rootState)).toBe(mockUsers)
    })
  })

  describe('selectUsersStatus', () => {
    test('возвращает статус', () => {
      expect(selectors.selectUsersStatus(rootState)).toBe('succeeded')
    })
  })

  describe('selectUsersVisible', () => {
    test('возвращает visible', () => {
      expect(selectors.selectUsersVisible(rootState)).toBe(6)
    })
  })

  describe('selectPopular', () => {
    test('возвращает 3 пользователей с наибольшим likesCount по убыванию', () => {
      const result = selectors.selectPopular(rootState)
      expect(result).toHaveLength(3)
      expect(result[0].likesCount).toBeGreaterThanOrEqual(result[1].likesCount)
      expect(result[1].likesCount).toBeGreaterThanOrEqual(result[2].likesCount)
      expect(result[0].name).toBe('София') // likesCount: 12
    })

    test('возвращает одинаковый объект при неизменном стейте (memoization)', () => {
      const result1 = selectors.selectPopular(rootState)
      const result2 = selectors.selectPopular(rootState)
      expect(result1).toBe(result2)
    })
  })

  describe('selectNew', () => {
    test('возвращает 3 самых свежих пользователя по createdAt', () => {
      const result = selectors.selectNew(rootState)
      expect(result).toHaveLength(3)
      expect(result[0].createdAt >= result[1].createdAt).toBe(true)
      expect(result[1].createdAt >= result[2].createdAt).toBe(true)
    })

    test('возвращает одинаковый объект при неизменном стейте (memoization)', () => {
      const result1 = selectors.selectNew(rootState)
      const result2 = selectors.selectNew(rootState)
      expect(result1).toBe(result2)
    })
  })

  describe('selectRecommended', () => {
    test('возвращает первые visible пользователей', () => {
      const result = selectors.selectRecommended(rootState)
      expect(result).toHaveLength(6)
      expect(result).toEqual(mockUsers.slice(0, 6))
    })

    test('возвращает меньше если users.length < visible', () => {
      const partialState: RootState = {
        users: {
          users: mockUsers.slice(0, 3),
          status: 'succeeded',
          visible: 6,
        },
      }
      const result = selectors.selectRecommended(partialState)
      expect(result).toHaveLength(3)
    })

    test('возвращает одинаковый объект при неизменном стейте (memoization)', () => {
      const result1 = selectors.selectRecommended(rootState)
      const result2 = selectors.selectRecommended(rootState)
      expect(result1).toBe(result2)
    })
  })

  describe('selectHasMore', () => {
    test('возвращает false когда показаны все пользователи', () => {
      const state: RootState = {
        users: {
          users: mockUsers,
          status: 'succeeded',
          visible: 8,
        },
      }
      expect(selectors.selectHasMore(state)).toBe(false)
    })

    test('возвращает false когда visible == users.length', () => {
      const state: RootState = {
        users: {
          users: mockUsers,
          status: 'succeeded',
          visible: 8,
        },
      }
      expect(selectors.selectHasMore(state)).toBe(false)
    })

    test('возвращает true когда visible < users.length', () => {
      const state: RootState = {
        users: {
          users: mockUsers,
          status: 'succeeded',
          visible: 6,
        },
      }
      expect(selectors.selectHasMore(state)).toBe(true)
    })

    test('возвращает одинаковый объект при неизменном стейте (memoization)', () => {
      const result1 = selectors.selectHasMore(rootState)
      const result2 = selectors.selectHasMore(rootState)
      expect(result1).toBe(result2)
    })
  })
})
