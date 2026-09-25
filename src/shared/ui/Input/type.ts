import type { ChangeEvent, ReactNode, InputHTMLAttributes } from 'react'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Нативный onChange — принимает событие. Совместим с react-hook-form. */
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  /** Удобный колбэк — получает только строку. Для ручного использования. */
  onValueChange?: (value: string) => void
  /** Элемент справа от инпута (иконка, кнопка) */
  rightElement?: ReactNode
  /** Элемент слева от инпута (иконка, кнопка) */
  leftElement?: ReactNode
  /** Подпись поля: email, пароль */
  label?: string
  /** Текст ошибки: неверный email, пароль */
  error?: string
  /** Вспомогательный текст: введите email, введите пароль */
  helperText?: string
  /** Многострочный инпут */
  multiline?: boolean
  /** Количество строк для многострочного инпута */
  rows?: number
  /** Высота текстовой зоны (для многострочного инпута) */
  heightTextarea?: string
}