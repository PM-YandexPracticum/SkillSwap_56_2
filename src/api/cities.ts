import type { City } from '@/shared/types'

const BASE_URL = '/db'

export async function fetchCities(signal?: AbortSignal): Promise<City[]> {
  const response = await fetch(`${BASE_URL}/cities.json`, { signal })
  if (!response.ok) throw new Error('Failed to fetch cities')
  return response.json()
}
