import { useEffect, useState } from 'react'

import {
  DEFAULT_FILTERS,
  loadUsers,
  resetVisible,
  selectFilteredUsers,
  selectHasMore,
  selectUsersError,
  selectUsersStatus,
  selectUsersVisible,
  showMore,
  UserPreview,
  type CatalogFilters,
} from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { FiltersBar } from '@/widgets/FiltersBar'

import styles from './CatalogPage.module.css'

const DEFAULT_ERROR = 'Не удалось загрузить пользователей'

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)

  const status = useAppSelector(selectUsersStatus)
  const error = useAppSelector(selectUsersError)
  const visible = useAppSelector(selectUsersVisible)
  const filteredUsers = useAppSelector((state) => selectFilteredUsers(state, filters))
  const hasMore = useAppSelector((state) => selectHasMore(state, filters))

  useEffect(() => {
    dispatch(loadUsers())
  }, [dispatch])

  useEffect(() => {
    dispatch(resetVisible())
  }, [filters, dispatch])

  const handleRetry = () => {
    dispatch(loadUsers())
  }

  const visibleUsers = filteredUsers.slice(0, visible)

  return (
    <main className={styles.main}>
      <FiltersBar filters={filters} onChange={setFilters} />

      <div className={styles.content}>
        <h1>Каталог пользователей</h1>

        {status === 'loading' && <p>Загрузка...</p>}

        {status === 'failed' && (
          <div className={styles.error} role="alert">
            <p>{error ?? DEFAULT_ERROR}</p>
            <button className={styles.retryButton} onClick={handleRetry}>
              Повторить
            </button>
          </div>
        )}

        {status === 'succeeded' && filteredUsers.length === 0 && (
          <p>Пользователи не найдены. Попробуйте изменить фильтры.</p>
        )}

        <div className={styles.grid}>
          {visibleUsers.map((user) => (
            <UserPreview key={user.id} user={user} />
          ))}
        </div>

        {status === 'succeeded' && hasMore && (
          <button className={styles.moreButton} onClick={() => dispatch(showMore())}>
            Показать ещё
          </button>
        )}
      </div>
    </main>
  )
}
