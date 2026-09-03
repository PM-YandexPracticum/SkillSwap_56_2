import { forwardRef, useCallback, useEffect, useRef } from 'react'
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

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate = false, level = 0, disabled, className, ...inputProps }, ref) => {
    // Свой ref нужен всегда: через него ставится indeterminate.
    // Тип с | null — чтобы current можно было присваивать вручную
    const inputRef = useRef<HTMLInputElement | null>(null)

    // Один узел, два потребителя: наш inputRef и ref, переданный снаружи.
    // React отдаёт узел только одному ref-атрибуту, поэтому раздаём его сами
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node

        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref],
    )

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
          ref={setRefs}
          type="checkbox"
          disabled={disabled}
          className={styles.input}
        />
        <span className={styles.box} aria-hidden="true" />
        <span className={styles.text}>{label}</span>
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
