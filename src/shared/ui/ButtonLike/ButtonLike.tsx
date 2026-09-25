import styles from './ButtonLike.module.css'
import LikeSvg from '../icons/assets/like.svg?react'

type ButtonLikeProps = {
  isLiked: boolean
  onClick: () => void
  label?: string
}

export const ButtonLike = ({ isLiked, onClick, label }: ButtonLikeProps) => {
  return (
    <button
      className={`${styles.button} ${isLiked ? styles.liked : ''}`}
      type="button"
      aria-label={label}
      aria-pressed={isLiked}
      onClick={onClick}
    >
      <LikeSvg className={styles.icon} />
    </button>
  )
}
