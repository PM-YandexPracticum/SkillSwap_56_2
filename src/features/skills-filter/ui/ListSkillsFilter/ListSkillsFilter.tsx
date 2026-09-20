import { forwardRef, useMemo } from 'react'

import { useSkillCategories } from '@/entities/skill'
import { FilterList, type FilterFieldProps, type FilterItem } from '@/shared/ui/FilterList'

export type ListSkillsFilterProps = FilterFieldProps & {
  /** Сколько категорий показывать до раскрытия */
  visibleCount?: number
}

export const ListSkillsFilter = forwardRef<HTMLInputElement, ListSkillsFilterProps>(
  ({ visibleCount, ...field }, ref) => {
    const { categories, status } = useSkillCategories()

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
