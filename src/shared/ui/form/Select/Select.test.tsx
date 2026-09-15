import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'

import {
  Select,
  type SelectOption,
} from './Select'

interface FormValues {
  city: string
}

const options: SelectOption[] = [
  {
    value: 'moscow',
    label: 'Москва',
  },
  {
    value: 'spb',
    label: 'Санкт-Петербург',
  },
  {
    value: 'kazan',
    label: 'Казань',
  },
]

const TestForm = ({
  required = false,
}: {
  required?: boolean
}) => {
  const {
    control,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      city: '',
    },
  })

  return (
    <form
      onSubmit={handleSubmit(
        () => undefined,
      )}
    >
      <Select
        name="city"
        control={control}
        label="Город"
        placeholder="Не указан"
        options={options}
        rules={
          required
            ? {
                required:
                  'Выберите город',
              }
            : undefined
        }
      />

      <button type="submit">
        Отправить
      </button>
    </form>
  )
}

describe('Select', () => {
  test(
    'показывает placeholder и выбирает значение по клику',
    async () => {
      const user =
        userEvent.setup()

      render(<TestForm />)

      const trigger =
        screen.getByRole(
          'combobox',
          {
            name: 'Город',
          },
        )

      expect(
        trigger,
      ).toHaveTextContent(
        'Не указан',
      )

      await user.click(trigger)

      await user.click(
        screen.getByRole(
          'option',
          {
            name: 'Москва',
          },
        ),
      )

      expect(
        trigger,
      ).toHaveTextContent(
        'Москва',
      )

      expect(
        screen.queryByRole(
          'listbox',
        ),
      ).not.toBeInTheDocument()
    },
  )

  test(
    'открывается с клавиатуры, позволяет выбрать стрелками и Enter',
    async () => {
      const user =
        userEvent.setup()

      render(<TestForm />)

      const trigger =
        screen.getByRole(
          'combobox',
          {
            name: 'Город',
          },
        )

      trigger.focus()

      await user.keyboard(
        '{Enter}',
      )

      expect(
        screen.getByRole(
          'listbox',
        ),
      ).toBeInTheDocument()

      await user.keyboard(
        '{ArrowDown}{Enter}',
      )

      expect(
        trigger,
      ).not.toHaveTextContent(
        'Не указан',
      )

      expect(
        screen.queryByRole(
          'listbox',
        ),
      ).not.toBeInTheDocument()
    },
  )

  test(
  'закрывается по Esc и по клику вне списка',
  async () => {
    const user = userEvent.setup()

    render(<TestForm />)

    const trigger = screen.getByRole(
      'combobox',
      {
        name: 'Город',
      },
    )

    await user.click(trigger)

    expect(
      screen.getByRole('listbox'),
    ).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(
      screen.queryByRole('listbox'),
    ).not.toBeInTheDocument()

    await user.click(trigger)

    expect(
      screen.getByRole('listbox'),
    ).toBeInTheDocument()

    fireEvent.pointerDown(
      document.body,
      {
        button: 0,
        pointerType: 'mouse',
      },
    )

    await waitFor(() => {
      expect(
        screen.queryByRole(
          'listbox',
        ),
      ).not.toBeInTheDocument()
    })
  },
)

  test(
    'показывает ошибку RHF',
    async () => {
      const user =
        userEvent.setup()

      render(
        <TestForm required />,
      )

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Отправить',
          },
        ),
      )

      expect(
        await screen.findByText(
          'Выберите город',
        ),
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          'combobox',
          {
            name: 'Город',
          },
        ),
      ).toHaveAttribute(
        'aria-invalid',
        'true',
      )
    },
  )
})