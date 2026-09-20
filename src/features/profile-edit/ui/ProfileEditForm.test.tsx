import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { getAuthUser, updateAuthUser } from '@/features/auth/model/authUtils'
import { useCities } from '@/entities/city'

import { ProfileEditForm } from './ProfileEditForm'

jest.mock('@/features/auth/model/authUtils')
jest.mock('@/entities/city')

const getAuthUserMock = getAuthUser as jest.MockedFunction<typeof getAuthUser>
const updateAuthUserMock = updateAuthUser as jest.MockedFunction<typeof updateAuthUser>
const useCitiesMock = useCities as jest.MockedFunction<typeof useCities>

const mockUser = {
  id: 'user-1',
  name: 'Мария',
  email: 'maria@gmail.com',
  token: 'mock_token_user-1',
  birthDate: '1995-10-28',
  gender: 'female' as const,
  city: 'Москва',
  about: 'Люблю учиться новому',
  avatarUrl: null,
}

const renderForm = () => render(<ProfileEditForm />)

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
    renderForm()

    expect(screen.getByLabelText('Почта')).toHaveValue('maria@gmail.com')

    expect(screen.getByLabelText('Имя')).toHaveValue('Мария')

    expect(screen.getByLabelText('Дата рождения')).toHaveValue('28.10.1995')

    expect(screen.getByLabelText('О себе')).toHaveValue('Люблю учиться новому')
  })

  test('активирует кнопку сохранения после изменения формы', async () => {
    const user = userEvent.setup()

    renderForm()

    const saveButton = screen.getByRole('button', {
      name: 'Сохранить',
    })

    expect(saveButton).toBeDisabled()

    const nameInput = screen.getByLabelText('Имя')

    await user.clear(nameInput)
    await user.type(nameInput, 'Мария Иванова')

    expect(saveButton).toBeEnabled()
  })

  test('сохраняет изменённые данные пользователя в формате ISO и сбрасывает форму', async () => {
    const user = userEvent.setup()

    renderForm()

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
        birthDate: '1995-10-28',
        gender: 'female',
        city: 'Москва',
        about: 'Люблю учиться новому',
        avatarUrl: null,
      }),
    )

    expect(await screen.findByText('Изменения сохранены')).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Сохранить',
      }),
    ).toBeDisabled()
  })

  test('показывает ошибку валидации для короткого имени', async () => {
    const user = userEvent.setup()

    renderForm()

    const nameInput = screen.getByLabelText('Имя')

    await user.clear(nameInput)
    await user.type(nameInput, 'М')

    await user.click(
      screen.getByRole('button', {
        name: 'Сохранить',
      }),
    )

    expect(await screen.findByText('Имя должно содержать минимум 2 символа')).toBeInTheDocument()

    expect(updateAuthUserMock).not.toHaveBeenCalled()
  })

  test('показывает ошибку, если пользователь не найден', async () => {
    const user = userEvent.setup()

    updateAuthUserMock.mockReturnValue(null)

    renderForm()

    const nameInput = screen.getByLabelText('Имя')

    await user.clear(nameInput)
    await user.type(nameInput, 'Мария Иванова')

    await user.click(
      screen.getByRole('button', {
        name: 'Сохранить',
      }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent('Пользователь не найден')
  })

  test('скрывает сообщение об успехе при новых изменениях', async () => {
    const user = userEvent.setup()

    renderForm()

    const nameInput = screen.getByLabelText('Имя')

    await user.clear(nameInput)
    await user.type(nameInput, 'Мария Иванова')

    await user.click(
      screen.getByRole('button', {
        name: 'Сохранить',
      }),
    )

    expect(await screen.findByText('Изменения сохранены')).toBeInTheDocument()

    await user.type(nameInput, '!')

    expect(screen.queryByText('Изменения сохранены')).not.toBeInTheDocument()
  })
})
