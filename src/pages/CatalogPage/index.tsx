import { useEffect, useMemo, useRef, useState } from 'react'

import { fetchCities } from '@/api/cities'
import { fetchSkillCategories } from '@/api/skills'
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
  type CatalogFilters,
} from '@/entities/user'
import { ROUTES } from '@/shared/lib/constants'
import type { City, SkillCategory } from '@/shared/types'
import ChevronDownIcon from '@/shared/ui/icons/assets/chevron-down.svg?react'
import CrossIcon from '@/shared/ui/icons/assets/cross.svg?react'
import SortIcon from '@/shared/ui/icons/assets/sort.svg?react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { CardMain } from '@/widgets/CardMain'
import { FiltersBar } from '@/widgets/FiltersBar'
import { SectionCards } from '@/widgets/SectionCards'

import styles from './CatalogPage.module.css'

const DEFAULT_ERROR = 'Не удалось загрузить пользователей'

type SortOption = 'newest' | 'popular'

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Сначала новые',
  popular: 'По популярности',
}

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)

  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  // Состояние кастомного дропдауна сортировки
  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

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

  // Загрузка справочников для названий навыков и городов в чипсах
  useEffect(() => {
    Promise.all([fetchSkillCategories(), fetchCities()])
      .then(([skillsData, citiesData]) => {
        setCategories(skillsData)
        setCities(citiesData)
      })
      .catch(() => {
        setCategories([])
        setCities([])
      })
  }, [])

  // Закрытие дропдауна сортировки при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const skillTitleMap = useMemo(() => {
    const map = new Map<string, string>()
    categories.forEach((category) => {
      category.skills.forEach((skill) => map.set(skill.id, skill.title))
    })
    return map
  }, [categories])

  const cityTitleMap = useMemo(() => {
    const map = new Map<string, string>()
    cities.forEach((city) => map.set(city.id, city.title))
    return map
  }, [cities])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.type !== DEFAULT_FILTERS.type) count += 1
    if (filters.gender !== DEFAULT_FILTERS.gender) count += 1
    count += filters.skills.length
    count += filters.cities.length
    return count
  }, [filters])

  const sortedFilteredUsers = useMemo(() => {
    const list = [...filteredUsers]

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else {
      list.sort((a, b) => (b.likesCount ?? 0) - (a.likesCount ?? 0))
    }

    return list
  }, [filteredUsers, sortBy])

  const handleLikeToggle = (userId: string) => {
    setFavorites((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    )
  }

  const handleRetry = () => {
    dispatch(loadUsers())
  }

  const handleSortSelect = (option: SortOption) => {
    setSortBy(option)
    setIsSortOpen(false)
  }

  const visibleUsers = sortedFilteredUsers.slice(0, visible)

  return (
    <main className={styles.page}>
      {/* Верхняя строка: заголовок «Фильтры (N)», сброс и чипсы */}
      {isFiltering && (
        <div className={styles.topRow}>
          <div className={styles.topLeft}>
            <h2 className={styles.sidebarTitle}>Фильтры ({activeFiltersCount})</h2>

            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Сбросить
              <CrossIcon className={styles.resetIcon} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.topRight}>
            {filters.type !== DEFAULT_FILTERS.type && (
              <span className={styles.chip}>
                {filters.type === 'learn' ? 'Хочу научиться' : 'Могу научить'}
                <button
                  type="button"
                  className={styles.chipRemove}
                  aria-label="Убрать фильтр по типу"
                  onClick={() => setFilters({ ...filters, type: DEFAULT_FILTERS.type })}
                >
                  <CrossIcon className={styles.chipIcon} aria-hidden="true" />
                </button>
              </span>
            )}

            {filters.gender !== DEFAULT_FILTERS.gender && (
              <span className={styles.chip}>
                {filters.gender === 'male' ? 'Мужской' : 'Женский'}
                <button
                  type="button"
                  className={styles.chipRemove}
                  aria-label="Убрать фильтр по полу"
                  onClick={() => setFilters({ ...filters, gender: DEFAULT_FILTERS.gender })}
                >
                  <CrossIcon className={styles.chipIcon} aria-hidden="true" />
                </button>
              </span>
            )}

            {filters.skills.map((skillId) => (
              <span key={skillId} className={styles.chip}>
                {skillTitleMap.get(skillId) ?? skillId}
                <button
                  type="button"
                  className={styles.chipRemove}
                  aria-label="Убрать навык из фильтра"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      skills: filters.skills.filter((id) => id !== skillId),
                    })
                  }
                >
                  <CrossIcon className={styles.chipIcon} aria-hidden="true" />
                </button>
              </span>
            ))}

            {filters.cities.map((cityId) => (
              <span key={cityId} className={styles.chip}>
                {cityTitleMap.get(cityId) ?? cityId}
                <button
                  type="button"
                  className={styles.chipRemove}
                  aria-label="Убрать город из фильтра"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      cities: filters.cities.filter((id) => id !== cityId),
                    })
                  }
                >
                  <CrossIcon className={styles.chipIcon} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Нижняя строка: сайдбар и контент */}
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
                <h1 className={styles.title}>
                  Подходящие предложения: {filteredUsers.length}
                </h1>

                {/* Кастомный дропдаун сортировки */}
                <div className={styles.customSort} ref={sortRef}>
                  <button
                    type="button"
                    className={styles.sortButton}
                    aria-expanded={isSortOpen}
                    aria-haspopup="listbox"
                    onClick={() => setIsSortOpen((prev) => !prev)}
                  >
                    <SortIcon className={styles.sortIcon} aria-hidden="true" />
                    <span>{SORT_LABELS[sortBy]}</span>
                    <ChevronDownIcon
                      className={[styles.sortArrow, isSortOpen && styles.sortArrowOpen]
                        .filter(Boolean)
                        .join(' ')}
                      aria-hidden="true"
                    />
                  </button>

                  {isSortOpen && (
                    <ul className={styles.sortDropdown} role="listbox">
                      {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                        <li
                          key={option}
                          role="option"
                          aria-selected={sortBy === option}
                          className={[
                            styles.sortOption,
                            sortBy === option && styles.sortOptionActive,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => handleSortSelect(option)}
                        >
                          {SORT_LABELS[option]}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
                    isLiked={favorites.includes(user.id)}
                    onLikeToggle={handleLikeToggle}
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
