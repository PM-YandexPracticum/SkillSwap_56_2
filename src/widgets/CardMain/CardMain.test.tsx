import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import type { User } from '@/shared/types'

import { CardMain, type CardMainProps } from './CardMain'

const user: User = {
  id: 'user-1',
  name: 'Иван',
  email: 'ivan@example.com',
  city: 'Санкт-Петербург',
  cityId: "saint-petersburg",
  gender: "male",
  birthDate: '1992-02-12',
  avatarUrl: null,
  createdAt: '2024-01-10T10:00:00.000Z',
  likesCount: 7,
  teachSkill: { id: 'music-sound', title: 'Музыка и звук', category: 'Творчество и искусство' },
  learnSkills: [
    { id: 'english', title: 'Английский', category: 'Иностранные языки' },
    { id: 'french', title: 'Французский', category: 'Иностранные языки' },
    { id: 'personal-brand', title: 'Личный бренд', category: 'Бизнес и карьера' },
    { id: 'cleaning-organizing', title: 'Уборка и порядок', category: 'Дом и уют' },
  ],
  favorites: [],
}

const renderCard = (props: Partial<CardMainProps> = {}) =>
  render(
    <MemoryRouter>
      <CardMain user={user} {...props} />
    </MemoryRouter>,
  )

describe('CardMain', () => {
  test('берет имя, город и навык из пропса user', () => {
    renderCard()

    expect(screen.getByText('Иван')).toBeInTheDocument()
    expect(screen.getByText(/Санкт-Петербург/)).toBeInTheDocument()
    expect(screen.getByText('Музыка и звук')).toBeInTheDocument()
  })

  test('показывает два навыка и число скрытых в последнем теге', () => {
    renderCard()

    expect(screen.getByText('Английский')).toBeInTheDocument()
    expect(screen.getByText('Французский')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
    expect(screen.queryByText('Личный бренд')).not.toBeInTheDocument()
  })

  test('не показывает тег с числом, когда навыков всего два', () => {
    renderCard({ user: { ...user, learnSkills: user.learnSkills.slice(0, 2) } })

    expect(screen.getByText('Английский')).toBeInTheDocument()
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
  })

  test('по клику на сердечко вызывает onLikeToggle с id пользователя', async () => {
    const handleLikeToggle = jest.fn()
    renderCard({ onLikeToggle: handleLikeToggle })

    await userEvent.click(screen.getByRole('button'))

    expect(handleLikeToggle).toHaveBeenCalledTimes(1)
    expect(handleLikeToggle).toHaveBeenCalledWith('user-1')
  })

  test('кнопка «Подробнее» ведет на страницу навыка', () => {
    renderCard()

    expect(screen.getByRole('link', { name: 'Подробнее' })).toHaveAttribute('href', '/skill/user-1')
  })
})
