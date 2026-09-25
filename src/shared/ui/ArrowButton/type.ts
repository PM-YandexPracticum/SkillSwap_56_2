import type { ReactNode } from 'react'

import type { ButtonProps } from '../Button'

export type ArrowButtonProps = Omit<ButtonProps, 'rightIcon' | 'children'> & {   // делаем исключения  иконка стрелка толкьо вниз не влево не вправо
  // исключения  в виде children что  внутрки копки может быть текс и прочее а может и не быть
  /** Раскрыт ли связанный список — компонент только рисует стрелку, состоянием владеет родитель */
  isOpen: boolean
  /** Необязателен: кнопка может состоять из одной иконки (тогда нужен aria-label) */
  children?: ReactNode
}
