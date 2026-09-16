import { useFormContext } from 'react-hook-form'

import {
  useRegistrationFlow,
  type RegistrationFormValues,
} from '@/features/auth/registration'
import { Button } from '@/shared/ui/Button'

export default function RegisterAccountPage() {
  const {
    register,
    formState: {
      errors,
    },
  } =
    useFormContext<RegistrationFormValues>()

  const { nextStep } =
    useRegistrationFlow()

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()

        void nextStep()
      }}
    >
      <h1>
        Регистрация: аккаунт
      </h1>

      <label htmlFor="register-email">
        Email
      </label>

      <input
        id="register-email"
        type="email"
        {...register('email')}
      />

      {errors.email?.message && (
        <p role="alert">
          {errors.email.message}
        </p>
      )}

      <label htmlFor="register-password">
        Пароль
      </label>

      <input
        id="register-password"
        type="password"
        {...register('password')}
      />

      {errors.password?.message && (
        <p role="alert">
          {errors.password.message}
        </p>
      )}

      <label htmlFor="register-confirm-password">
        Повторите пароль
      </label>

      <input
        id="register-confirm-password"
        type="password"
        {...register(
          'confirmPassword',
        )}
      />

      {errors.confirmPassword
        ?.message && (
        <p role="alert">
          {
            errors.confirmPassword
              .message
          }
        </p>
      )}

      <Button type="submit">
        Далее
      </Button>
    </form>
  )
}