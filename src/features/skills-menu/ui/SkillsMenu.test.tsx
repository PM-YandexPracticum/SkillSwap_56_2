import { fireEvent, render, screen } from '@testing-library/react'

import { resetSkillCategoriesCache } from '@/entities/skill'

import { SkillsMenu } from './SkillsMenu'

/* моки-заглушки для svg */
jest.mock('@/shared/ui/icons/assets/briefcase.svg', () => 'briefcase-stub')
jest.mock('@/shared/ui/icons/assets/book.svg', () => 'book-stub')
jest.mock('@/shared/ui/icons/assets/palette.svg', () => 'palette-stub')
jest.mock('@/shared/ui/icons/assets/global.svg', () => 'global-stub')
jest.mock('@/shared/ui/icons/assets/home.svg', () => 'home-stub')
jest.mock('@/shared/ui/icons/assets/lifestyle.svg', () => 'lifestyle-stub')

const categories = [
  {
    id: 'business-career',
    title: 'Бизнес и карьера',
    skills: [
      { id: 'marketing', title: 'Маркетинг и реклама' },
      { id: 'time-management', title: 'Тайм-менеджмент' },
    ],
  },
  {
    id: 'foreign-languages',
    title: 'Иностранные языки',
    skills: [{ id: 'english', title: 'Английский' }],
  },
]

const fetchMock = jest.fn()

beforeEach(() => {
  resetSkillCategoriesCache()

  Object.defineProperty(globalThis, 'fetch', {
    writable: true,
    configurable: true,
    value: fetchMock,
  })

  fetchMock.mockResolvedValue({ ok: true, json: async () => categories })
})

afterEach(() => {
  fetchMock.mockReset()
})

test('клик кнопки открытия меню скиллов', async () => {
  render(<SkillsMenu />)

  const button = screen.getByText('Все навыки')
  const menu = screen.getByTestId('menu')

  expect(await screen.findByText('Бизнес и карьера')).toBeInTheDocument()
  expect(menu.className).not.toContain('open')

  fireEvent.click(button)
  expect(menu.className).toContain('open') // Проверяем состояние, а не появление окна: из-за анимации оно уже в DOM
})

test('рисует категории и навыки из api', async () => {
  render(<SkillsMenu />)

  expect(await screen.findByText('Иностранные языки')).toBeInTheDocument()
  expect(screen.getByText('Маркетинг и реклама')).toBeInTheDocument()
  expect(screen.getByText('Тайм-менеджмент')).toBeInTheDocument()
  expect(screen.getByText('Английский')).toBeInTheDocument()
})

test('сообщает об ошибке загрузки', async () => {
  fetchMock.mockResolvedValue({ ok: false })

  render(<SkillsMenu />)

  expect(await screen.findByText('Не удалось загрузить навыки')).toBeInTheDocument()
})

test('закрытие вне окна', async () => {
  render(<SkillsMenu />)

  const button = screen.getByText('Все навыки')
  const menu = screen.getByTestId('menu')

  expect(await screen.findByText('Бизнес и карьера')).toBeInTheDocument()
  expect(menu.className).not.toContain('open')

  fireEvent.click(button)
  expect(menu.className).toContain('open')

  fireEvent.mouseDown(document.body)
  expect(menu.className).not.toContain('open')
})

test('закрытие через esc', async () => {
  render(<SkillsMenu />)

  const button = screen.getByText('Все навыки')
  const menu = screen.getByTestId('menu')

  expect(await screen.findByText('Бизнес и карьера')).toBeInTheDocument()
  expect(menu.className).not.toContain('open')

  fireEvent.click(button)
  expect(menu.className).toContain('open')

  fireEvent.keyDown(button, { key: 'Escape' })
  expect(menu.className).not.toContain('open')
})
