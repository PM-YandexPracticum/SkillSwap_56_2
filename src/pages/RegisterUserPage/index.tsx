import { useFormContext } from 'react-hook-form'

import {
  useRegistrationFlow,
  type RegistrationFormValues,
} from '@/features/auth/registration'
import { Button } from '@/shared/ui/Button'

export default function RegisterUserPage() {
  const {
    register,
    formState: {
      errors,
    },
  } =
    useFormContext<RegistrationFormValues>()

  const {
    nextStep,
    previousStep,
  } = useRegistrationFlow()

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()

        void nextStep()
      }}
    >
      <h1>
        Регистрация: о себе
      </h1>

      <label htmlFor="register-name">
        Имя
      </label>

      <input
        id="register-name"
        {...register('name')}
      />

      {errors.name?.message && (
        <p role="alert">
          {errors.name.message}
        </p>
      )}

      <label htmlFor="register-birth-date">
        Дата рождения
      </label>

      <input
        id="register-birth-date"
        placeholder="ДД.ММ.ГГГГ"
        {...register(
          'birthDate',
        )}
      />

      {errors.birthDate
        ?.message && (
        <p role="alert">
          {
            errors.birthDate
              .message
          }
        </p>
      )}

      <label htmlFor="register-city">
        Город
      </label>

      <input
        id="register-city"
        {...register('city')}
      />

      {errors.city?.message && (
        <p role="alert">
          {errors.city.message}
        </p>
      )}

      <Button
        type="button"
        variant="secondary"
        onClick={previousStep}
      >
        Назад
      </Button>

      <Button type="submit">
        Далее
      </Button>
    </form>
  )
}