import '@testing-library/jest-dom'

if (!window.PointerEvent) {
  window.PointerEvent =
    MouseEvent as typeof PointerEvent
}

if (!window.ResizeObserver) {
  window.ResizeObserver =
    class ResizeObserver {
      observe() {}

      unobserve() {}

      disconnect() {}
    }
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class IntersectionObserver {
    root = null
    rootMargin = ''
    thresholds = []

    constructor(_callback: () => void) {}

    observe() {}

    disconnect() {}

    takeRecords() {
      return []
    }

    unobserve() {}
  } as unknown as typeof IntersectionObserver
}

Object.defineProperties(
  HTMLElement.prototype,
  {
    hasPointerCapture: {
      configurable: true,
      value: () => false,
    },

    setPointerCapture: {
      configurable: true,
      value: () => undefined,
    },

    releasePointerCapture: {
      configurable: true,
      value: () => undefined,
    },

    scrollIntoView: {
      configurable: true,
      value: () => undefined,
    },
  },
)