import { useEffect, useRef } from 'react'

interface UseInfiniteScrollProps {
  onLoadMore: () => void
  hasMore: boolean
  isEnabled?: boolean
}

export function useInfiniteScroll({ onLoadMore, hasMore, isEnabled = true }: UseInfiniteScrollProps) {
  const observer = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isEnabled || !hasMore) return

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
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
      observer.current.observe(sentinel)
    }

    return () => {
      if (observer.current && sentinel) {
        observer.current.unobserve(sentinel)
      }
    }
  }, [onLoadMore, hasMore, isEnabled])

  return sentinelRef
}
