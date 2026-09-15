import { useState } from 'react'
import { FiltersBar, DEFAULT_FILTERS, type CatalogFilters } from '@/widgets/FiltersBar'

export default function CatalogPage() {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)

  return (
    <main
      style={{
        display: 'flex',
        gap: '24px',
        padding: '24px',
        alignItems: 'flex-start',
      }}
    >
      <FiltersBar filters={filters} onChange={setFilters} />

      <div>
        <h1>CatalogPage</h1>
        <p>Страница в разработке</p>
      </div>
    </main>
  )
}
