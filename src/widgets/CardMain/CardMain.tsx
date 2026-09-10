import { ButtonLike } from "@/shared/ui/ButtonLike";
import { UserPreview } from "@/entities/user/ui/UserPreview";
import { Tag } from "@/shared/ui/Tag";
import { Button } from "@/shared/ui/Button";
import { User } from "@/shared/types";
import styles from './CardMain.module.css'
import { useState } from "react";

type CardMainProps = {
  user: User
}

export const CardMain = ({user}: CardMainProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const handleClick = ()  => {
    setIsLiked(!isLiked)
  }
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <UserPreview user={user}></UserPreview>
        <ButtonLike isLiked={isLiked} onClick={handleClick}></ButtonLike>
      </div>
      <div className={styles['container-information']}>
        <div className={styles.information}>
          <h4 className={styles['title-tag']}>Может научить:</h4>
          <Tag tone="pink">Игра на барабанах</Tag> 
        </div>
        <div className={styles.information}>
          <h4 className={styles['title-tag']}>Хочет научиться:</h4>
          <div className={styles['container-tag']}>
            <Tag tone="blue">Тайм менеджмент</Tag>
            <Tag tone="mint">Медитация</Tag>
            <Tag tone="neutral">+2</Tag>
          </div>
        </div>
      </div>
      <Button >Подробнее</Button>
    </div>
  )
}