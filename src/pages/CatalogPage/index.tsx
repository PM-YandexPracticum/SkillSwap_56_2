import { useEffect, useState } from 'react'

import {
  DEFAULT_FILTERS,
  loadUsers,
  resetVisible,
  selectFilteredUsers,
  selectHasMore,
  selectNew,
  selectPopular,
  selectRecommended,
  selectUsersError,
  selectUsersStatus,
  selectUsersVisible,
  showMore,
  UserPreview,
  type CatalogFilters,
} from '@/entities/user'
import { ROUTES } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { FiltersBar } from '@/widgets/FiltersBar'
import { SectionCards } from '@/widgets/SectionCards'

import styles from './CatalogPage.module.css'

const DEFAULT_ERROR = 'Не удалось загрузить пользователей'

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)

  const status = useAppSelector(selectUsersStatus)
  const error = useAppSelector(selectUsersError)
  const visible = useAppSelector(selectUsersVisible)
  const popularUsers = useAppSelector(selectPopular)
  const newUsers = useAppSelector(selectNew)
  const recommendedUsers = useAppSelector(selectRecommended)
  const filteredUsers = useAppSelector((state) => selectFilteredUsers(state, filters))
  const hasMore = useAppSelector((state) => selectHasMore(state, filters))

  const isFiltering =
    filters.type !== DEFAULT_FILTERS.type ||
    filters.gender !== DEFAULT_FILTERS.gender ||
    filters.skills.length > 0 ||
    filters.cities.length > 0

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
    <main className={styles.page}>
      <FiltersBar filters={filters} onChange={setFilters} className={styles.filters} />

      <div className={styles.content}>
        <h1 className={styles.title}>Каталог пользователей</h1>

        {isFiltering ? (
          <>
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
          </>
        ) : (
          <div className={styles.sections}>
            <SectionCards
              title="Популярное"
              users={popularUsers}
              status={status}
              allHref={ROUTES.HOME}
              onRetry={handleRetry}
              errorMessage={error ?? undefined}
            />

            <SectionCards
              title="Новое"
              users={newUsers}
              status={status}
              allHref={ROUTES.HOME}
              onRetry={handleRetry}
              errorMessage={error ?? undefined}
            />

            <SectionCards
              title="Рекомендуем"
              users={recommendedUsers}
              status={status}
              onRetry={handleRetry}
              errorMessage={error ?? undefined}
            />
          </div>
        )}
      </div>
    </main>
  )
}
