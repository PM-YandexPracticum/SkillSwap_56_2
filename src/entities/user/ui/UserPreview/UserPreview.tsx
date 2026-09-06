import { getAge, plural } from '@/shared/lib/helpers'
import { RoundImage } from '@/shared/ui/RoundImage'
import type { RoundImageSize } from '@/shared/ui/RoundImage'

import type { User } from '../../model/types'
import styles from './UserPreview.module.css'

interface UserPreviewProps {
  user: User
  avatarSize?: RoundImageSize
}

export const UserPreview = ({ user, avatarSize = 'xl' }: UserPreviewProps) => {
  const age = getAge(user.birthDate)
  const ageText = age === null ? null : `${age} ${plural(age, ['год', 'года', 'лет'])}`
  const meta = [user.city, ageText].filter(Boolean).join(', ')

  return (
    <div className={styles.root}>
      <RoundImage src={user.avatarUrl} alt={user.name} size={avatarSize} />
      <div className={styles.info}>
        <h3 className={styles.name} title={user.name}>
          {user.name}
        </h3>
        <p className={styles.meta}>{meta}</p>
      </div>
    </div>
  )
}
