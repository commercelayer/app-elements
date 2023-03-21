import { vi } from 'vitest'

const MockIntersectionObserver = vi.fn(
  (mockedCallback: IntersectionObserverCallback) => {
    window.addEventListener('triggerIntersection', () => {
      mockedCallback(
        [intersectionEntry],
        vi.fn() as unknown as IntersectionObserver
      )
    })

    return {
      disconnect: vi.fn(),
      observe: vi.fn(),
      takeRecords: vi.fn(),
      unobserve: vi.fn()
    }
  }
)

vi.stubGlobal(`IntersectionObserver`, MockIntersectionObserver)

const intersectionEntry = {
  isIntersecting: true
} as unknown as IntersectionObserverEntry
