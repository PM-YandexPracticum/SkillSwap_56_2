import type { User } from '@/shared/types'

import { byCreatedAtDesc, byLikesDesc } from './comparators'

const makeUser = (id: string, createdAt: string, likesCount: number) =>
  ({ id, createdAt, likesCount }) as User

const users = [
  makeUser('old-popular', '2024-01-01T00:00:00.000Z', 30),
  makeUser('new-unpopular', '2024-06-01T00:00:00.000Z', 1),
  makeUser('middle', '2024-03-01T00:00:00.000Z', 10),
]

describe('компараторы пользователей', () => {
  test('byCreatedAtDesc сортирует от новых к старым', () => {
    const sorted = [...users].sort(byCreatedAtDesc)
    expect(sorted.map((user) => user.id)).toEqual(['new-unpopular', 'middle', 'old-popular'])
  })

  test('byLikesDesc сортирует по убыванию лайков', () => {
    const sorted = [...users].sort(byLikesDesc)
    expect(sorted.map((user) => user.id)).toEqual(['old-popular', 'middle', 'new-unpopular'])
  })

  test('byLikesDesc не падает на строковых датах', () => {
    const sorted = [...users].sort(byLikesDesc)
    expect(sorted).toHaveLength(users.length)
  })
})
