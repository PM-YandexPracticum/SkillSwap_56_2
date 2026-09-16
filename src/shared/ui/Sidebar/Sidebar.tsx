import { ROUTES } from '@/shared/lib/constants';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'

import requestIcon from '@/shared/ui/icons/assets/request.svg'
import messageIcon from '@/shared/ui/icons/assets/message-text.svg'
import likeIcon from '@/shared/ui/icons/assets/like-outline.svg'
import ideaIcon from '@/shared/ui/icons/assets/idea.svg'
import userInfoIcon from '@/shared/ui/icons/assets/user.svg'

const menuItems = [
  { to: ROUTES.PROFILE_REQUESTS, icon: requestIcon, label: 'Заявки' },
  { to: ROUTES.PROFILE_EXCHANGES, icon: messageIcon, label: 'Мои обмены' },
  { to: ROUTES.PROFILE_FAVORITES, icon: likeIcon, label: 'Избранное' },
  { to: ROUTES.PROFILE_SKILLS, icon: ideaIcon, label: 'Мои навыки' },
  { to: ROUTES.PROFILE_PERSONAL, icon: userInfoIcon, label: 'Личные данные' },
]

interface SidebarProps {
    className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <nav className={`${styles.sidebar} ${className ?? ''}`}>
      <div className={styles.list}>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? `${styles.item} ${styles.itemActive}` : styles.item
            }
          >
            <img src={item.icon} alt="" className={styles.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}