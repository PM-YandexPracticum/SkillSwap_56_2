import * as yup from 'yup'

import type { Gender } from '@/shared/types'

import type { ProfileFormValues } from './types'

export const profileSchema: yup.ObjectSchema<ProfileFormValues> = yup.object({
  email: yup.string().email('Введите корректную почту').required('Введите почту'),

  name: yup
    .string()
    .trim()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .required('Введите имя'),

  birthDate: yup.string().required('Укажите дату рождения'),

  gender: yup.mixed<Gender>().oneOf(['male', 'female'], 'Выберите пол').required('Выберите пол'),

  city: yup.string().required('Выберите город'),

  about: yup.string().max(500, 'Максимум 500 символов').defined(),

  avatar: yup.mixed<File | string>().nullable().defined(),
})
