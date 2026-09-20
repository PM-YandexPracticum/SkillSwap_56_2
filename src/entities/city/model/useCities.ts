import { useEffect, useState } from 'react'

import { fetchCities } from '@/api/cities'
import type { City } from '@/shared/types'

const LOADING_STATUS = 'Загрузка…'
const ERROR_STATUS = 'Не удалось загрузить города'

let citiesPromise: Promise<City[]> | null = null

/** Справочник общий для всего приложения, поэтому все хуки делят один запрос */
const loadCities = (): Promise<City[]> => {
  if (!citiesPromise) {
    citiesPromise = fetchCities().catch((error: unknown) => {
      citiesPromise = null
      throw error
    })
  }

  return citiesPromise
}

/** Сброс кэша: нужен тестам, чтобы запрос ушёл заново */
export const resetCitiesCache = () => {
  citiesPromise = null
}

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([])
  const [status, setStatus] = useState<string | undefined>(LOADING_STATUS)

  useEffect(() => {
    let isActive = true

    loadCities()
      .then((data) => {
        if (!isActive) return
        setCities(data)
        setStatus(undefined)
      })
      .catch(() => {
        if (isActive) setStatus(ERROR_STATUS)
      })

    return () => {
      isActive = false
    }
  }, [])

  return { cities, status }
}
