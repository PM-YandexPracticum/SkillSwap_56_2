import type { ReactNode } from 'react'

import styles from './Container.module.css'

export type ContainerPadding = 'default' | 'auth' | 'error'

interface ContainerProps {
  children: ReactNode
  padding?: ContainerPadding
  className?: string
}

export const Container = ({ children, padding = 'default', className = '' }: ContainerProps) => {
  const containerClassName = [styles.container, styles[padding], className]
    .filter(Boolean)
    .join(' ')

  return <div className={containerClassName}>{children}</div>
}
