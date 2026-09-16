import { useFormContext } from 'react-hook-form'

import {
  useRegistrationFlow,
  type RegistrationFormValues,
} from '@/features/auth/registration'
import { Button } from '@/shared/ui/Button'

export default function RegisterSkillPage() {
  const {
    register,
    formState: {
      errors,
    },
  } =
    useFormContext<RegistrationFormValues>()

  const {
    finishRegistration,
    previousStep,
  } = useRegistrationFlow()

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()

        void finishRegistration()
      }}
    >
      <h1>
        Регистрация: навыки
      </h1>

      <label htmlFor="register-teach-skill">
        Могу научить
      </label>

      <input
        id="register-teach-skill"
        {...register(
          'teachSkill',
        )}
      />

      {errors.teachSkill
        ?.message && (
        <p role="alert">
          {
            errors.teachSkill
              .message
          }
        </p>
      )}

      <label htmlFor="register-learn-skill">
        Хочу научиться
      </label>

      <input
        id="register-learn-skill"
        {...register(
          'learnSkill',
        )}
      />

      {errors.learnSkill
        ?.message && (
        <p role="alert">
          {
            errors.learnSkill
              .message
          }
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
        Завершить регистрацию
      </Button>
    </form>
  )
}