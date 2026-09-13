import { render, screen } from '@testing-library/react'
import { UserCard } from './UserCard'
import { fetchUsers } from '@/api/users'

jest.mock('@/api/users', () => ({
  fetchUsers: jest.fn(),
}))

const mockedFetchUsers = fetchUsers as jest.MockedFunction<typeof fetchUsers>

describe('UserCard', () => {
  beforeEach(() => {
    mockedFetchUsers.mockResolvedValue([
      {
        id: 'user-1',
        name: 'Иван',
        email: 'ivan@example.com',
        city: 'Санкт-Петербург',
        birthDate: '1992-02-12',
        avatarUrl: null,
        createdAt: '2024-01-10T10:00:00.000Z',
        likesCount: 7,
        teachSkill: {
          id: 'music-sound',
          title: 'Музыка и звук',
          category: 'Творчество и искусство',
        },
        learnSkills: [],
        favorites: [],
      },
    ])
  })

  test('рендерит имя пользователя', async () => {
    render(<UserCard />)

    expect(await screen.findByText('Иван')).toBeInTheDocument()
  })

  test('рендерит текст о себе', async () => {
    render(<UserCard />)

    expect(
      await screen.findByText(
        'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
      ),
    ).toBeInTheDocument()
  })
})