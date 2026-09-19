import { renderHook, waitFor } from '@testing-library/react'

import { resetCitiesCache, useCities } from './useCities'

const cities = [
  { id: 'moscow', title: 'Москва' },
  { id: 'kazan', title: 'Казань' },
]

const fetchMock = jest.fn()

beforeEach(() => {
  resetCitiesCache()

  Object.defineProperty(globalThis, 'fetch', {
    writable: true,
    configurable: true,
    value: fetchMock,
  })

  fetchMock.mockResolvedValue({ ok: true, json: async () => cities })
})

afterEach(() => {
  fetchMock.mockReset()
})

describe('useCities', () => {
  test('начинает с загрузки и отдаёт справочник', async () => {
    const { result } = renderHook(() => useCities())

    expect(result.current.status).toBe('Загрузка…')
    expect(result.current.cities).toEqual([])

    await waitFor(() => expect(result.current.cities).toEqual(cities))

    expect(result.current.status).toBeUndefined()
  })

  test('делит один запрос между несколькими потребителями', async () => {
    const first = renderHook(() => useCities())
    const second = renderHook(() => useCities())

    await waitFor(() => expect(first.result.current.cities).toEqual(cities))
    await waitFor(() => expect(second.result.current.cities).toEqual(cities))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  test('сообщает об ошибке загрузки', async () => {
    fetchMock.mockResolvedValue({ ok: false })

    const { result } = renderHook(() => useCities())

    await waitFor(() => expect(result.current.status).toBe('Не удалось загрузить города'))
    expect(result.current.cities).toEqual([])
  })

  test('после ошибки повторный запрос проходит', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false })

    const failed = renderHook(() => useCities())
    await waitFor(() => expect(failed.result.current.status).toBe('Не удалось загрузить города'))
    failed.unmount()

    const retried = renderHook(() => useCities())

    await waitFor(() => expect(retried.result.current.cities).toEqual(cities))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
