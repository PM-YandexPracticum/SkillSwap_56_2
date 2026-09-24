import { useId } from 'react'

import type { User } from '@/shared/types'
import { ArrowButton } from '@/shared/ui/ArrowButton'
import { Button } from '@/shared/ui/Button'
import { CardMain } from '@/widgets/CardMain'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'

import styles from './SectionCards.module.css'

export type SectionCardsStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SectionCardsProps = {
  title: string
  users: User[]
  status: SectionCardsStatus
  skeletonCount?: number
  onRetry?: () => void
  errorMessage?: string
  onShowMore?: () => void
  hasMore?: boolean
  onSeeAll?: () => void
  isLiked?: (userId: string) => boolean
  onLikeToggle?: (userId: string) => void
  isExpanded?: boolean
}

const DEFAULT_SKELETON_COUNT = 3
const DEFAULT_ERROR_MESSAGE = 'Не удалось загрузить карточки'

export const SectionCards = ({
  title,
  users,
  status,
  skeletonCount = DEFAULT_SKELETON_COUNT,
  onRetry,
  errorMessage = DEFAULT_ERROR_MESSAGE,
  onShowMore,
  hasMore,
  onSeeAll,
  isLiked,
  onLikeToggle,
  isExpanded = false,
}: SectionCardsProps) => {
  const titleId = useId()
  const shouldShowCards = status === 'succeeded' && users.length > 0
  const shouldShowEmpty = status === 'succeeded' && users.length === 0
  const skeletons = Array.from({ length: skeletonCount }, (_, index) => index)

  const sentinelRef = useInfiniteScroll({
    onLoadMore: onShowMore ?? (() => {}),
    hasMore: !!hasMore,
    isEnabled: !!onShowMore && !!hasMore,
  })

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <header className={styles.header}>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>

        {onSeeAll && (
          <ArrowButton
            variant="tertiary"
            className={styles.allLink}
            isOpen={isExpanded}
            onClick={onSeeAll}
          >
            {isExpanded ? 'Скрыть все' : 'Смотреть все'}
          </ArrowButton>
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
              <CardMain
                user={user}
                isLiked={isLiked?.(user.id) ?? false}
                onLikeToggle={onLikeToggle}
              />
            </li>
          ))}
        </ul>
      )}

      {shouldShowEmpty && <p className={styles.message}>Пока никого нет</p>}

      {status === 'failed' && (
        <div className={styles.error} role="alert">
          <p className={styles.message}>{errorMessage}</p>
          {onRetry && (
            <Button variant="secondary" onClick={onRetry}>
              Повторить
            </Button>
          )}
        </div>
      )}

      {onShowMore && hasMore && (
        <button className={styles.moreButton} onClick={onShowMore}>
          Показать ещё
        </button>
      )}

      <div ref={sentinelRef} className={styles.sentinel} />
    </section>
  )
}