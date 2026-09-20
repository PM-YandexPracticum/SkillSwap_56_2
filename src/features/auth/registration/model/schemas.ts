import {
  format,
  isAfter,
  isValid,
  parse,
  startOfDay,
} from 'date-fns'
import * as yup from 'yup'

const BIRTH_DATE_FORMAT = 'dd.MM.yyyy'

const parseBirthDate = (
  value: string,
): Date | undefined => {
  if (
    value.length !==
    BIRTH_DATE_FORMAT.length
  ) {
    return undefined
  }

  const parsed = startOfDay(
    parse(
      value,
      BIRTH_DATE_FORMAT,
      new Date(),
    ),
  )

  if (
    !isValid(parsed) ||
    format(
      parsed,
      BIRTH_DATE_FORMAT,
    ) !== value
  ) {
    return undefined
  }

  return parsed
}

export const accountStepSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Введите корректный email')
    .required('Введите email'),

  password: yup
    .string()
    .min(8, 'Минимум 8 символов')
    .required('Введите пароль'),

  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password')],
      'Пароли не совпадают',
    )
    .required('Повторите пароль'),
})

export const userStepSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Минимум 2 символа')
    .required('Введите имя'),

  birthDate: yup
    .string()
    .trim()
    .required('Введите дату рождения')
    .test(
      'valid-birth-date',
      'Введите корректную дату рождения',
      (value) => {
        if (!value) {
          return true
        }

        return Boolean(
          parseBirthDate(value),
        )
      },
    )
    .test(
      'not-in-future',
      'Дата рождения не может быть в будущем',
      (value) => {
        if (!value) {
          return true
        }

        const parsed =
          parseBirthDate(value)

        if (!parsed) {
          return true
        }

        return !isAfter(
          parsed,
          startOfDay(new Date()),
        )
      },
    ),

  gender: yup
    .string()
    .oneOf(['', 'male', 'female'])
    .optional(),

  city: yup
    .string()
    .trim()
    .required('Выберите город'),

  learningCategory: yup
    .string()
    .trim()
    .required('Выберите категорию'),

  learningSubcategory: yup
    .string()
    .trim()
    .required('Выберите подкатегорию'),
})

export const skillStepSchema = yup.object({
  skillName: yup
    .string()
    .trim()
    .required('Введите название навыка'),

  skillCategory: yup
    .string()
    .trim()
    .required('Выберите категорию навыка'),

  skillSubcategory: yup
    .string()
    .trim()
    .required('Выберите подкатегорию навыка'),

  skillDescription: yup
    .string()
    .trim()
    .required('Добавьте описание навыка'),

  skillImages: yup
    .array()
    .min(
      1,
      'Добавьте хотя бы одно изображение',
    )
    .required(
      'Добавьте хотя бы одно изображение',
    ),
})
