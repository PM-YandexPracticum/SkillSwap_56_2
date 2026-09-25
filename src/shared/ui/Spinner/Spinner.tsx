import styles from './Spinner.module.css'

export interface SpinnerProps {
  /** Размер: 'sm' | 'md' | 'lg' (по умолчанию 'md') */
  size?: 'sm' | 'md' | 'lg'
  /** Растянуть на весь экран (для загрузки страниц) */
  fullPage?: boolean
  className?: string
}

export const Spinner = ({ size = 'md', fullPage = false, className }: SpinnerProps) => {
  const containerClassName = [styles.container, fullPage ? styles.fullPage : '', className]
    .filter(Boolean)
    .join(' ')

  const spinnerClassName = [styles.spinner, styles[size]].filter(Boolean).join(' ')

  return (
    <div className={containerClassName} role="status" aria-label="Загрузка...">
      <div className={spinnerClassName} />
    </div>
  )
}
