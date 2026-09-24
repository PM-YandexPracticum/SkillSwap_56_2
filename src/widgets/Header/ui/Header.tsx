import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { getAuthUser, subscribeAuthUser } from '@/features/auth/model/authUtils'
import type { AuthUser } from '@/shared/types'
import { SkillsMenu } from '@/features/skills-menu'
import { ROUTES } from '@/shared/lib/constants'
import { ButtonLink } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import LikeIcon from '@/shared/ui/icons/assets/like.svg?react'
import MoonIcon from '@/shared/ui/icons/assets/moon.svg?react'
import NotificationIcon from '@/shared/ui/icons/assets/notification.svg?react'
import SearchIcon from '@/shared/ui/icons/assets/search.svg?react'
import { Logo } from '@/shared/ui/Logo'
import { RoundImage } from '@/shared/ui/RoundImage'

import styles from './Header.module.css'

interface HeaderProps {
  isAuth?: boolean
  user?: Pick<AuthUser, 'name' | 'avatarUrl'>
}

export const Header = ({ isAuth, user }: HeaderProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [authUser, setAuthUser] = useState(getAuthUser)

  useEffect(() => subscribeAuthUser(() => setAuthUser(getAuthUser())), [])

  const currentUser = user ?? authUser
  const isAuthenticated = isAuth ?? Boolean(currentUser)
  const userName = currentUser?.name ?? 'Профиль'
  const searchQuery = new URLSearchParams(location.search).get('search') ?? ''

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams()

    if (value) {
      params.set('search', value)
    }

    const search = params.toString()

    navigate(
      {
        pathname: ROUTES.HOME,
        search: search ? `?${search}` : '',
      },
      { replace: true },
    )
  }

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Logo className={styles.logo} />

        <nav className={styles.nav} aria-label="Основная навигация">
          <Link to={`${ROUTES.HOME}#about`} className={styles.navLink}>
            О проекте
          </Link>
          <SkillsMenu />
        </nav>

        <form className={styles.search} role="search" onSubmit={(event) => event.preventDefault()}>
          <SearchIcon className={styles.searchIcon} aria-hidden="true" />
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Искать навык"
            aria-label="Искать навык"
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </form>

        {isAuthenticated ? (
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
              <RoundImage src={currentUser?.avatarUrl} alt={userName} size="md" />
            </Link>
          </div>
        ) : (
          <div className={styles.guestActions}>
            <button className={styles.iconButton} type="button" aria-label="Переключить тему">
              <MoonIcon aria-hidden="true" />
            </button>
            <div className={styles.buttonGroup}>
              <ButtonLink to={ROUTES.LOGIN} className={styles.loginButton} variant="secondary">
                Войти
              </ButtonLink>
              <ButtonLink to={ROUTES.REGISTER} className={styles.registerButton}>
                Зарегистрироваться
              </ButtonLink>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
