import { forwardRef } from 'react'

import { useCities } from '@/entities/city'
import { FilterList, type FilterFieldProps } from '@/shared/ui/FilterList'

export type ListCitiesFilterProps = FilterFieldProps

const VISIBLE_CITIES_COUNT = 5

export const ListCitiesFilter = forwardRef<HTMLInputElement, ListCitiesFilterProps>(
  (field, ref) => {
    const { cities, status } = useCities()

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
