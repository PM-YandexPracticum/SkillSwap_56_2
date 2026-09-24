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
  selectNewAll,
  selectPopular,
  selectPopularAll,
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
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { CardMain } from '@/widgets/CardMain'
import { FiltersBar } from '@/widgets/FiltersBar'
import { SectionCards } from '@/widgets/SectionCards'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'

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
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const { isFavorite, toggleFavorite } = useFavorites()

  const status = useAppSelector(selectUsersStatus)
  const error = useAppSelector(selectUsersError)
  const visible = useAppSelector(selectUsersVisible)
  const popularUsers = useAppSelector(selectPopular)
  const newUsers = useAppSelector(selectNew)
  const popularAll = useAppSelector(selectPopularAll)
  const newAll = useAppSelector(selectNewAll)
  const recommendedUsers = useAppSelector(selectRecommended)
  const usersByFilters = useAppSelector((state) => selectFilteredUsers(state, filters))
  const hasMoreByFilters = useAppSelector((state) => selectHasMore(state, filters))
  const searchQuery = new URLSearchParams(location.search).get('search')?.trim() ?? ''
  const normalizedSearchQuery = searchQuery.toLocaleLowerCase('ru')

  const filteredUsers = useMemo(() => {
    if (!normalizedSearchQuery) {
      return usersByFilters
    }

    return usersByFilters.filter((user) =>
      user.name.toLocaleLowerCase('ru').startsWith(normalizedSearchQuery),
    )
  }, [normalizedSearchQuery, usersByFilters])

  const isSearchActive = normalizedSearchQuery.length > 0
  const hasActiveFilters = isFiltersActive(filters)
  const isFiltering = hasActiveFilters || isSearchActive
  const hasMore = isSearchActive ? visible < filteredUsers.length : hasMoreByFilters

  const visibleUsers = useMemo(
    () => sortUsers(filteredUsers, sortBy).slice(0, visible),
    [filteredUsers, sortBy, visible],
  )

  useEffect(() => {
    dispatch(loadUsers())
  }, [dispatch])

  useEffect(() => {
    dispatch(resetVisible())
  }, [filters, normalizedSearchQuery, dispatch])

  useEffect(() => {
    if ((location.state as CatalogPageLocationState)?.registrationSuccess) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location, navigate])

  const handleRetry = () => {
    dispatch(loadUsers())
  }

  const handleSeeAll = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const filteredSentinelRef = useInfiniteScroll({
    onLoadMore: () => dispatch(showMore()),
    hasMore: !!hasMore,
    isEnabled: isFiltering && !!hasMore,
  })

  return (
    <main className={styles.page}>
      {statusMessage && (
        <p className={styles.statusMessage} role="status">
          {statusMessage}
        </p>
      )}

      <ActiveFilters filters={filters} onChange={setFilters} />

      <div className={styles.mainRow}>
        <div className={hasActiveFilters ? styles.sidebar : styles.sidebarCard}>
          {!hasActiveFilters && <h2 className={styles.sidebarTitleInside}>Фильтры</h2>}

          <FiltersBar
            filters={filters}
            onChange={setFilters}
            className={hasActiveFilters ? undefined : styles.filtersTransparent}
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

              <div ref={filteredSentinelRef} className={styles.sentinel} />
            </>
          ) : (
            <div className={styles.sections}>
              <SectionCards
                title="Популярное"
                users={expandedSection === 'popular' ? popularAll : popularUsers}
                status={status}
                isExpanded={expandedSection === 'popular'}
                onSeeAll={() => handleSeeAll('popular')}
                onRetry={handleRetry}
                errorMessage={error ?? undefined}
                isLiked={isFavorite}
                onLikeToggle={toggleFavorite}
              />

              <SectionCards
                title="Новое"
                users={expandedSection === 'newest' ? newAll : newUsers}
                status={status}
                isExpanded={expandedSection === 'newest'}
                onSeeAll={() => handleSeeAll('newest')}
                onRetry={handleRetry}
                errorMessage={error ?? undefined}
                isLiked={isFavorite}
                onLikeToggle={toggleFavorite}
              />

              <SectionCards
                title="Рекомендуем"
                users={recommendedUsers}
                status={status}
                onShowMore={() => dispatch(showMore())}
                hasMore={hasMore}
                onRetry={handleRetry}
                errorMessage={error ?? undefined}
                isLiked={isFavorite}
                onLikeToggle={toggleFavorite}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
