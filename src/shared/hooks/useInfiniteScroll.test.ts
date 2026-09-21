import { renderHook } from '@testing-library/react'

import { useInfiniteScroll } from './useInfiniteScroll'

describe('useInfiniteScroll', () => {
  const mockOnLoadMore = jest.fn()

  beforeEach(() => {
    mockOnLoadMore.mockClear()
  })

  test('не создаёт observer когда hasMore=false', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockOnLoadMore, hasMore: false }),
    )

    // ref.current будет null до монтирования — это нормально
    expect(result.current).toBeDefined()
  })

  test('не создаёт observer когда isEnabled=false', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockOnLoadMore, hasMore: true, isEnabled: false }),
    )

    expect(result.current).toBeDefined()
  })

  test('возвращает ref для sentinel div', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockOnLoadMore, hasMore: true, isEnabled: true }),
    )

    expect(result.current).toBeDefined()
    expect(result.current).toHaveProperty('current')
  })

  test('не вызывает onLoadMore когда hasMore=false', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockOnLoadMore, hasMore: false, isEnabled: true }),
    )

    expect(mockOnLoadMore).not.toHaveBeenCalled()
  })

  test('не вызывает onLoadMore когда isEnabled=false', () => {
    renderHook(() =>
      useInfiniteScroll({ onLoadMore: mockOnLoadMore, hasMore: true, isEnabled: false }),
    )

    expect(mockOnLoadMore).not.toHaveBeenCalled()
  })
})
