import { useState } from 'react'

import { Button } from '@/shared/ui/Button'
import { Gallery, type GalleryImage } from '@/shared/ui/Gallery'
import LikeIcon from '@/shared/ui/icons/assets/like.svg?react'
import MoreIcon from '@/shared/ui/icons/assets/more-square.svg?react'
import ShareIcon from '@/shared/ui/icons/assets/share.svg?react'

import styles from '@/widgets/CardSkillOffer/CardSkillOffer.module.css'

export interface CardSkillOfferProps {
  title: string
  category: string
  subcategory: string
  description: string
  images: GalleryImage[]
  className?: string
}

export const CardSkillOffer = ({
  title,
  category,
  subcategory,
  description,
  images,
  className = '',
}: CardSkillOfferProps) => {
  const [isLiked, setIsLiked] = useState(false)
  const cardClassName = [styles.card, className].filter(Boolean).join(' ')

  return (
    <article className={cardClassName}>
      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${isLiked ? styles.actionButtonActive : ''}`}
          type="button"
          aria-label={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
          aria-pressed={isLiked}
          onClick={() => setIsLiked((value) => !value)}
        >
          <LikeIcon className={styles.likeIcon} aria-hidden="true" />
        </button>
        <button className={styles.actionButton} type="button" aria-label="Поделиться">
          <ShareIcon aria-hidden="true" />
        </button>
        <button className={styles.actionButton} type="button" aria-label="Ещё действия">
          <MoreIcon aria-hidden="true" />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.breadcrumbs}>
              {category} / {subcategory}
            </p>
          </div>

          <p className={styles.description}>{description}</p>

          <Button className={styles.offerButton} size="lg" fullWidth>
            Предложить обмен
          </Button>
        </div>

        <Gallery className={styles.gallery} images={images} />
      </div>
    </article>
  )
}
