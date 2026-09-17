import { forwardRef, useState, type ReactNode } from 'react'

import { ArrowButton } from '../ArrowButton'
import { Checkbox } from '../Checkbox'
import { Spinner } from '@/shared/ui/Spinner'
import type { FilterItem } from './types'
import styles from './FilterList.module.css'

export interface FilterListProps {
  /** Заголовок блока: «Навыки», «Город» */
  title: string
  items: FilterItem[]
  /** Выбранные пункты — всегда идентификаторы листьев, не родителей */
  value: string[]
  onChange: (next: string[]) => void
  onBlur?: () => void
  /** Общее имя чекбоксов — нужно, когда список живёт внутри формы */
  name?: string
  /** Сколько пунктов показывать до раскрытия. Прятать нечего — кнопки не будет */
  visibleCount?: number
  /** Подпись раскрывающей кнопки: «Все города», «Все категории» */
  showAllLabel?: string
  /** Короткое сообщение под заголовком: загрузка, ошибка */
  status?: string
  className?: string
}

/** У листа нет детей, поэтому он представляет сам себя */
const getLeafIds = (item: FilterItem): string[] =>
  item.children?.length ? item.children.map((child) => child.id) : [item.id]

const getCheckState = (leafIds: string[], selected: Set<string>) => {
  const count = leafIds.filter((id) => selected.has(id)).length

  return {
    checked: count > 0 && count === leafIds.length,
    indeterminate: count > 0 && count < leafIds.length,
  }
}

/** Раскрытие через grid-template-rows: высота анимируется без замера содержимого */
const Collapsible = ({ isOpen, children }: { isOpen: boolean; children: ReactNode }) => (
  <div
    className={[styles.collapsible, isOpen && styles.collapsibleOpen].filter(Boolean).join(' ')}
    aria-hidden={!isOpen}
  >
    <div className={styles.collapsibleInner}>{children}</div>
  </div>
)

export const FilterList = forwardRef<HTMLInputElement, FilterListProps>(
  (
    {
      title,
      items,
      value,
      onChange,
      onBlur,
      name,
      visibleCount = items.length,
      showAllLabel,
      status,
      className,
    },
    ref,
  ) => {
    const [showAll, setShowAll] = useState(false)
    const [expandedIds, setExpandedIds] = useState<string[]>([])

    const selected = new Set(value)
    const visibleItems = items.slice(0, visibleCount)
    const hiddenItems = items.slice(visibleCount)

    const toggleExpanded = (itemId: string) => {
      setExpandedIds((prev) =>
        prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
      )
    }

    /** Клик по родителю выбирает или снимает сразу все его листья */
    const toggleItem = (item: FilterItem) => {
      const leafIds = getLeafIds(item)
      const { checked } = getCheckState(leafIds, selected)
      const next = new Set(selected)

      leafIds.forEach((id) => (checked ? next.delete(id) : next.add(id)))
      onChange([...next])
    }

    const renderItem = (item: FilterItem, isHidden: boolean, isFirst: boolean) => {
      const children = item.children ?? []
      const isExpanded = expandedIds.includes(item.id)
      const { checked, indeterminate } = getCheckState(getLeafIds(item), selected)
      // Свёрнутый пункт остаётся в разметке ради анимации, но убирается из таб-порядка
      const itemTabIndex = isHidden ? -1 : 0

      return (
        <li key={item.id} className={styles.item}>
          <div className={styles.row}>
            <Checkbox
              ref={isFirst ? ref : undefined}
              className={styles.checkbox}
              name={name}
              value={item.id}
              label={item.title}
              checked={checked}
              indeterminate={indeterminate}
              onChange={() => toggleItem(item)}
              onBlur={onBlur}
              tabIndex={itemTabIndex}
            />

            {children.length > 0 && (
              <ArrowButton
                variant="ghost"
                className={styles.arrow}
                isOpen={isExpanded}
                onClick={() => toggleExpanded(item.id)}
                aria-label={`${isExpanded ? 'Свернуть' : 'Развернуть'} «${item.title}»`}
                tabIndex={itemTabIndex}
              />
            )}
          </div>

          {children.length > 0 && (
            <Collapsible isOpen={isExpanded}>
              <ul className={[styles.list, styles.nestedList].join(' ')}>
                {children.map((child) => (
                  <li key={child.id}>
                    <Checkbox
                      name={name}
                      value={child.id}
                      label={child.title}
                      level={1}
                      checked={selected.has(child.id)}
                      onChange={() => toggleItem(child)}
                      onBlur={onBlur}
                      tabIndex={isHidden || !isExpanded ? -1 : 0}
                    />
                  </li>
                ))}
              </ul>
            </Collapsible>
          )}
        </li>
      )
    }

    return (
      <div className={[styles.root, className].filter(Boolean).join(' ')}>
        <h3 className={styles.title}>{title}</h3>

        {status && (
          <div className={styles.status} role="status">
            {status === 'Загрузка…' ? <Spinner size="sm" /> : status}
          </div>
        )}

        <ul className={styles.list}>
          {visibleItems.map((item, index) => renderItem(item, false, index === 0))}
        </ul>

        {hiddenItems.length > 0 && (
          <>
            <Collapsible isOpen={showAll}>
              <ul className={[styles.list, styles.hiddenList].join(' ')}>
                {hiddenItems.map((item) => renderItem(item, !showAll, false))}
              </ul>
            </Collapsible>

            <ArrowButton
              variant="ghost"
              className={styles.showAll}
              isOpen={showAll}
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAllLabel}
            </ArrowButton>
          </>
        )}
      </div>
    )
  },
)

FilterList.displayName = 'FilterList'
