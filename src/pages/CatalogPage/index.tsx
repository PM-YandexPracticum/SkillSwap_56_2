import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { FiltersBar, DEFAULT_FILTERS, type CatalogFilters } from '@/widgets/FiltersBar'
import { UserPreview } from '@/entities/user/ui/UserPreview'
import { loadUsers, showMore, resetVisible } from '@/entities/user/model/usersSlice'
import {
  selectFilteredUsers,
  selectUsersVisible,
  selectHasMore,
  selectUsersStatus,
} from '@/entities/user/model/selectors'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)

  const status = useSelector(selectUsersStatus)
  const visible = useSelector(selectUsersVisible)
  const filteredUsers = useSelector((state: RootState) => selectFilteredUsers(state, filters))
  const hasMore = useSelector((state: RootState) => selectHasMore(state, filters))

  
  useEffect(() => {
    dispatch(loadUsers())
  }, [dispatch])

  
  useEffect(() => {
    dispatch(resetVisible())
  }, [filters, dispatch])

  const visibleUsers = filteredUsers.slice(0, visible)

  return (
    <main className={styles.main}>
      <FiltersBar filters={filters} onChange={setFilters} />

      <div className={styles.content}>
        <h1>Каталог пользователей</h1>

        {status === 'loading' && <p>Загрузка...</p>}

        {status !== 'loading' && filteredUsers.length === 0 && (
          <p>Пользователи не найдены. Попробуйте изменить фильтры.</p>
        )}

        <div className={styles.grid}>
          {visibleUsers.map((user) => (
            <UserPreview key={user.id} user={user} />
          ))}
        </div>

        {hasMore && (
          <button onClick={() => dispatch(showMore())} className={styles.moreButton}>
            Показать ещё
          </button>
        )}
      </div>
    </main>
  )
}
