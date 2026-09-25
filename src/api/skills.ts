import type { SkillCategory, SkillOption } from '@/shared/types'

const BASE_URL = '/db'

export async function fetchSkillCategories(signal?: AbortSignal): Promise<SkillCategory[]> {
  const response = await fetch(`${BASE_URL}/skills.json`, { signal })
  if (!response.ok) throw new Error('Failed to fetch skills')
  return response.json()
}

export async function fetchSkillById(id: string): Promise<SkillOption | undefined> {
  const categories = await fetchSkillCategories()
  return categories.flatMap((category) => category.skills).find((skill) => skill.id === id)
}
