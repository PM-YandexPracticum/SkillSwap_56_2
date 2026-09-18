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
