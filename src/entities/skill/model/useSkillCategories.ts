import { useEffect, useState } from 'react'

import { fetchSkillCategories } from '@/api/skills'
import type { SkillCategory } from '@/shared/types'

const LOADING_STATUS = 'Загрузка…'
const ERROR_STATUS = 'Не удалось загрузить навыки'

let categoriesPromise: Promise<SkillCategory[]> | null = null

/** Справочник общий для всего приложения, поэтому все хуки делят один запрос */
const loadCategories = (): Promise<SkillCategory[]> => {
  if (!categoriesPromise) {
    categoriesPromise = fetchSkillCategories().catch((error: unknown) => {
      categoriesPromise = null
      throw error
    })
  }

  return categoriesPromise
}

/** Сброс кэша: нужен тестам, чтобы запрос ушёл заново */
export const resetSkillCategoriesCache = () => {
  categoriesPromise = null
}

export const useSkillCategories = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [status, setStatus] = useState<string | undefined>(LOADING_STATUS)

  useEffect(() => {
    let isActive = true

    loadCategories()
      .then((data) => {
        if (!isActive) return
        setCategories(data)
        setStatus(undefined)
      })
      .catch(() => {
        if (isActive) setStatus(ERROR_STATUS)
      })

    return () => {
      isActive = false
    }
  }, [])

  return { categories, status, isLoading: status === LOADING_STATUS }
}
