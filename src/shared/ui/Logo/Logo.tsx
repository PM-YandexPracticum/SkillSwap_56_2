import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'

import logoIcon from './logo.svg'
import styles from './Logo.module.css'

interface LogoProps {
  className?: string
}

export const Logo = ({ className = '' }: LogoProps) => {
  const logoClassName = [styles.logo, className].filter(Boolean).join(' ')

  return (
    <Link
      to={ROUTES.HOME}
      className={logoClassName}
      aria-label="SkillSwap — на главную"
    >
      <img className={styles.icon} src={logoIcon} alt="" aria-hidden="true" />
      <span className={styles.text}>SkillSwap</span>
    </Link>
  )
}
