import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { getAuthUser, updateAuthUser } from '@/features/auth/model/authUtils'
import { useCities } from '@/features/cities-filter/model/useCities'

import { ProfileEditForm } from './ProfileEditForm'

jest.mock('@/features/auth/model/authUtils')
jest.mock('@/features/cities-filter/model/useCities')

const getAuthUserMock = getAuthUser as jest.MockedFunction<typeof getAuthUser>
const updateAuthUserMock = updateAuthUser as jest.MockedFunction<typeof updateAuthUser>
const useCitiesMock = useCities as jest.MockedFunction<typeof useCities>

const mockUser = {
  id: 'user-1',
  name: 'Мария',
  email: 'maria@gmail.com',
  token: 'mock_token_user-1',
  birthDate: '28.10.1995',
  gender: 'female' as const,
  city: 'Москва',
  about: 'Люблю учиться новому',
  avatarUrl: null,
}

describe('ProfileEditForm', () => {
  beforeEach(() => {
    getAuthUserMock.mockReturnValue(mockUser)

    updateAuthUserMock.mockImplementation((data) => ({
      ...mockUser,
      ...data,
    }))

    useCitiesMock.mockReturnValue({
      cities: [
        {
          id: 'moscow',
          title: 'Москва',
        },
        {
          id: 'kazan',
          title: 'Казань',
        },
      ],
      status: undefined,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('заполняет форму данными текущего пользователя', () => {
    render(<ProfileEditForm />)

    expect(screen.getByLabelText('Почта')).toHaveValue('maria@gmail.com')

    expect(screen.getByLabelText('Имя')).toHaveValue('Мария')

    expect(screen.getByLabelText('Дата рождения')).toHaveValue('28.10.1995')

    expect(screen.getByLabelText('О себе')).toHaveValue('Люблю учиться новому')
  })

  test('активирует кнопку сохранения после изменения формы', async () => {
    const user = userEvent.setup()

    render(<ProfileEditForm />)

    const saveButton = screen.getByRole('button', {
      name: 'Сохранить',
    })

    expect(saveButton).toBeDisabled()

    const nameInput = screen.getByLabelText('Имя')

    await user.clear(nameInput)
    await user.type(nameInput, 'Мария Иванова')

    expect(saveButton).toBeEnabled()
  })

  test('сохраняет изменённые данные пользователя', async () => {
    const user = userEvent.setup()

    render(<ProfileEditForm />)

    const nameInput = screen.getByLabelText('Имя')

    await user.clear(nameInput)
    await user.type(nameInput, 'Мария Иванова')

    await user.click(
      screen.getByRole('button', {
        name: 'Сохранить',
      }),
    )

    expect(updateAuthUserMock).toHaveBeenCalledTimes(1)

    expect(updateAuthUserMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Мария Иванова',
        birthDate: '28.10.1995',
        gender: 'female',
        city: 'Москва',
        about: 'Люблю учиться новому',
        avatarUrl: null,
      }),
    )

    expect(await screen.findByText('Изменения сохранены')).toBeInTheDocument()
  })
})
