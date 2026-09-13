import { useEffect, useState } from 'react'

import { fetchCities } from '@/api/cities'
import type { City } from '@/shared/types'

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([])
  const [status, setStatus] = useState<string | undefined>('Загрузка…')

  useEffect(() => {
    const controller = new AbortController()

    fetchCities(controller.signal)
      .then((data) => {
        setCities(data)
        setStatus(undefined)
      })
      .catch(() => {
        // Отмену запускаем сами при размонтировании — это не ошибка загрузки
        if (!controller.signal.aborted) setStatus('Не удалось загрузить города')
      })

    return () => controller.abort()
  }, [])

  return { cities, status }
}
