import { forwardRef, useMemo } from 'react'

import { useSkillCategories } from '../../model/useSkillCategories'
import { FilterList, type FilterFieldProps, type FilterItem } from '@/shared/ui/FilterList'
import type { SkillCategory } from '@/shared/types'

export type ListSkillsFilterProps = FilterFieldProps & {
  /** Готовый список — без него фильтр загрузит категории сам */
  items?: SkillCategory[]
  /** Сколько категорий показывать до раскрытия */
  visibleCount?: number
}

export const ListSkillsFilter = forwardRef<HTMLInputElement, ListSkillsFilterProps>(
  ({ items, visibleCount, ...field }, ref) => {
    const { categories, status } = useSkillCategories(items)

    // Категория — узел дерева, её навыки — листья: выбор хранится их id
    const tree = useMemo<FilterItem[]>(
      () =>
        categories.map((category) => ({
          id: category.id,
          title: category.title,
          children: category.skills,
        })),
      [categories],
    )

    return (
      <FilterList
        ref={ref}
        title="Навыки"
        items={tree}
        visibleCount={visibleCount}
        showAllLabel="Все категории"
        status={status}
        {...field}
      />
    )
  },
)

ListSkillsFilter.displayName = 'ListSkillsFilter'
