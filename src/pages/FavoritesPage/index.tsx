import { useEffect } from 'react'

import { loadUsers, selectUsersError, selectUsersStatus } from '@/entities/user'
import { selectFavoriteUsers, useFavorites } from '@/features/favorites'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { CardMain } from '@/widgets/CardMain'

import styles from './FavoritesPage.module.css'

const DEFAULT_ERROR = 'Не удалось загрузить пользователей'

export default function FavoritesPage() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectUsersStatus)
  const error = useAppSelector(selectUsersError)
  const { toggleFavorite } = useFavorites()
  const favoriteUsers = useAppSelector(selectFavoriteUsers)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadUsers())
    }
  }, [dispatch, status])

  if (status === 'idle' || status === 'loading') {
    return (
      <main className={styles.page}>
        <p className={styles.empty}>Загрузка…</p>
      </main>
    )
  }

  if (status === 'failed') {
    return (
      <main className={styles.page}>
        <p className={styles.empty}>{error ?? DEFAULT_ERROR}</p>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      {favoriteUsers.length === 0 ? (
        <p className={styles.empty}>Вы пока не добавили никого в избранное</p>
      ) : (
        <div className={styles.grid}>
          {favoriteUsers.map((user) => (
            <CardMain key={user.id} user={user} isLiked={true} onLikeToggle={toggleFavorite} />
          ))}
        </div>
      )}
    </main>
  )
}
