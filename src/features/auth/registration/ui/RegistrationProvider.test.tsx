import {
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'

import { RegistrationLayout } from '@/app/layouts/RegistrationLayout'
import RegisterAccountPage from '@/pages/RegisterAccountPage'
import RegisterSkillPage from '@/pages/RegisterSkillPage'
import RegisterUserPage from '@/pages/RegisterUserPage'
import { LOCAL_STORAGE_KEYS, ROUTES } from '@/shared/lib/constants'
import type { AuthUser } from '@/shared/types'

import { REGISTRATION_DEFAULT_VALUES } from '../model/storage'
import type { RegistrationFormValues } from '../model/types'
import { RegistrationProvider } from './RegistrationProvider'

jest.mock(
  '@/api/skills',
  () => ({
    fetchSkillCategories:
      jest
        .fn()
        .mockResolvedValue([
          {
            id: 'creativity-art',
            title:
              'Творчество и искусство',

            skills: [
              {
                id: 'music-sound',
                title:
                  'Музыка и звук',
              },
              {
                id: 'photography',
                title:
                  'Фотография',
              },
            ],
          },

          {
            id:
              'foreign-languages',

            title:
              'Иностранные языки',

            skills: [
              {
                id: 'english',
                title:
                  'Английский',
              },
              {
                id: 'french',
                title:
                  'Французский',
              },
            ],
          },
        ]),
  }),
)

const STEP_ACCOUNT_HEADING = 'Регистрация: аккаунт'
const STEP_USER_HEADING = 'Регистрация: о себе'
const STEP_SKILL_HEADING = 'Регистрация: навыки'

const renderRegistration = (initialEntry: string) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<RegistrationProvider />}>
          <Route
            path={ROUTES.REGISTER}
            element={<Navigate to={ROUTES.REGISTER_ACCOUNT} replace />}
          />

          <Route element={<RegistrationLayout />}>
            <Route path={ROUTES.REGISTER_ACCOUNT} element={<RegisterAccountPage />} />
            <Route path={ROUTES.REGISTER_USER} element={<RegisterUserPage />} />
            <Route path={ROUTES.REGISTER_SKILL} element={<RegisterSkillPage />} />
          </Route>
        </Route>

        <Route path={ROUTES.HOME} element={<div>Главная страница</div>} />
      </Routes>
    </MemoryRouter>,
  )

const seedDraft = (draft: Partial<RegistrationFormValues>) => {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT,
    JSON.stringify({ ...REGISTRATION_DEFAULT_VALUES, ...draft }),
  )
}

const fillAccountStep = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Email'), 'user@example.com')
  await user.type(screen.getByLabelText('Пароль'), '12345678')
  await user.type(screen.getByLabelText('Повторите пароль'), '12345678')
}

beforeEach(() => {
  localStorage.clear()
})

describe('маршруты и защита от перепрыгивания', () => {
  test('/register ведёт на первый шаг', () => {
    renderRegistration(ROUTES.REGISTER)

    expect(screen.getByRole('heading', { name: STEP_ACCOUNT_HEADING })).toBeInTheDocument()
    expect(screen.getByText('Шаг 1 из 3')).toBeInTheDocument()
  })

  test('прямой заход на второй шаг с пустым черновиком возвращает на первый', () => {
    renderRegistration(ROUTES.REGISTER_USER)

    expect(screen.getByRole('heading', { name: STEP_ACCOUNT_HEADING })).toBeInTheDocument()
  })

  test('прямой заход на третий шаг с пустым черновиком возвращает на первый', () => {
    renderRegistration(ROUTES.REGISTER_SKILL)

    expect(screen.getByRole('heading', { name: STEP_ACCOUNT_HEADING })).toBeInTheDocument()
  })

  test('заход на третий шаг с невалидным вторым шагом возвращает на второй', () => {
    seedDraft({
      email: 'user@example.com',
      password: '12345678',
      confirmPassword: '12345678',
    })

    renderRegistration(ROUTES.REGISTER_SKILL)

    expect(screen.getByRole('heading', { name: STEP_USER_HEADING })).toBeInTheDocument()
    expect(screen.getByText('Шаг 2 из 3')).toBeInTheDocument()
  })

  test('заход на третий шаг с валидными первыми шагами открывает третий', () => {
    seedDraft({
      email: 'user@example.com',
      password: '12345678',
      confirmPassword: '12345678',
      name: 'Иван',
      birthDate: '01.01.2000',
      city: 'Москва',
    })

    renderRegistration(ROUTES.REGISTER_SKILL)

    expect(screen.getByRole('heading', { name: STEP_SKILL_HEADING })).toBeInTheDocument()
    expect(screen.getByText('Шаг 3 из 3')).toBeInTheDocument()
  })
})

