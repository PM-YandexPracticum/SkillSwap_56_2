import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFormContext } from 'react-hook-form'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { fetchCities } from '@/api/cities'
import { MainLayout } from '@/app/layouts/mainLayout'
import { getAuthUser, saveAuthUser } from '@/features/auth/model/authUtils'
import { ProfileEditForm } from '@/features/profile-edit/ui/ProfileEditForm'
import { LOCAL_STORAGE_KEYS, ROUTES } from '@/shared/lib/constants'
import { Header } from '@/widgets/Header'

import { REGISTRATION_DEFAULT_VALUES } from '../model/storage'
import type { RegistrationFormValues } from '../model/types'
import { RegistrationProvider, useRegistrationFlow } from './RegistrationProvider'

jest.mock('@/api/cities', () => ({
  fetchCities: jest.fn().mockResolvedValue([{ id: 'moscow', title: 'Москва' }]),
}))
jest.mock('@/features/skills-menu', () => ({ SkillsMenu: () => null }))

const avatar = new File(['avatar'], 'avatar.png', { type: 'image/png' })
const images = [
  new File(['first'], 'first.png', { type: 'image/png' }),
  new File(['second'], 'second.webp', { type: 'image/webp' }),
]
const expectedSkills = [
  {
    skillName: 'Игра на гитаре',
    skillCategory: 'creativity-art',
    skillSubcategory: 'music-sound',
    skillDescription: 'Научу играть на гитаре',
    skillImages: ['data:image/png;base64,Zmlyc3Q=', 'data:image/webp;base64,c2Vjb25k'],
  },
]

const seedDraft = () => {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT,
    JSON.stringify({
      ...REGISTRATION_DEFAULT_VALUES,
      email: 'user@example.com',
      password: '12345678',
      confirmPassword: '12345678',
      name: 'Иван',
      birthDate: '28.10.1995',
      gender: 'male',
      city: 'moscow',
      learningCategory: 'foreign-languages',
      learningSubcategory: 'english',
      skillName: 'Игра на гитаре',
      skillCategory: 'creativity-art',
      skillSubcategory: 'music-sound',
      skillDescription: 'Научу играть на гитаре',
    }),
  )
}

const FinishStep = ({ avatarValue = avatar }: { avatarValue?: File | string | null }) => {
  const { setValue } = useFormContext<RegistrationFormValues>()
  const { finishRegistration, submitError, isFinishing } = useRegistrationFlow()

  return (
    <>
      <button
        disabled={isFinishing}
        onClick={() => {
          setValue('avatar', avatarValue)
          setValue('skillImages', images)
          void finishRegistration()
        }}
      >
        Завершить
      </button>
      {submitError && <p role="alert">{submitError}</p>}
    </>
  )
}

const renderFinish = (avatarValue?: File | string | null) =>
  render(
    <MemoryRouter initialEntries={[ROUTES.REGISTER_SKILL]}>
      <Routes>
        <Route element={<RegistrationProvider />}>
          <Route path={ROUTES.REGISTER_SKILL} element={<FinishStep avatarValue={avatarValue} />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<div>Главная страница</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  localStorage.clear()
  seedDraft()
})

afterEach(() => jest.restoreAllMocks())

test('сохраняет весь профиль и навык, очищает черновик, показывает успех и Header; данные переживают F5', async () => {
  const user = userEvent.setup()
  const view = renderFinish()
  await user.click(screen.getByRole('button', { name: 'Завершить' }))

  expect(await screen.findByText('Главная страница')).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('Регистрация успешно завершена')
  expect(getAuthUser()).toEqual({
    id: expect.any(String),
    token: expect.stringMatching(/^mock_token_/),
    name: 'Иван',
    email: 'user@example.com',
    birthDate: '1995-10-28',
    gender: 'male',
    city: 'Москва',
    about: '',
    avatarUrl: 'data:image/png;base64,YXZhdGFy',
    learningCategory: 'foreign-languages',
    learningSubcategory: 'english',
  })
  expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SKILLS)!)).toEqual(expectedSkills)
  expect(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT)).toBeNull()
  expect(screen.getByRole('img', { name: 'Иван' })).toHaveAttribute(
    'src',
    'data:image/png;base64,YXZhdGFy',
  )
  expect(screen.queryByRole('link', { name: 'Войти' })).not.toBeInTheDocument()

  view.unmount()
  render(
    <MemoryRouter>
      <Header />
      <ProfileEditForm />
    </MemoryRouter>,
  )

  expect(screen.getByLabelText('Имя')).toHaveValue('Иван')
  expect(screen.getByLabelText('Почта')).toHaveValue('user@example.com')
  expect(screen.getByLabelText('Дата рождения')).toHaveValue('28.10.1995')
  expect(screen.getByRole('combobox', { name: 'Пол' })).toHaveTextContent('Мужской')
  await waitFor(() =>
    expect(screen.getByRole('combobox', { name: 'Город' })).toHaveTextContent('Москва'),
  )
  expect(screen.getAllByRole('img', { name: 'Иван' })).toHaveLength(2)
  expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SKILLS)!)).toEqual(expectedSkills)
})

test.each([null, 'data:image/png;base64,c2F2ZWQ='])(
  'повторная регистрация заменяет профиль и навыки; аватар %s',
  async (avatarValue) => {
    const user = userEvent.setup()
    saveAuthUser({
      id: 'old',
      name: 'Мария',
      email: 'old@example.com',
      avatarUrl: 'old.png',
      about: 'Старое описание',
    })
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.USER_SKILLS,
      JSON.stringify([{ skillName: 'Старый навык' }]),
    )
    renderFinish(avatarValue)

    await user.click(screen.getByRole('button', { name: 'Завершить' }))

    expect(await screen.findByText('Главная страница')).toBeInTheDocument()
    expect(getAuthUser()).toMatchObject({ name: 'Иван', avatarUrl: avatarValue, about: '' })
    expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SKILLS)!)).toEqual(
      expectedSkills,
    )
  },
)

test('при ошибке записи профиля сохраняет прежние данные и черновик, позволяет повторить отправку', async () => {
  const user = userEvent.setup()
  const previousUser = saveAuthUser({ id: 'old', name: 'Мария', email: 'old@example.com' })
  const previousSkills = JSON.stringify([{ skillName: 'Старый навык' }])
  localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SKILLS, previousSkills)
  const setItem = Storage.prototype.setItem
  const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
    this: Storage,
    key,
    value,
  ) {
    if (key === LOCAL_STORAGE_KEYS.AUTH_USER)
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    setItem.call(this, key, value)
  })
  renderFinish()

  await user.click(screen.getByRole('button', { name: 'Завершить' }))

  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось завершить регистрацию')
  expect(getAuthUser()).toEqual(previousUser)
  expect(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SKILLS)).toBe(previousSkills)
  expect(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT)).not.toBeNull()
  spy.mockRestore()

  await user.click(screen.getByRole('button', { name: 'Завершить' }))
  expect(await screen.findByText('Главная страница')).toBeInTheDocument()
  expect(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT)).toBeNull()
})

test('при ошибке загрузки города не сохраняет незавершённую регистрацию', async () => {
  jest.mocked(fetchCities).mockRejectedValueOnce(new Error('Network error'))
  const user = userEvent.setup()
  renderFinish()

  await user.click(screen.getByRole('button', { name: 'Завершить' }))

  expect(await screen.findByRole('alert')).toBeInTheDocument()
  expect(getAuthUser()).toBeNull()
  expect(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SKILLS)).toBeNull()
  expect(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT)).not.toBeNull()
})
