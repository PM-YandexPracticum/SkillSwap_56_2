import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { clearAuthUser, saveAuthUser, updateAuthUser } from '@/features/auth/model/authUtils'
import { LOCAL_STORAGE_KEYS, ROUTES } from '@/shared/lib/constants'

import { Header } from './Header'

jest.mock('@/features/skills-menu', () => ({ SkillsMenu: () => null }))

const user = {
  id: 'user-1',
  name: 'Иван',
  email: 'user@example.com',
  avatarUrl: 'data:image/png;base64,YXZhdGFy',
}

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )

beforeEach(() => localStorage.clear())

test('показывает гостевые кнопки без пользователя', () => {
  renderHeader()

  expect(screen.getByRole('link', { name: 'Войти' })).toHaveAttribute('href', ROUTES.LOGIN)
  expect(screen.getByRole('link', { name: 'Зарегистрироваться' })).toBeInTheDocument()
})

test('читает имя и аватар из localStorage после перезагрузки', () => {
  saveAuthUser(user)
  const view = renderHeader()
  view.unmount()
  renderHeader()

  expect(screen.getByText(user.name)).toBeInTheDocument()
  expect(screen.getByRole('img', { name: user.name })).toHaveAttribute('src', user.avatarUrl)
  expect(screen.queryByRole('link', { name: 'Войти' })).not.toBeInTheDocument()
})

test('обновляется при регистрации, редактировании профиля и выходе без перезагрузки', () => {
  renderHeader()

  act(() => {
    saveAuthUser(user)
  })
  expect(screen.getByRole('img', { name: user.name })).toHaveAttribute('src', user.avatarUrl)

  act(() => {
    updateAuthUser({ name: 'Анна', avatarUrl: 'data:image/png;base64,bmV3' })
  })
  expect(screen.getByText('Анна')).toBeInTheDocument()
  expect(screen.getByRole('img', { name: 'Анна' })).toHaveAttribute(
    'src',
    'data:image/png;base64,bmV3',
  )

  act(() => {
    clearAuthUser()
  })
  expect(screen.getByRole('link', { name: 'Войти' })).toBeInTheDocument()
  expect(screen.queryByText('Анна')).not.toBeInTheDocument()
})

test('реагирует на изменение пользователя в другой вкладке', () => {
  renderHeader()

  act(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify({ ...user, token: 'token' }))
    window.dispatchEvent(new StorageEvent('storage', { key: LOCAL_STORAGE_KEYS.AUTH_USER }))
  })

  expect(screen.getByText(user.name)).toBeInTheDocument()
})
