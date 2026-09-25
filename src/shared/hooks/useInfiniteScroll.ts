import { useEffect, useRef } from 'react'

interface UseInfiniteScrollProps {
  onLoadMore: () => void
  hasMore: boolean
  isEnabled?: boolean
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isEnabled = true,
}: UseInfiniteScrollProps) {
  const onLoadMoreRef = useRef(onLoadMore)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    if (!isEnabled || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onLoadMoreRef.current()
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0,
      },
    )

    const sentinel = sentinelRef.current
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => observer.disconnect()
  }, [hasMore, isEnabled])

  return sentinelRef
}
