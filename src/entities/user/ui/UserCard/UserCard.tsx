import { UserPreview } from '@/entities/user/ui/UserPreview'
import styles from './UserCard.module.css'
//import { useParams } from 'react-router-dom'
import { fetchUsers } from '@/api/users'
import { User } from '@/shared/types'
import { useState, useEffect } from 'react'
import { Tag } from '@/shared/ui/Tag'
export const UserCard = () => {
  //const { id } = useParams();  открыть, когда появится роут на skill/:id
  const id = 'user-1'
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
      .then((users) => {
        const foundUser = users.find((user) => user.id === id)
        setUser(foundUser ?? null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [id])

  if (isLoading) {
    return <div>Загрузка...</div> // можно еще добавить scrollbar
  }

  if (!user) {
    return <div>Пользователь не найден</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <UserPreview user={user}></UserPreview>
        <p className={styles.description}>
          Привет! Люблю ритм, кофе по&nbsp;утрам и&nbsp;людей, которые не&nbsp;боятся пробовать новое
        </p>
      </div>
      <div className={styles.information}>
        <h4 className={styles['title-tag']}>Может научить:</h4>
        <Tag tone="yellow">Английский язык</Tag>
      </div>
      <div className={styles.information}>
        <h4 className={styles['title-tag']}>Хочет научиться:</h4>
        <div className={styles['container-tag']}>
          <Tag tone="blue">Тайм менеджмент</Tag>
          <Tag tone="mint">Медитация</Tag>
        </div>
      </div>
    </div>
  )
}
