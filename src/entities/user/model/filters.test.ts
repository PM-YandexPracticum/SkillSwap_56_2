import { countActiveFilters, DEFAULT_FILTERS, isFiltersActive } from './filters'

describe('фильтры каталога', () => {
  test('по умолчанию фильтры не активны', () => {
    expect(isFiltersActive(DEFAULT_FILTERS)).toBe(false)
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0)
  })

  test('каждый выбранный навык и город считается отдельно', () => {
    const filters = {
      ...DEFAULT_FILTERS,
      skills: ['english', 'guitar'],
      cities: ['moscow'],
    }

    expect(countActiveFilters(filters)).toBe(3)
    expect(isFiltersActive(filters)).toBe(true)
  })

  test('тип и пол добавляют по одному активному фильтру', () => {
    const filters = { ...DEFAULT_FILTERS, type: 'learn' as const, gender: 'male' as const }

    expect(countActiveFilters(filters)).toBe(2)
    expect(isFiltersActive(filters)).toBe(true)
  })

  test('фильтр активен, если выбран только город', () => {
    expect(isFiltersActive({ ...DEFAULT_FILTERS, cities: ['kazan'] })).toBe(true)
  })
})
