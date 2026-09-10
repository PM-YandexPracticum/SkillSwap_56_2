import styles from './ButtonLike.module.css'
import LikeSvg from '../icons/assets/like.svg?react'
type ButtonLikeProps = {
  isLiked: boolean
  onClick: () => void
}

export const ButtonLike = ({ isLiked, onClick }: ButtonLikeProps) => {
  return (
    <button className={`${styles.button} ${isLiked ? styles.liked : ''}`} type="button" onClick={onClick}>
      <LikeSvg className={styles.icon}/>
    </button>
  )
}
