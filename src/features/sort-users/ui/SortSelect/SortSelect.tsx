import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import ChevronDownIcon from '@/shared/ui/icons/assets/chevron-down.svg?react'
import SortIcon from '@/shared/ui/icons/assets/sort.svg?react'

import { SORT_OPTIONS, type SortOption } from '../../model/types'

import styles from './SortSelect.module.css'

export interface SortSelectProps {
  value: SortOption
  onChange: (option: SortOption) => void
}

export const SortSelect = ({ value, onChange }: SortSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const currentLabel = SORT_OPTIONS.find((option) => option.value === value)?.label

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.button}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <SortIcon className={styles.icon} aria-hidden="true" />
        <span>{currentLabel}</span>
        <ChevronDownIcon
          className={clsx(styles.arrow, isOpen && styles.arrowOpen)}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {SORT_OPTIONS.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              className={clsx(styles.option, value === option.value && styles.optionActive)}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