describe('валидация текущего шага', () => {
  test('не переходит дальше и показывает ошибки под полями', async () => {
    const user = userEvent.setup()

    renderRegistration(ROUTES.REGISTER)

    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByRole('heading', { name: STEP_ACCOUNT_HEADING })).toBeInTheDocument()

    const alerts = (await screen.findAllByRole('alert')).map((node) => node.textContent)

    expect(alerts).toEqual(['Введите email', 'Введите пароль', 'Повторите пароль'])
  })

  test('проверяет только поля текущего шага', async () => {
    const user = userEvent.setup()

    seedDraft({
      email: 'user@example.com',
      password: '12345678',
      confirmPassword: '12345678',
    })

    renderRegistration(ROUTES.REGISTER_USER)

    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(await screen.findByText('Введите имя')).toBeInTheDocument()
    expect(screen.getByText('Введите дату рождения')).toBeInTheDocument()
    expect(screen.getByText('Введите город')).toBeInTheDocument()
    expect(screen.queryByText('Введите email')).not.toBeInTheDocument()
  })
})

describe('сохранение данных', () => {
  test('переносит введённое между шагами и в черновик', async () => {
    const user = userEvent.setup()

    renderRegistration(ROUTES.REGISTER)

    await fillAccountStep(user)
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(await screen.findByRole('heading', { name: STEP_USER_HEADING })).toBeInTheDocument()
    expect(screen.getByText('Шаг 2 из 3')).toBeInTheDocument()

    const savedDraft = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT) ?? '{}',
    ) as RegistrationFormValues

    expect(savedDraft).toMatchObject({
      email: 'user@example.com',
      password: '12345678',
      confirmPassword: '12345678',
    })

    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(await screen.findByLabelText('Email')).toHaveValue('user@example.com')
    expect(screen.getByLabelText('Пароль')).toHaveValue('12345678')
  })

  test('восстанавливает черновик после перезагрузки страницы', () => {
    seedDraft({ email: 'draft@example.com' })

    renderRegistration(ROUTES.REGISTER)

    expect(screen.getByLabelText('Email')).toHaveValue('draft@example.com')
    expect(screen.getByText('Шаг 1 из 3')).toBeInTheDocument()
  })
})

describe(
  'третий шаг регистрации',
  () => {
    const validPreviousSteps = {
      email:
        'user@example.com',

      password:
        '12345678',

      confirmPassword:
        '12345678',

      name: 'Иван',

      birthDate:
        '01.01.2000',

      city: 'Москва',
    }

    test(
      'подкатегории зависят от категории, а смена категории очищает подкатегорию',
      async () => {
        const user =
          userEvent.setup()

        seedDraft(
          validPreviousSteps,
        )

        renderRegistration(
          ROUTES.REGISTER_SKILL,
        )

        const categorySelect =
          await screen.findByRole(
            'combobox',
            {
              name:
                'Категория навыка, которому хотите научиться',
            },
          )

        await waitFor(() => {
          expect(
            categorySelect,
          ).toBeEnabled()
        })

        await user.click(
          categorySelect,
        )

        await user.click(
          screen.getByRole(
            'option',
            {
              name:
                'Творчество и искусство',
            },
          ),
        )

        const subcategorySelect =
          screen.getByRole(
            'combobox',
            {
              name:
                'Подкатегория',
            },
          )

        await user.click(
          subcategorySelect,
        )

        expect(
          screen.getByRole(
            'option',
            {
              name:
                'Музыка и звук',
            },
          ),
        ).toBeInTheDocument()

        expect(
          screen.queryByRole(
            'option',
            {
              name:
                'Английский',
            },
          ),
        ).not.toBeInTheDocument()

        await user.click(
          screen.getByRole(
            'option',
            {
              name:
                'Музыка и звук',
            },
          ),
        )

        expect(
          subcategorySelect,
        ).toHaveTextContent(
          'Музыка и звук',
        )

        /*
         * Меняем категорию.
         */
        await user.click(
          categorySelect,
        )

        await user.click(
          screen.getByRole(
            'option',
            {
              name:
                'Иностранные языки',
            },
          ),
        )

        await waitFor(() => {
          expect(
            subcategorySelect,
          ).toHaveTextContent(
            'Выберите подкатегорию навыка',
          )
        })

        await user.click(
          subcategorySelect,
        )

        expect(
          screen.getByRole(
            'option',
            {
              name:
                'Английский',
            },
          ),
        ).toBeInTheDocument()

        expect(
          screen.queryByRole(
            'option',
            {
              name:
                'Музыка и звук',
            },
          ),
        ).not.toBeInTheDocument()
      },
    )

    test(
      'Назад возвращает на второй экран и сохраняет данные третьего шага',
      async () => {
        const user =
          userEvent.setup()

        seedDraft(
          validPreviousSteps,
        )

        renderRegistration(
          ROUTES.REGISTER_SKILL,
        )

        await user.type(
          await screen.findByLabelText(
            'Название навыка',
          ),
          'Игра на гитаре',
        )

        await user.click(
          screen.getByRole(
            'button',
            {
              name: 'Назад',
            },
          ),
        )

        expect(
          await screen.findByRole(
            'heading',
            {
              name:
                STEP_USER_HEADING,
            },
          ),
        ).toBeInTheDocument()

        const savedDraft =
          JSON.parse(
            localStorage.getItem(
              LOCAL_STORAGE_KEYS
                .REGISTRATION_DRAFT,
            ) ?? '{}',
          ) as RegistrationFormValues

        expect(
          savedDraft.skillName,
        ).toBe(
          'Игра на гитаре',
        )
      },
    )

    test(
      'пустые обязательные поля не завершают регистрацию',
      async () => {
        const user =
          userEvent.setup()

        seedDraft(
          validPreviousSteps,
        )

        renderRegistration(
          ROUTES.REGISTER_SKILL,
        )

        await user.click(
          await screen.findByRole(
            'button',
            {
              name:
                'Продолжить',
            },
          ),
        )

        expect(
          screen.getByRole(
            'heading',
            {
              name:
                STEP_SKILL_HEADING,
            },
          ),
        ).toBeInTheDocument()

        expect(
          await screen.findByText(
            'Введите название навыка',
          ),
        ).toBeInTheDocument()

const categorySelect =
  screen.getByRole(
    'combobox',
    {
      name:
        'Категория навыка, которому хотите научиться',
    },
  )

expect(
  categorySelect,
).toHaveAttribute(
  'aria-invalid',
  'true',
)

const categoryErrorId =
  categorySelect.getAttribute(
    'aria-describedby',
  )

expect(
  categoryErrorId,
).toBeTruthy()

expect(
  document.getElementById(
    categoryErrorId as string,
  ),
).toHaveTextContent(
  'Выберите категорию навыка',
)

        const subcategorySelect =
  screen.getByRole(
    'combobox',
    {
      name: 'Подкатегория',
    },
  )

expect(
  subcategorySelect,
).toHaveAttribute(
  'aria-invalid',
  'true',
)

const subcategoryErrorId =
  subcategorySelect.getAttribute(
    'aria-describedby',
  )

expect(
  subcategoryErrorId,
).toBeTruthy()

expect(
  document.getElementById(
    subcategoryErrorId as string,
  ),
).toHaveTextContent(
  'Выберите подкатегорию навыка',
)

        expect(
          screen.getByText(
            'Добавьте описание навыка',
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            'Добавьте хотя бы одно изображение',
          ),
        ).toBeInTheDocument()
      },
    )
  },
)

