import { useEffect, useRef } from 'react'
import type { ComponentPropsWithoutRef, CSSProperties } from 'react'
import styles from './Checkbox.module.css'

type NativeInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'children'>

export interface CheckboxProps extends NativeInputProps {
  /** Текст рядом с чекбоксом */
  label: string
  /** Промежуточное состояние: отмечена только часть вложенных пунктов */
  indeterminate?: boolean
  /** Уровень вложенности — сдвигает пункт вправо */
  level?: number
}

export function Checkbox({
  label,
  indeterminate = false,
  level = 0,
  disabled,
  className,
  ...inputProps
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // indeterminate нельзя задать атрибутом в разметке — это свойство DOM-элемента,
  // поэтому выставляем его вручную после каждого рендера
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const rootClassName = [styles.root, disabled && styles.disabled, className]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={rootClassName} style={{ '--checkbox-level': level } as CSSProperties}>
      <input
        {...inputProps}
        ref={inputRef}
        type="checkbox"
        disabled={disabled}
        className={styles.input}
      />
      <span className={styles.box} aria-hidden="true" />
      <span className={styles.text}>{label}</span>
    </label>
  )
}
