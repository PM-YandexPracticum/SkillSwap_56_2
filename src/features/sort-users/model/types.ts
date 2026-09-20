export type SortOption = 'newest' | 'popular'

export interface SortOptionItem {
  value: SortOption
  label: string
}

export const DEFAULT_SORT: SortOption = 'newest'

export const SORT_OPTIONS: SortOptionItem[] = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'popular', label: 'По популярности' },
]
