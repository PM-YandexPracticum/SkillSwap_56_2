import { useCallback, useEffect, useMemo, useState } from 'react'

import { ArrowButton } from '@/shared/ui/ArrowButton'
import { Checkbox } from '@/shared/ui/Checkbox'

import styles from './ListSkillsFilter.module.css'

export interface SkillCategory {
  id: string
  title: string
  skills: string[]
}

export interface ListSkillsFilterProps {
  categories?: SkillCategory[]
  value?: string[]
  onChange?: (next: string[]) => void
  initialVisibleCount?: number
  className?: string
}

function getCategoryCheckState(skills: string[], selected: Set<string>) {
  const total = skills.length
  if (total === 0) return { checked: false, indeterminate: false }

  let count = 0
  for (const skill of skills) {
    if (selected.has(skill)) count += 1
  }

  return {
    checked: count === total,
    indeterminate: count > 0 && count < total,
  }
}

export const ListSkillsFilter = ({
  categories: externalCategories,
  value,
  onChange,
  initialVisibleCount = 6,
  className,
}: ListSkillsFilterProps) => {
  const [categories, setCategories] = useState<SkillCategory[]>(
    externalCategories || [],
  )

  useEffect(() => {
    if (!externalCategories || externalCategories.length === 0) {
      fetch('/db/skills.json')
        .then((res) => res.json())
        .then((data: SkillCategory[]) => setCategories(data))
        .catch((err) => console.error('Ошибка загрузки skills.json:', err))
    }
  }, [externalCategories])

  const [internalSelected, setInternalSelected] = useState<string[]>([])
  const selectedList = value ?? internalSelected
  const selectedSet = useMemo(() => new Set(selectedList), [selectedList])

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())

  const [showAll, setShowAll] = useState(false)

  const commit = useCallback(
    (next: string[]) => {
      if (value === undefined) setInternalSelected(next)
      onChange?.(next)
    },
    [onChange, value],
  )

  const visibleCategories = showAll
    ? categories
    : categories.slice(0, initialVisibleCount)

  const toggleExpanded = (categoryId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }

  const expandCategory = (categoryId: string) => {
    setExpandedIds((prev) => {
      if (prev.has(categoryId)) return prev
      const next = new Set(prev)
      next.add(categoryId)
      return next
    })
  }

  const handleToggleAllCategories = () => {
    setShowAll((prevShowAll) => {
      const nextShowAll = !prevShowAll

      if (nextShowAll) {
        const allIds = new Set(categories.map((c) => c.id))
        setExpandedIds(allIds)
      } else {
        setExpandedIds(new Set())
      }

      return nextShowAll
    })
  }

  const handleCategoryCheckbox = (category: SkillCategory) => {
    const { checked } = getCategoryCheckState(category.skills, selectedSet)
    const next = new Set(selectedSet)

    if (checked) {
      category.skills.forEach((s) => next.delete(s))
    } else {
      category.skills.forEach((s) => next.add(s))
    }

    expandCategory(category.id)
    commit([...next])
  }

  const handleSkillCheckbox = (skill: string, categoryId: string) => {
    const next = new Set(selectedSet)
    if (next.has(skill)) next.delete(skill)
    else next.add(skill)

    expandCategory(categoryId)
    commit([...next])
  }

  const rootClassName = [styles.root, className].filter(Boolean).join(' ')

  return (
    <div className={rootClassName}>
      <h3 className={styles.title}>Навыки</h3>

      <ul className={styles.list}>
        {visibleCategories.map((category) => {
          const isOpen = expandedIds.has(category.id)
          const { checked, indeterminate } = getCategoryCheckState(
            category.skills,
            selectedSet,
          )

          return (
            <li key={category.id} className={styles.categoryItem}>
              <div className={styles.categoryRow}>
                <div className={styles.categoryCheckbox}>
                  <Checkbox
                    label={category.title}
                    checked={checked}
                    indeterminate={indeterminate}
                    onChange={() => handleCategoryCheckbox(category)}
                  />
                </div>

                <ArrowButton
                  isOpen={isOpen}
                  onClick={() => toggleExpanded(category.id)}
                  aria-label={
                    isOpen
                      ? `Свернуть «${category.title}»`
                      : `Развернуть «${category.title}»`
                  }
                  className={styles.categoryArrow}
                />
              </div>

              {isOpen && category.skills.length > 0 && (
                <ul className={styles.skillsList}>
                  {category.skills.map((skill) => (
                    <li key={skill} className={styles.skillItem}>
                      <Checkbox
                        label={skill}
                        level={1}
                        checked={selectedSet.has(skill)}
                        onChange={() =>
                          handleSkillCheckbox(skill, category.id)
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      <ArrowButton
        isOpen={showAll}
        onClick={handleToggleAllCategories}
        className={styles.allCategoriesBtn}
      >
        Все категории
      </ArrowButton>
    </div>
  )
}
