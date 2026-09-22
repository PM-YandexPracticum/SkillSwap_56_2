import { act, render } from '@testing-library/react'

import { useInfiniteScroll } from './useInfiniteScroll'

type ObserverCallback = IntersectionObserverCallback

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  root = null
  rootMargin = ''
  thresholds = []
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()

  constructor(readonly callback: ObserverCallback) {
    MockIntersectionObserver.instances.push(this)
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as never)
  }
}

type Props = {
  onLoadMore: () => void
  hasMore: boolean
  isEnabled?: boolean
}

const TestComponent = ({ onLoadMore, hasMore, isEnabled }: Props) => {
  const sentinelRef = useInfiniteScroll({ onLoadMore, hasMore, isEnabled })
  return <div ref={sentinelRef} data-testid="sentinel" />
}

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = []
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
  })

  test('вызывает onLoadMore при пересечении sentinel', () => {
    const onLoadMore = jest.fn()
    render(<TestComponent onLoadMore={onLoadMore} hasMore isEnabled />)

    expect(MockIntersectionObserver.instances).toHaveLength(1)

    act(() => MockIntersectionObserver.instances[0].trigger(true))
    expect(onLoadMore).toHaveBeenCalledTimes(1)

    act(() => MockIntersectionObserver.instances[0].trigger(false))
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  test('не пересоздаёт observer при изменении ссылки onLoadMore', () => {
    const { rerender } = render(<TestComponent onLoadMore={jest.fn()} hasMore isEnabled />)

    expect(MockIntersectionObserver.instances).toHaveLength(1)

    rerender(<TestComponent onLoadMore={jest.fn()} hasMore isEnabled />)

    expect(MockIntersectionObserver.instances).toHaveLength(1)
  })

  test('вызывает актуальный onLoadMore после ререндера', () => {
    const firstOnLoadMore = jest.fn()
    const secondOnLoadMore = jest.fn()

    const { rerender } = render(<TestComponent onLoadMore={firstOnLoadMore} hasMore isEnabled />)
    rerender(<TestComponent onLoadMore={secondOnLoadMore} hasMore isEnabled />)

    act(() => MockIntersectionObserver.instances[0].trigger(true))

    expect(firstOnLoadMore).not.toHaveBeenCalled()
    expect(secondOnLoadMore).toHaveBeenCalledTimes(1)
  })

  test('не создаёт observer когда hasMore=false', () => {
    render(<TestComponent onLoadMore={jest.fn()} hasMore={false} isEnabled />)

    expect(MockIntersectionObserver.instances).toHaveLength(0)
  })

  test('не создаёт observer когда isEnabled=false', () => {
    render(<TestComponent onLoadMore={jest.fn()} hasMore isEnabled={false} />)

    expect(MockIntersectionObserver.instances).toHaveLength(0)
  })

  test('отключает observer когда hasMore становится false', () => {
    const { rerender } = render(<TestComponent onLoadMore={jest.fn()} hasMore isEnabled />)
    const observer = MockIntersectionObserver.instances[0]

    rerender(<TestComponent onLoadMore={jest.fn()} hasMore={false} isEnabled />)

    expect(observer.disconnect).toHaveBeenCalledTimes(1)
  })
})
