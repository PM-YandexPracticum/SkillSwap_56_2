import styles from './ButtonLike.module.css'
import { LikeIcon } from "@/shared/ui/icons/LikeIcons"
type ButtonLikeProps = {
  isLiked: boolean
  onClick: () => void
}

export const ButtonLike = ({ isLiked, onClick }: ButtonLikeProps) => {
  return (
    <button className={`${styles.button} ${isLiked ? styles.liked : ''}`} type="button" onClick={onClick}>
      <LikeIcon className={styles.icon}></LikeIcon>
    </button>
  )
}
