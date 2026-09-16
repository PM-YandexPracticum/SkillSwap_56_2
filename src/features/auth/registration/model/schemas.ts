import * as yup from 'yup'

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
    .required('Введите дату рождения'),

  city: yup
    .string()
    .trim()
    .required('Введите город'),
})

export const skillStepSchema = yup.object({
  teachSkill: yup
    .string()
    .trim()
    .required(
      'Укажите навык, которому можете научить',
    ),

  learnSkill: yup
    .string()
    .trim()
    .required(
      'Укажите навык, которому хотите научиться',
    ),
})