import { useEffect, useState } from 'react'

import { fetchCities } from '@/api/cities'
import type { City } from '@/shared/types'

/** Готовый список отдаётся как есть — копия в состоянии разошлась бы с пропсом */
export const useCities = (items?: City[]) => {
  const [loaded, setLoaded] = useState<City[]>([])
  const [status, setStatus] = useState<string | undefined>(items ? undefined : 'Загрузка…')

  useEffect(() => {
    if (items) return

    const controller = new AbortController()

    fetchCities(controller.signal)
      .then((data) => {
        setLoaded(data)
        setStatus(undefined)
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('Не удалось загрузить города')
      })

    return () => controller.abort()
  }, [items])

  return { cities: items ?? loaded, status }
}
