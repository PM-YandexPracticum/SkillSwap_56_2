import { Outlet } from 'react-router-dom'

import { ProfileSidebar } from '@/widgets/ProfileSidebar'

import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <ProfileSidebar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
