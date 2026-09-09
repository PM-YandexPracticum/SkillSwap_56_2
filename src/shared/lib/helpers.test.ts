import { getAge, plural } from './helpers'

describe('plural', () => {
  const forms: [string, string, string] = ['год', 'года', 'лет']

  test.each([
    [1, 'год'],
    [2, 'года'],
    [5, 'лет'],
    [11, 'лет'],
    [21, 'год'],
    [24, 'года'],
    [111, 'лет'],
  ])('возвращает форму для %i', (count, expected) => {
    expect(plural(count, forms)).toBe(expected)
  })
})

describe('getAge', () => {
  const currentDate = new Date(2024, 5, 15)

  test('возвращает возраст, если день рождения уже был в текущем году', () => {
    expect(getAge('2000-06-15', currentDate)).toBe(24)
  })

  test('возвращает возраст, если день рождения еще не был в текущем году', () => {
    expect(getAge('2000-06-16', currentDate)).toBe(23)
  })

  test('возвращает null для невалидной даты', () => {
    expect(getAge('not-a-date', currentDate)).toBeNull()
  })

  test('возвращает null для будущей даты', () => {
    expect(getAge('2024-06-16', currentDate)).toBeNull()
  })
})
