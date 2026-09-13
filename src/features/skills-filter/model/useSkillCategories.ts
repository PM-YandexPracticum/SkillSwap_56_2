import { useEffect, useState } from 'react'

import { fetchSkillCategories } from '@/api/skills'
import type { SkillCategory } from '@/shared/types'

export const useSkillCategories = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [status, setStatus] = useState<string | undefined>('Загрузка…')

  useEffect(() => {
    const controller = new AbortController()

    fetchSkillCategories(controller.signal)
      .then((data) => {
        setCategories(data)
        setStatus(undefined)
      })
      .catch(() => {
        // Отмену запускаем сами при размонтировании — это не ошибка загрузки
        if (!controller.signal.aborted) setStatus('Не удалось загрузить навыки')
      })

    return () => controller.abort()
  }, [])

  return { categories, status }
}
