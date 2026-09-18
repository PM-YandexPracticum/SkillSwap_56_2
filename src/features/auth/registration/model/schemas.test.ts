import { accountStepSchema, skillStepSchema, userStepSchema } from './schemas'

const validAccount = {
  email: 'user@example.com',
  password: '12345678',
  confirmPassword: '12345678',
}

const validUser = {
  name: 'Иван',
  birthDate: '01.01.2000',
  city: 'Москва',
}

const validSkill = {
  teachSkill: 'Игра на гитаре',
  learnSkill: 'Английский язык',
}

describe('accountStepSchema', () => {
  test('принимает корректные данные', async () => {
    await expect(accountStepSchema.validate(validAccount)).resolves.toEqual(validAccount)
  })

  test('отклоняет некорректный email', async () => {
    await expect(
      accountStepSchema.validate({ ...validAccount, email: 'not-an-email' }),
    ).rejects.toThrow('Введите корректный email')
  })

  test('отклоняет короткий пароль', async () => {
    await expect(
      accountStepSchema.validate({
        ...validAccount,
        password: 'short',
        confirmPassword: 'short',
      }),
    ).rejects.toThrow('Минимум 8 символов')
  })

  test('отклоняет несовпадающие пароли', async () => {
    await expect(
      accountStepSchema.validate({ ...validAccount, confirmPassword: '12345679' }),
    ).rejects.toThrow('Пароли не совпадают')
  })

  test('отклоняет пустые поля', async () => {
    await expect(
      accountStepSchema.validate({ email: '', password: '', confirmPassword: '' }),
    ).rejects.toThrow()
  })
})

describe('userStepSchema', () => {
  test('принимает корректные данные', async () => {
    await expect(userStepSchema.validate(validUser)).resolves.toEqual(validUser)
  })

  test('отклоняет слишком короткое имя', async () => {
    await expect(userStepSchema.validate({ ...validUser, name: 'И' })).rejects.toThrow(
      'Минимум 2 символа',
    )
  })

  test('отклоняет пустые дату рождения и город', async () => {
    await expect(
      userStepSchema.validate({ name: 'Иван', birthDate: '', city: '' }),
    ).rejects.toThrow()
  })
})

describe('skillStepSchema', () => {
  test('принимает корректные данные', async () => {
    await expect(skillStepSchema.validate(validSkill)).resolves.toEqual(validSkill)
  })

  test('отклоняет пустые навыки', async () => {
    await expect(skillStepSchema.validate({ teachSkill: '   ', learnSkill: '' })).rejects.toThrow()
  })
})
