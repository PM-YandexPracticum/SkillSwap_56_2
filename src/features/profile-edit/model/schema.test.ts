import { profileSchema } from './schema'

describe('profileSchema', () => {
  test('пропускает прошедшую дату рождения в формате DatePicker', async () => {
    await expect(profileSchema.validateAt('birthDate', { birthDate: '28.10.1995' })).resolves.toBe(
      '28.10.1995',
    )
  })

  test('не пропускает будущую дату рождения', async () => {
    await expect(
      profileSchema.validateAt('birthDate', { birthDate: '01.01.2999' }),
    ).rejects.toThrow('Дата рождения не может быть в будущем')
  })

  test('требует дату рождения', async () => {
    await expect(profileSchema.validateAt('birthDate', { birthDate: '' })).rejects.toThrow(
      'Укажите дату рождения',
    )
  })
})
