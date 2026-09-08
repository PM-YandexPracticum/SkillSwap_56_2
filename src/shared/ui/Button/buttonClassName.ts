import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonSize = 'md' | 'lg'

export interface ButtonAppearance {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}

/** Общая сборка классов для Button и ButtonLink — внешность одна, семантика разная */
export const getButtonClassName = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}: ButtonAppearance) =>
  [styles.button, styles[variant], styles[size], fullWidth ? styles.fullWidth : '', className]
    .filter(Boolean)
    .join(' ')
