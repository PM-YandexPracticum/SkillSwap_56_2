import { NavLink } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'
import ideaIcon from '@/shared/ui/icons/assets/idea.svg?react'
import likeIcon from '@/shared/ui/icons/assets/like-outline.svg?react'
import messageIcon from '@/shared/ui/icons/assets/message-text.svg?react'
import requestIcon from '@/shared/ui/icons/assets/request.svg?react'
import userIcon from '@/shared/ui/icons/assets/user.svg?react'

import styles from './ProfileSidebar.module.css'

const menuItems = [
  { to: ROUTES.PROFILE_REQUESTS, icon: requestIcon, label: 'Заявки' },
  { to: ROUTES.PROFILE_EXCHANGES, icon: messageIcon, label: 'Мои обмены' },
  { to: ROUTES.PROFILE_FAVORITES, icon: likeIcon, label: 'Избранное' },
  { to: ROUTES.PROFILE_SKILLS, icon: ideaIcon, label: 'Мои навыки' },
  { to: ROUTES.PROFILE_PERSONAL, icon: userIcon, label: 'Личные данные' },
]

export const ProfileSidebar = () => {
  return (
    <nav className={styles.sidebar} aria-label="Навигация по личному кабинету">
      <ul className={styles.list}>
        {menuItems.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive ? `${styles.item} ${styles.itemActive}` : styles.item
              }
            >
              <Icon className={styles.icon} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
