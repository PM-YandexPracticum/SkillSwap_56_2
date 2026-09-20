import * as yup from 'yup'

import type { Gender } from '@/shared/types'

import type { ProfileFormValues } from './types'

const parseDisplayDate = (value: string): Date | undefined => {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)

  if (!match) {
    return undefined
  }

  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  const isRealDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)

  return isRealDate ? date : undefined
}

export const profileSchema: yup.ObjectSchema<ProfileFormValues> = yup.object({
  email: yup.string().email('Введите корректную почту').required('Введите почту'),

  name: yup
    .string()
    .trim()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .required('Введите имя'),

  birthDate: yup
    .string()
    .required('Укажите дату рождения')
    .test('not-future', 'Дата рождения не может быть в будущем', (value) => {
      if (!value) {
        return true
      }

      const date = parseDisplayDate(value)

      return !date || date <= new Date()
    }),

  gender: yup.mixed<Gender>().oneOf(['male', 'female'], 'Выберите пол').required('Выберите пол'),

  city: yup.string().required('Выберите город'),

  about: yup.string().max(500, 'Максимум 500 символов').defined(),

  avatar: yup.mixed<File | string>().nullable().defined(),
})
