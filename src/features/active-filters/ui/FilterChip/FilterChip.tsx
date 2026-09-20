import CrossIcon from '@/shared/ui/icons/assets/cross.svg?react'

import styles from './FilterChip.module.css'

export interface FilterChipProps {
  label: string
  removeLabel: string
  onRemove: () => void
}

export const FilterChip = ({ label, removeLabel, onRemove }: FilterChipProps) => (
  <span className={styles.chip}>
    {label}
    <button type="button" className={styles.remove} aria-label={removeLabel} onClick={onRemove}>
      <CrossIcon className={styles.icon} aria-hidden="true" />
    </button>
  </span>
)
