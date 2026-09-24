import { act, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import { clearAuthUser, saveAuthUser } from '@/features/auth/model/authUtils'
import { ROUTES } from '@/shared/lib/constants'

import { ProtectedRoute } from './ProtectedRoute'

const authUser = {
  id: 'user-1',
  name: 'Иван',
  email: 'user@example.com',
}

const LoginStub = () => {
  const location = useLocation()

  return <div>Login: {location.pathname}</div>
}

const renderRoutes = (initialEntry: string = ROUTES.PROFILE) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginStub />} />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.PROFILE} element={<div>Profile</div>} />

          <Route
            path={ROUTES.PROFILE_PERSONAL}
            element={<div>Personal profile</div>}
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  localStorage.clear()
})

describe('ProtectedRoute', () => {
  test('перенаправляет гостя с profile на страницу входа', async () => {
    renderRoutes()

    expect(await screen.findByText(`Login: ${ROUTES.LOGIN}`)).toBeInTheDocument()

    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
  })

  test('пропускает зарегистрированного пользователя в profile', () => {
    saveAuthUser(authUser)

    renderRoutes()

    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  test('защищает вложенные страницы profile', async () => {
    renderRoutes(ROUTES.PROFILE_PERSONAL)

    expect(await screen.findByText(`Login: ${ROUTES.LOGIN}`)).toBeInTheDocument()

    expect(screen.queryByText('Personal profile')).not.toBeInTheDocument()
  })

  test('перенаправляет на login после выхода из аккаунта', async () => {
    saveAuthUser(authUser)

    renderRoutes()

    expect(screen.getByText('Profile')).toBeInTheDocument()

    act(() => {
      clearAuthUser()
    })

    expect(await screen.findByText(`Login: ${ROUTES.LOGIN}`)).toBeInTheDocument()
  })
})