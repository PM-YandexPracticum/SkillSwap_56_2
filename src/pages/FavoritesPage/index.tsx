import { CardMain } from '@/widgets/CardMain'
import { useFavorites } from '@/features/favorites'
import { useAppSelector } from '@/store/hooks'
import { selectUsers } from '@/entities/user'

import styles from './FavoritesPage.module.css'

export default function FavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavorites()
  const users = useAppSelector(selectUsers)

  const favoriteUsers = users.filter((user) => favoriteIds.includes(user.id))

  return (
    <main className={styles.page}>
      {favoriteUsers.length === 0 ? (
        <p className={styles.empty}>Вы пока не добавили никого в избранное</p>
      ) : (
        <div className={styles.grid}>
          {favoriteUsers.map((user) => (
            <CardMain
              key={user.id}
              user={user}
              isLiked={true}
              onLikeToggle={toggleFavorite}
            />
          ))}
        </div>
      )}
    </main>
  )
}
