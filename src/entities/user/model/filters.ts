import type { UserGender } from '@/shared/types'

export type CatalogFilterType = 'all' | 'learn' | 'teach'
export type CatalogFilterGender = 'any' | UserGender

export interface CatalogFilters {
  /** Тип: всё / хочу научиться / могу научить */
  type: CatalogFilterType
  /** Выбранные id навыков (листья дерева категорий) */
  skills: string[]
  /** Пол автора */
  gender: CatalogFilterGender
  /** Выбранные id городов */
  cities: string[]
}

export const DEFAULT_FILTERS: CatalogFilters = {
  type: 'all',
  skills: [],
  gender: 'any',
  cities: [],
}

export const FILTER_TYPE_LABELS: Record<CatalogFilterType, string> = {
  all: 'Всё',
  learn: 'Хочу научиться',
  teach: 'Могу научить',
}

export const FILTER_GENDER_LABELS: Record<CatalogFilterGender, string> = {
  any: 'Не имеет значения',
  male: 'Мужской',
  female: 'Женский',
}

/** Сколько фильтров отличается от значений по умолчанию */
export const countActiveFilters = (filters: CatalogFilters): number => {
  let count = filters.skills.length + filters.cities.length

  if (filters.type !== DEFAULT_FILTERS.type) count += 1
  if (filters.gender !== DEFAULT_FILTERS.gender) count += 1

  return count
}

export const isFiltersActive = (filters: CatalogFilters): boolean => countActiveFilters(filters) > 0
