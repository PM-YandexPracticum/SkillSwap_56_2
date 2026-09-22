import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  DEFAULT_FILTERS,
  isFiltersActive,
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
  type CatalogFilters,
} from '@/entities/user'
import { ActiveFilters } from '@/features/active-filters'
import { useFavorites } from '@/features/favorites'
import { DEFAULT_SORT, SortSelect, sortUsers, type SortOption } from '@/features/sort-users'
import { ROUTES } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { CardMain } from '@/widgets/CardMain'
import { FiltersBar } from '@/widgets/FiltersBar'
import { SectionCards } from '@/widgets/SectionCards'

import styles from './CatalogPage.module.css'

const DEFAULT_ERROR = 'Не удалось загрузить пользователей'
const REGISTRATION_SUCCESS_MESSAGE = 'Регистрация успешно завершена'

type CatalogPageLocationState = { registrationSuccess?: boolean } | null

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_SORT)
  const [statusMessage] = useState(() =>
    (location.state as CatalogPageLocationState)?.registrationSuccess
      ? REGISTRATION_SUCCESS_MESSAGE
      : '',
  )
  const { isFavorite, toggleFavorite } = useFavorites()

  const status = useAppSelector(selectUsersStatus)
  const error = useAppSelector(selectUsersError)
  const visible = useAppSelector(selectUsersVisible)
  const popularUsers = useAppSelector(selectPopular)
  const newUsers = useAppSelector(selectNew)
  const recommendedUsers = useAppSelector(selectRecommended)
  const filteredUsers = useAppSelector((state) => selectFilteredUsers(state, filters))
  const hasMore = useAppSelector((state) => selectHasMore(state, filters))

  const isFiltering = isFiltersActive(filters)

  const visibleUsers = useMemo(
    () => sortUsers(filteredUsers, sortBy).slice(0, visible),
    [filteredUsers, sortBy, visible],
  )

  useEffect(() => {
    dispatch(loadUsers())
  }, [dispatch])

  useEffect(() => {
    dispatch(resetVisible())
  }, [filters, dispatch])

  useEffect(() => {
    if ((location.state as CatalogPageLocationState)?.registrationSuccess) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location, navigate])

  const handleRetry = () => {
    dispatch(loadUsers())
  }

  return (
    <main className={styles.page}>
      {statusMessage && (
        <p className={styles.statusMessage} role="status">
          {statusMessage}
        </p>
      )}

      <ActiveFilters filters={filters} onChange={setFilters} />

      <div className={styles.mainRow}>
        <div className={isFiltering ? styles.sidebar : styles.sidebarCard}>
          {!isFiltering && <h2 className={styles.sidebarTitleInside}>Фильтры</h2>}

          <FiltersBar
            filters={filters}
            onChange={setFilters}
            className={isFiltering ? undefined : styles.filtersTransparent}
          />
        </div>

        <div className={styles.content}>
          {isFiltering ? (
            <>
              <div className={styles.headerRow}>
                <h1 className={styles.title}>Подходящие предложения: {filteredUsers.length}</h1>

                <SortSelect value={sortBy} onChange={setSortBy} />
              </div>

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
                  <CardMain
                    key={user.id}
                    user={user}
                    isLiked={isFavorite(user.id)}
                    onLikeToggle={toggleFavorite}
                  />
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
      </div>
    </main>
  )
}
