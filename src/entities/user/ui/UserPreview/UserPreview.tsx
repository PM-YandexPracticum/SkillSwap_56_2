import { plural } from '@/shared/lib/helpers'
import { RoundImage } from '@/shared/ui/RoundImage'

import type { User } from '../../model/types'
import styles from './UserPreview.module.css'

interface UserPreviewProps {
  user: User
  avatarSize?: number
}

function getAge(birthDate: string): number {
  const today = new Date()
  const birthday = new Date(birthDate)
  const years = today.getFullYear() - birthday.getFullYear()
  const hasBirthdayPassed =
    today.getMonth() > birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate())

  return hasBirthdayPassed ? years : years - 1
}

export const UserPreview = ({ user, avatarSize = 100 }: UserPreviewProps) => {
  const age = getAge(user.birthDate)
  const ageLabel = plural(age, ['год', 'года', 'лет'])

  return (
    <div className={styles.root}>
      <RoundImage src={user.avatarUrl} name={user.name} size={avatarSize} />
      <div className={styles.info}>
        <h3 className={styles.name} title={user.name}>
          {user.name}
        </h3>
        <p className={styles.meta}>
          {user.city}, {age} {ageLabel}
        </p>
      </div>
    </div>
  )
}
