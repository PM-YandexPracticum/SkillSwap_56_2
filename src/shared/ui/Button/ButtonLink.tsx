import { forwardRef, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
type ButtonSize = 'md' | 'lg'

interface ButtonLinkProps extends LinkProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

/** Ссылка с внешностью кнопки: навигация должна оставаться <a>, а не <button> внутри <a> */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
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
      <Link ref={ref} className={buttonClassName} {...props}>
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </Link>
    )
  },
)

ButtonLink.displayName = 'ButtonLink'
