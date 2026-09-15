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