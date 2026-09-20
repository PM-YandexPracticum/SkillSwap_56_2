import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { Input } from './input'

describe('Input', () => {
  describe('react-hook-form', () => {
    it('передаёт значение в форму через register', async () => {
      const user = userEvent.setup()

      function Form() {
        const { register, watch } = useForm<{ email: string }>({
          defaultValues: { email: '' },
        })
        const email = watch('email')

        return (
          <>
            <Input label="Email" {...register('email')} />
            <span data-testid="out">{email}</span>
          </>
        )
      }

      render(<Form />)
      await user.type(screen.getByLabelText('Email'), 'user@example.com')

      expect(screen.getByTestId('out')).toHaveTextContent('user@example.com')
    })

    it('показывает ошибку валидации под полем', async () => {
      const user = userEvent.setup()

      function Form() {
        const {
          register,
          formState: { errors },
        } = useForm<{ email: string }>({
          defaultValues: { email: '' },
          mode: 'onChange',
        })

        return (
          <Input
            label="Email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Введите email',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Неверный email',
              },
            })}
          />
        )
      }

      render(<Form />)

      await user.type(screen.getByLabelText('Email'), 'not-an-email')
      expect(await screen.findByText('Неверный email')).toBeInTheDocument()
    })
  })

  describe('ручное использование', () => {
    it('вызывает onChange с событием', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(<Input label="Имя" onChange={handleChange} />)
      await user.type(screen.getByLabelText('Имя'), 'A')

      expect(handleChange).toHaveBeenCalled()
      const event = handleChange.mock.calls[0][0] as React.ChangeEvent<HTMLInputElement>
      expect(event.target.value).toBe('A')
    })

    it('вызывает onValueChange со строкой', async () => {
      const user = userEvent.setup()
      const handleValueChange = jest.fn()

      render(<Input label="Имя" onValueChange={handleValueChange} />)
      await user.type(screen.getByLabelText('Имя'), 'AB')

      expect(handleValueChange).toHaveBeenLastCalledWith('AB')
    })
  })

  describe('состояния', () => {
    it('рендерит helperText, если нет ошибки', () => {
      render(<Input label="Email" helperText="Введите email" />)
      expect(screen.getByText('Введите email')).toBeInTheDocument()
    })

    it('показывает error вместо helperText', () => {
      render(<Input label="Email" error="Ошибка" helperText="Подсказка" />)
      expect(screen.getByText('Ошибка')).toBeInTheDocument()
      expect(screen.queryByText('Подсказка')).not.toBeInTheDocument()
    })

    it('рендерит textarea при multiline', () => {
      render(<Input label="Описание" multiline rows={3} />)
      expect(screen.getByLabelText('Описание').tagName).toBe('TEXTAREA')
    })
  })
})