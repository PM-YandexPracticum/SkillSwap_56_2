import { forwardRef } from 'react'

import { useCities } from '../../model/useCities'
import { FilterList, type FilterFieldProps } from '@/shared/ui/FilterList'
import type { City } from '@/shared/types'

export type ListCitiesFilterProps = FilterFieldProps & {
  /** Готовый список — без него фильтр загрузит города сам */
  items?: City[]
}

const VISIBLE_CITIES_COUNT = 5

export const ListCitiesFilter = forwardRef<HTMLInputElement, ListCitiesFilterProps>(
  ({ items, ...field }, ref) => {
    const { cities, status } = useCities(items)

    return (
      <FilterList
        ref={ref}
        title="Город"
        items={cities}
        visibleCount={VISIBLE_CITIES_COUNT}
        showAllLabel="Все города"
        status={status}
        {...field}
      />
    )
  },
)

ListCitiesFilter.displayName = 'ListCitiesFilter'
