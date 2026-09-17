import { useId } from 'react'

import type { User } from '@/shared/types'
import { Button, ButtonLink } from '@/shared/ui/Button'
import ChevronRightIcon from '@/shared/ui/icons/assets/chevron-right.svg?react'
import { CardMain } from '@/widgets/CardMain'

import styles from './SectionCards.module.css'

export type SectionCardsStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SectionCardsProps = {
  title: string
  users: User[]
  status: SectionCardsStatus
  allHref?: string
  skeletonCount?: number
  onRetry?: () => void
}

const DEFAULT_SKELETON_COUNT = 3

export const SectionCards = ({
  title,
  users,
  status,
  allHref,
  skeletonCount = DEFAULT_SKELETON_COUNT,
  onRetry,
}: SectionCardsProps) => {
  const titleId = useId()
  const shouldShowCards = status === 'succeeded' && users.length > 0
  const shouldShowEmpty = status === 'succeeded' && users.length === 0
  const skeletons = Array.from({ length: skeletonCount }, (_, index) => index)

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <header className={styles.header}>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>

        {allHref && (
          <ButtonLink
            to={allHref}
            className={styles.allLink}
            variant="tertiary"
            rightIcon={<ChevronRightIcon className={styles.allIcon} aria-hidden="true" />}
          >
            Смотреть все
          </ButtonLink>
        )}
      </header>

      {status === 'loading' && (
        <ul className={styles.grid} aria-label={title}>
          {skeletons.map((item) => (
            <li className={styles.item} key={item}>
              <div
                className={styles.skeleton}
                data-testid="section-card-skeleton"
                aria-hidden="true"
              >
                <span className={styles.skeletonProfile} />
                <span className={styles.skeletonLineWide} />
                <span className={styles.skeletonLine} />
                <span className={styles.skeletonTag} />
                <span className={styles.skeletonLine} />
                <span className={styles.skeletonTags} />
                <span className={styles.skeletonButton} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {shouldShowCards && (
        <ul className={styles.grid} aria-label={title}>
          {users.map((user) => (
            <li className={styles.item} key={user.id}>
              <CardMain user={user} />
            </li>
          ))}
        </ul>
      )}

      {shouldShowEmpty && <p className={styles.message}>Пока никого нет</p>}

      {status === 'failed' && (
        <div className={styles.error} role="alert">
          <p className={styles.message}>Не удалось загрузить карточки</p>
          <Button variant="secondary" onClick={onRetry} disabled={!onRetry}>
            Повторить
          </Button>
        </div>
      )}
    </section>
  )
}
