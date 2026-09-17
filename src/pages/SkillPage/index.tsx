// TODO: реализовать страницу SkillPage
import { useState } from 'react'

import { Spinner } from '@/shared/ui/Spinner'

export default function SkillPage() {
  const [isLoading] = useState<boolean>(false) // Готовность под загрузку данных навыка по ID

  if (isLoading) {
    return <Spinner fullPage />
  }
  return (
    <main>
      <h1>SkillPage</h1>
      <p>Страница в разработке</p>
    </main>
  )
}
