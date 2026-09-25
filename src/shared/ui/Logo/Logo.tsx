import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'

import LogoIcon from '../icons/assets/logo.svg?react'

import styles from './Logo.module.css'

interface LogoProps {
  className?: string
}

export const Logo = ({ className = '' }: LogoProps) => {
  const logoClassName = [styles.logo, className].filter(Boolean).join(' ')

  return (
    <Link to={ROUTES.HOME} className={logoClassName} aria-label="SkillSwap — на главную">
      <LogoIcon className={styles.icon} aria-hidden="true" />
      <span className={styles.text}>SkillSwap</span>
    </Link>
  )
}
