import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import type { User } from '@/shared/types'

import { SectionCards, type SectionCardsProps } from './SectionCards'

const makeUser = (id: string, name: string): User => ({
  id,
  name,
  email: `${id}@example.com`,
  city: 'Москва',
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

const renderSection = (props: Partial<SectionCardsProps> = {}) =>
  render(
    <MemoryRouter>
      <SectionCards title="Точное совпадение" users={users} status="succeeded" {...props} />
    </MemoryRouter>,
  )

describe('SectionCards', () => {
  test('status="loading" отрисовывает ровно skeletonCount скелетонов без карточек', () => {
    renderSection({ status: 'loading', skeletonCount: 4 })

    expect(screen.getAllByTestId('section-card-skeleton')).toHaveLength(4)
    expect(screen.queryByRole('link', { name: 'Подробнее' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  test('status="succeeded" с 3 пользователями отрисовывает 3 карточки без скелетонов', () => {
    renderSection()

    expect(screen.getAllByRole('link', { name: 'Подробнее' })).toHaveLength(3)
    expect(screen.queryByTestId('section-card-skeleton')).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  test('карточки находятся в li внутри ul, а у списка нет маркера', () => {
    renderSection()

    const list = screen.getByRole('list', { name: 'Точное совпадение' })
    const items = within(list).getAllByRole('listitem')

    expect(list.tagName).toBe('UL')
    expect(list).toHaveClass('grid')
    expect(items).toHaveLength(3)
    items.forEach((item) => expect(item.closest('ul')).toBe(list))
  })

  test('status="succeeded" с пустым массивом показывает текст пустого состояния', () => {
    renderSection({ users: [] })

    expect(screen.getByText('Пока никого нет')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  test('status="failed" показывает ошибку и кнопка "Повторить" вызывает onRetry', async () => {
    const handleRetry = jest.fn()
    renderSection({ status: 'failed', onRetry: handleRetry })

    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось загрузить карточки')

    await userEvent.click(screen.getByRole('button', { name: 'Повторить' }))

    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  test('показывает кнопку "Смотреть все", когда передан allHref', () => {
    renderSection({ allHref: '/catalog' })

    expect(screen.getByRole('link', { name: 'Смотреть все' })).toHaveAttribute('href', '/catalog')
  })

  test('не показывает кнопку "Смотреть все", когда allHref не передан', () => {
    renderSection()

    expect(screen.queryByRole('link', { name: 'Смотреть все' })).not.toBeInTheDocument()
  })
})
