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

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (i18nKey: string) => i18nKey,
      i18n: {}
    }
  }
}))

vi.mock('i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  t: (i18nKey: string) => i18nKey
}))
