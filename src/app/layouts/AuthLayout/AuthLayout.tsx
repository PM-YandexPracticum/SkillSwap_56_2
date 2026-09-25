import { Link, Outlet } from 'react-router-dom'

import { InfoCard, type InfoCardProps } from '@/shared/ui/InfoCard'
import { Logo } from '@/shared/ui/Logo'
import { Stepper } from '@/shared/ui/Stepper'
import CrossIcon from '@/shared/ui/icons/assets/cross.svg?react'

import styles from './AuthLayout.module.css'

export interface AuthLayoutProps {
  current?: number
  total?: number
  title?: string
  info: InfoCardProps
  onClose?: () => void
}

export const AuthLayout = ({ current, total, title, info, onClose }: AuthLayoutProps) => (
  <div className={styles.page}>
    <header className={styles.header}>
      <Logo />

      <Link
        className={styles.closeLink}
        to="/"
        onClick={onClose}
        aria-label="Закрыть и перейти на главную"
      >
        <span>Закрыть</span>
        <CrossIcon className={styles.closeIcon} aria-hidden="true" />
      </Link>
    </header>

    <div className={styles.content}>
      {current !== undefined && total !== undefined && <Stepper current={current} total={total} />}

      {title && <h1 className={styles.title}>{title}</h1>}

      <section className={styles.cards}>
        <div className={styles.formCard} aria-label="Форма авторизации">
          <Outlet />
        </div>

        <InfoCard {...info} />
      </section>
    </div>
  </div>
)
