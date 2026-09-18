import { useEffect, useState } from 'react'

import {
  loadUsers,
  selectNew,
  selectPopular,
  selectRecommended,
  selectUsersError,
  selectUsersStatus,
} from '@/entities/user'
import { ROUTES } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { DEFAULT_FILTERS, FiltersBar, type CatalogFilters } from '@/widgets/FiltersBar'
import { SectionCards } from '@/widgets/SectionCards'

import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectUsersStatus)
  const error = useAppSelector(selectUsersError)
  const popularUsers = useAppSelector(selectPopular)
  const newUsers = useAppSelector(selectNew)
  const recommendedUsers = useAppSelector(selectRecommended)
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)

  useEffect(() => {
    dispatch(loadUsers())
  }, [dispatch])

  const handleRetry = () => {
    dispatch(loadUsers())
  }

  return (
    <main className={styles.page}>
      <FiltersBar filters={filters} onChange={setFilters} className={styles.filters} />

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
    </main>
  )
}
