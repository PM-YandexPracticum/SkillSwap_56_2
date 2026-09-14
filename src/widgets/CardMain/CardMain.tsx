import { getSkillTone } from '@/entities/skill/lib'
import { UserPreview } from '@/entities/user/ui/UserPreview'
import { ROUTES } from '@/shared/lib/constants'
import type { User } from '@/shared/types'
import { ButtonLink } from '@/shared/ui/Button'
import { ButtonLike } from '@/shared/ui/ButtonLike'
import { Tag } from '@/shared/ui/Tag'

import styles from './CardMain.module.css'

const VISIBLE_LEARN_SKILLS = 2

export type CardMainProps = {
  user: User
  isLiked?: boolean
  onLikeToggle?: (userId: string) => void
}

export const CardMain = ({ user, isLiked = false, onLikeToggle }: CardMainProps) => {
  const visibleLearnSkills = user.learnSkills.slice(0, VISIBLE_LEARN_SKILLS)
  const hiddenLearnSkillsCount = user.learnSkills.length - VISIBLE_LEARN_SKILLS
  const skillHref = ROUTES.SKILL.replace(':id', user.id)

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <UserPreview user={user} />
        <ButtonLike isLiked={isLiked} onClick={() => onLikeToggle?.(user.id)} />
      </div>

      <div className={styles['container-information']}>
        <div className={styles.information}>
          <h4 className={styles['title-tag']}>Может научить:</h4>
          <div className={styles['container-tag']}>
            <Tag tone={getSkillTone(user.teachSkill.category)}>{user.teachSkill.title}</Tag>
          </div>
        </div>

        <div className={styles.information}>
          <h4 className={styles['title-tag']}>Хочет научиться:</h4>
          <div className={styles['container-tag']}>
            {visibleLearnSkills.map((skill) => (
              <Tag key={skill.id} tone={getSkillTone(skill.category)}>
                {skill.title}
              </Tag>
            ))}
            {hiddenLearnSkillsCount > 0 && <Tag>{`+${hiddenLearnSkillsCount}`}</Tag>}
          </div>
        </div>
      </div>

      <ButtonLink to={skillHref} className={styles.details} fullWidth>
        Подробнее
      </ButtonLink>
    </div>
  )
}
