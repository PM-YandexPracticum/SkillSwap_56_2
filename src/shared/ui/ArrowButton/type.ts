import type { ReactNode } from 'react'

import type { ButtonProps } from '../Button'

export type ArrowButtonProps = Omit<ButtonProps, 'rightIcon' | 'children'> & {
  /** Раскрыт ли связанный список — компонент только рисует стрелку, состоянием владеет родитель */
  isOpen: boolean
  /** Необязателен: кнопка может состоять из одной иконки (тогда нужен aria-label) */
  children?: ReactNode
}
