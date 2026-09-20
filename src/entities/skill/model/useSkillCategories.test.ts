import { renderHook, waitFor } from '@testing-library/react'

import { resetSkillCategoriesCache, useSkillCategories } from './useSkillCategories'

const categories = [
  {
    id: 'foreign-languages',
    title: 'Иностранные языки',
    skills: [{ id: 'english', title: 'Английский' }],
  },
]

const fetchMock = jest.fn()

beforeEach(() => {
  resetSkillCategoriesCache()

  Object.defineProperty(globalThis, 'fetch', {
    writable: true,
    configurable: true,
    value: fetchMock,
  })

  fetchMock.mockResolvedValue({ ok: true, json: async () => categories })
})

afterEach(() => {
  fetchMock.mockReset()
})

describe('useSkillCategories', () => {
  test('начинает с загрузки и отдаёт дерево категорий', async () => {
    const { result } = renderHook(() => useSkillCategories())

    expect(result.current.status).toBe('Загрузка…')

    await waitFor(() => expect(result.current.categories).toEqual(categories))

    expect(result.current.status).toBeUndefined()
  })

  test('делит один запрос между несколькими потребителями', async () => {
    const first = renderHook(() => useSkillCategories())
    const second = renderHook(() => useSkillCategories())

    await waitFor(() => expect(first.result.current.categories).toEqual(categories))
    await waitFor(() => expect(second.result.current.categories).toEqual(categories))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  test('сообщает об ошибке загрузки', async () => {
    fetchMock.mockResolvedValue({ ok: false })

    const { result } = renderHook(() => useSkillCategories())

    await waitFor(() => expect(result.current.status).toBe('Не удалось загрузить навыки'))
  })

  test('после ошибки повторный запрос проходит', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false })

    const failed = renderHook(() => useSkillCategories())
    await waitFor(() => expect(failed.result.current.status).toBe('Не удалось загрузить навыки'))
    failed.unmount()

    const retried = renderHook(() => useSkillCategories())

    await waitFor(() => expect(retried.result.current.categories).toEqual(categories))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
