import { RadioGroup } from '@/shared/ui/RadioGroup'
import { ListSkillsFilter } from '@/features/skills-filter'
import { ListCitiesFilter } from '@/features/cities-filter'

import type { CatalogFilters, CatalogFilterType, CatalogFilterGender } from './types'
import styles from './FiltersBar.module.css'

/** Опции первого блока (без заголовка) */
const TYPE_OPTIONS = [
  { value: 'all', title: 'Всё' },
  { value: 'learn', title: 'Хочу научиться' },
  { value: 'teach', title: 'Могу научить' },
]

/** Опции блока «Пол автора» */
const GENDER_OPTIONS = [
  { value: 'any', title: 'Не имеет значения' },
  { value: 'male', title: 'Мужской' },
  { value: 'female', title: 'Женский' },
]

export interface FiltersBarProps {
  filters: CatalogFilters
  onChange: (next: CatalogFilters) => void
  className?: string
}

/**
 * Панель фильтров каталога.
 * Состоянием не владеет — принимает `filters` и `onChange` сверху.
 * Порядок блоков — как в макете.
 */
export const FiltersBar = ({ filters, onChange, className }: FiltersBarProps) => {
  const rootClassName = [styles.root, className].filter(Boolean).join(' ')

  return (
    <aside className={rootClassName}>
      {/* 1. RadioGroup без заголовка — выбор типа */}
      <RadioGroup
        name="catalog-type"
        options={TYPE_OPTIONS}
        selectedOptionValue={filters.type}
        onChange={(e) =>
          onChange({ ...filters, type: e.target.value as CatalogFilterType })
        }
      />

      {/* 2. Список навыков */}
      <ListSkillsFilter
        value={filters.skills}
        onChange={(skills) => onChange({ ...filters, skills })}
      />

      {/* 3. RadioGroup с заголовком — пол автора */}
      <RadioGroup
        name="catalog-gender"
        title="Пол автора"
        options={GENDER_OPTIONS}
        selectedOptionValue={filters.gender}
        onChange={(e) =>
          onChange({ ...filters, gender: e.target.value as CatalogFilterGender })
        }
      />

      {/* 4. Список городов */}
      <ListCitiesFilter
        value={filters.cities}
        onChange={(cities) => onChange({ ...filters, cities })}
      />
    </aside>
  )
}
