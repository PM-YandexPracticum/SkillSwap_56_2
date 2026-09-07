import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'
import { Logo } from '@/shared/ui/Logo'

import styles from './Footer.module.css'

const FOOTER_COLUMNS = [
  [
    { label: 'О проекте', to: '/about' },
    { label: 'Все навыки', to: ROUTES.HOME },
  ],
  [
    { label: 'Контакты', to: '/contacts' },
    { label: 'Блог', to: '/blog' },
  ],
  [
    { label: 'Политика конфиденциальности', to: '/privacy' },
    { label: 'Пользовательское соглашение', to: '/terms' },
  ],
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.copyright}>SkillSwap — 2025</p>
        </div>

        <nav className={styles.links} aria-label="Разделы сайта">
          {FOOTER_COLUMNS.map((column) => (
            <ul key={column[0].label} className={styles.column}>
              {column.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className={styles.link}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </nav>
      </div>
    </footer>
  )
}