describe('завершение регистрации', () => {
  test('сохраняет пользователя, чистит черновик и ведёт на главную', async () => {
    const user = userEvent.setup()

    renderRegistration(ROUTES.REGISTER)

    await fillAccountStep(user)
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    await user.type(await screen.findByLabelText('Имя'), 'Иван')
    await user.type(screen.getByLabelText('Дата рождения'), '01.01.2000')
    await user.type(screen.getByLabelText('Город'), 'Москва')
    await user.click(screen.getByRole('button', { name: 'Далее' }))

   await user.type(
  await screen.findByLabelText(
    'Название навыка',
  ),
  'Игра на гитаре',
)

const categorySelect =
  screen.getByRole(
    'combobox',
    {
      name:
        'Категория навыка, которому хотите научиться',
    },
  )

await waitFor(() => {
  expect(
    categorySelect,
  ).toBeEnabled()
})

await user.click(
  categorySelect,
)

await user.click(
  screen.getByRole(
    'option',
    {
      name:
        'Творчество и искусство',
    },
  ),
)

const subcategorySelect =
  screen.getByRole(
    'combobox',
    {
      name:
        'Подкатегория',
    },
  )

await user.click(
  subcategorySelect,
)

await user.click(
  screen.getByRole(
    'option',
    {
      name:
        'Музыка и звук',
    },
  ),
)

await user.type(
  screen.getByLabelText(
    'Описание',
  ),
  'Научу базовым аккордам и ритму',
)

const fileInput =
  document.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement

await user.upload(
  fileInput,
  new File(
    ['image'],
    'guitar.png',
    {
      type: 'image/png',
    },
  ),
)

/*
 * Проверяем отправку с клавиатуры.
 */
const continueButton =
  screen.getByRole(
    'button',
    {
      name: 'Продолжить',
    },
  )

continueButton.focus()

await user.keyboard(
  '{Enter}',
)

    expect(await screen.findByText('Главная страница')).toBeInTheDocument()

    const storedUser = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER) ?? 'null',
    ) as AuthUser | null

    expect(storedUser).toMatchObject({
      name: 'Иван',
      email: 'user@example.com',
    })
    expect(storedUser?.token).toMatch(/^mock_token_/)
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT)).toBeNull()
  })
})

describe('закрытие регистрации', () => {
  test('очищает черновик при нажатии «Закрыть»', async () => {
    const user = userEvent.setup()

    renderRegistration(ROUTES.REGISTER)

    await user.type(screen.getByLabelText('Email'), 'user@example.com')

    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT)).not.toBeNull()

    await user.click(screen.getByRole('link', { name: 'Закрыть и перейти на главную' }))

    expect(await screen.findByText('Главная страница')).toBeInTheDocument()
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT)).toBeNull()
  })
})
