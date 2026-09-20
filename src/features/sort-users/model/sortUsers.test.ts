import type { User } from '@/shared/types'

import { sortUsers } from './sortUsers'

const makeUser = (id: string, createdAt: string, likesCount: number) =>
  ({ id, createdAt, likesCount }) as User

const users = [
  makeUser('old-popular', '2024-01-01T00:00:00.000Z', 30),
  makeUser('new-unpopular', '2024-06-01T00:00:00.000Z', 1),
  makeUser('middle', '2024-03-01T00:00:00.000Z', 10),
]

describe('sortUsers', () => {
  test('newest — от новых к старым', () => {
    expect(sortUsers(users, 'newest').map((user) => user.id)).toEqual([
      'new-unpopular',
      'middle',
      'old-popular',
    ])
  })

  test('popular — по убыванию лайков', () => {
    expect(sortUsers(users, 'popular').map((user) => user.id)).toEqual([
      'old-popular',
      'middle',
      'new-unpopular',
    ])
  })

  test('не мутирует исходный массив', () => {
    const source = [...users]
    sortUsers(source, 'popular')

    expect(source).toEqual(users)
  })
})
