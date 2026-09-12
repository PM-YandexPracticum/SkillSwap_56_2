import { useEffect, useState } from 'react'

import { fetchSkillCategories } from '@/api/skills'
import type { SkillCategory } from '@/shared/types'

/** Готовый список отдаётся как есть — копия в состоянии разошлась бы с пропсом */
export const useSkillCategories = (items?: SkillCategory[]) => {
  const [loaded, setLoaded] = useState<SkillCategory[]>([])
  const [status, setStatus] = useState<string | undefined>(items ? undefined : 'Загрузка…')

  useEffect(() => {
    if (items) return

    const controller = new AbortController()

    fetchSkillCategories(controller.signal)
      .then((data) => {
        setLoaded(data)
        setStatus(undefined)
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('Не удалось загрузить навыки')
      })

    return () => controller.abort()
  }, [items])

  return { categories: items ?? loaded, status }
}
