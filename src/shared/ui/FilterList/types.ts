export interface FilterItem {
  id: string
  title: string
  /** Вложенные пункты. Выбор хранится только идентификаторами листьев */
  children?: FilterItem[]
}

/** Общий контракт доменных фильтров — ListCitiesFilter, ListSkillsFilter и т.д. */
export interface FilterFieldProps {
  /** Выбранные пункты — идентификаторы листьев */
  value: string[]
  onChange: (next: string[]) => void
  onBlur?: () => void
  name?: string
  className?: string
}
