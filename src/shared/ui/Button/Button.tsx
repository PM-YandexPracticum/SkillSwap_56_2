import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
type ButtonSize = 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const buttonClassName = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button ref={ref} type={type} className={buttonClassName} {...props}>
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </button>
    )
  },
)

Button.displayName = 'Button'
