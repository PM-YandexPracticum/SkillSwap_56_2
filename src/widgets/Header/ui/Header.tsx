import { Link } from 'react-router-dom'

import type { User } from '@/entities/user/model/types'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/Button'
import ChevronDownIcon from '@/shared/ui/icons/assets/chevron-down.svg?react'
import LikeIcon from '@/shared/ui/icons/assets/like.svg?react'
import MoonIcon from '@/shared/ui/icons/assets/moon.svg?react'
import NotificationIcon from '@/shared/ui/icons/assets/notification.svg?react'
import SearchIcon from '@/shared/ui/icons/assets/search.svg?react'
import { Logo } from '@/shared/ui/Logo'
import { RoundImage } from '@/shared/ui/RoundImage'

import styles from './Header.module.css'

interface HeaderProps {
  isAuth?: boolean
  user?: User
}

export const Header = ({ isAuth = false, user }: HeaderProps) => {
  const userName = user?.name ?? 'Профиль'

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo className={styles.logo} />

        <nav className={styles.nav} aria-label="Основная навигация">
          <Link to={`${ROUTES.HOME}#about`} className={styles.navLink}>
            О проекте
          </Link>
          <Link to={ROUTES.HOME} className={styles.navLink}>
            <span>Все навыки</span>
            <ChevronDownIcon className={styles.navIcon} aria-hidden="true" />
          </Link>
        </nav>

        <form className={styles.search} role="search">
          <SearchIcon className={styles.searchIcon} aria-hidden="true" />
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Искать навык"
            aria-label="Искать навык"
          />
        </form>

        {isAuth ? (
          <div className={styles.authActions}>
            <div className={styles.iconGroup}>
              <button className={styles.iconButton} type="button" aria-label="Переключить тему">
                <MoonIcon aria-hidden="true" />
              </button>
              <Link className={styles.iconLink} to={ROUTES.HOME} aria-label="Уведомления">
                <NotificationIcon aria-hidden="true" />
              </Link>
              <Link className={styles.iconLink} to={ROUTES.FAVORITES} aria-label="Избранное">
                <LikeIcon aria-hidden="true" />
              </Link>
            </div>
            <Link className={styles.profileLink} to={ROUTES.PROFILE}>
              <span className={styles.userName}>{userName}</span>
              <RoundImage src={user?.avatarUrl} alt={userName} size="md" />
            </Link>
          </div>
        ) : (
          <div className={styles.guestActions}>
            <button className={styles.iconButton} type="button" aria-label="Переключить тему">
              <MoonIcon aria-hidden="true" />
            </button>
            <div className={styles.buttonGroup}>
              <Link to={ROUTES.LOGIN} className={styles.buttonLink}>
                <Button className={styles.loginButton} variant="secondary">
                  Войти
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER} className={styles.buttonLink}>
                <Button className={styles.registerButton}>Зарегистрироваться</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
