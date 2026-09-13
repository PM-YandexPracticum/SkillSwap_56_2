import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, jest } from '@jest/globals'
import { SkillsMenu } from './SkillsMenu'

/*моки заглушки для svg */
jest.mock('@/shared/ui/icons/assets/briefcase.svg', () => 'briefcase-stub')
jest.mock('@/shared/ui/icons/assets/book.svg', () => 'book-stub')
jest.mock('@/shared/ui/icons/assets/palette.svg', () => 'palette-stub')
jest.mock('@/shared/ui/icons/assets/global.svg', () => 'global-stub')
jest.mock('@/shared/ui/icons/assets/home.svg', () => 'home-stub')
jest.mock('@/shared/ui/icons/assets/lifestyle.svg', () => 'lifestyle-stub')

test('клик кнопки открытия меню скиллов', () => {
  render(<SkillsMenu />)

  const button = screen.getByText('Все навыки')
  const menu = screen.getByTestId('menu')

  expect(menu.className).not.toContain('open')

  fireEvent.click(button)
  expect(menu.className).toContain('open') // Проверяем состояние а не  появление окна так как из-за стилей окно уже хранится  в открытом состояни для анимации ccs
})

test(' закрытие вне окна', () => {
  render(<SkillsMenu />)

  const button = screen.getByText('Все навыки')
  const menu = screen.getByTestId('menu')

  expect(menu.className).not.toContain('open')

  fireEvent.click(button)
  expect(menu.className).toContain('open')

  fireEvent.mouseDown(document.body)
  expect(menu.className).not.toContain('open')
})

test('закрытие через esc', () => {
  render(<SkillsMenu />)

  const button = screen.getByText('Все навыки')
  const menu = screen.getByTestId('menu')

  expect(menu.className).not.toContain('open')

  fireEvent.click(button)
  expect(menu.className).toContain('open')

  fireEvent.keyDown(button, { key: 'Escape' })
  expect(menu.className).not.toContain('open')
})
