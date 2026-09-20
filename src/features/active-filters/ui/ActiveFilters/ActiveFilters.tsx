import { useMemo } from 'react'

import { useCities } from '@/entities/city'
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  FILTER_GENDER_LABELS,
  FILTER_TYPE_LABELS,
  isFiltersActive,
  type CatalogFilters,
} from '@/entities/user'
import { useSkillCategories } from '@/entities/skill'
import CrossIcon from '@/shared/ui/icons/assets/cross.svg?react'

import { FilterChip } from '../FilterChip/FilterChip'

import styles from './ActiveFilters.module.css'

export interface ActiveFiltersProps {
  filters: CatalogFilters
  onChange: (next: CatalogFilters) => void
}

type ActiveFiltersContentProps = ActiveFiltersProps

const ActiveFiltersContent = ({ filters, onChange }: ActiveFiltersContentProps) => {
  const { cities } = useCities()
  const { categories } = useSkillCategories()

  const skillTitles = useMemo(() => {
    const map = new Map<string, string>()
    categories.forEach((category) => {
      category.skills.forEach((skill) => map.set(skill.id, skill.title))
    })
    return map
  }, [categories])

  const cityTitles = useMemo(() => {
    const map = new Map<string, string>()
    cities.forEach((city) => map.set(city.id, city.title))
    return map
  }, [cities])

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Фильтры ({countActiveFilters(filters)})</h2>

        <button type="button" className={styles.reset} onClick={() => onChange(DEFAULT_FILTERS)}>
          Сбросить
          <CrossIcon className={styles.resetIcon} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.chips}>
        {filters.type !== DEFAULT_FILTERS.type && (
          <FilterChip
            label={FILTER_TYPE_LABELS[filters.type]}
            removeLabel="Убрать фильтр по типу"
            onRemove={() => onChange({ ...filters, type: DEFAULT_FILTERS.type })}
          />
        )}

        {filters.gender !== DEFAULT_FILTERS.gender && (
          <FilterChip
            label={FILTER_GENDER_LABELS[filters.gender]}
            removeLabel="Убрать фильтр по полу"
            onRemove={() => onChange({ ...filters, gender: DEFAULT_FILTERS.gender })}
          />
        )}

        {filters.skills.map((skillId) => (
          <FilterChip
            key={skillId}
            label={skillTitles.get(skillId) ?? skillId}
            removeLabel="Убрать навык из фильтра"
            onRemove={() =>
              onChange({
                ...filters,
                skills: filters.skills.filter((id) => id !== skillId),
              })
            }
          />
        ))}

        {filters.cities.map((cityId) => (
          <FilterChip
            key={cityId}
            label={cityTitles.get(cityId) ?? cityId}
            removeLabel="Убрать город из фильтра"
            onRemove={() =>
              onChange({
                ...filters,
                cities: filters.cities.filter((id) => id !== cityId),
              })
            }
          />
        ))}
      </div>
    </div>
  )
}

export const ActiveFilters = (props: ActiveFiltersProps) =>
  isFiltersActive(props.filters) ? <ActiveFiltersContent {...props} /> : null
