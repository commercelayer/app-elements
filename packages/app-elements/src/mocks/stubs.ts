import { vi } from "vitest"

// In Node.js 25, undici performs strict instanceof checks on AbortSignal.
// jsdom replaces globalThis.AbortSignal with its own implementation, but jsdom's AbortSignal
// instances fail undici's instanceof check, causing network requests with signals to throw:
//   "RequestInit: Expected signal ("AbortSignal {}") to be an instance of AbortSignal."
//
// The Commerce Layer SDK uses AbortSignal.timeout() for request timeouts. To prevent the error
// in tests (where real timeouts are not needed), we remove AbortSignal.timeout from jsdom's
// AbortSignal so the SDK skips adding a signal to its fetch calls.
delete (AbortSignal as any).timeout

// classes, not arrows: these stubs are instantiated with `new`, and an arrow has
// no [[Construct]] — vitest >=4 no longer papers over that
class MockIntersectionObserver {
  readonly disconnect = vi.fn()
  readonly observe = vi.fn()
  readonly takeRecords = vi.fn()
  readonly unobserve = vi.fn()

  constructor(mockedCallback: IntersectionObserverCallback) {
    window.addEventListener("triggerIntersection", () => {
      mockedCallback(
        [intersectionEntry],
        this as unknown as IntersectionObserver,
      )
    })
  }
}

vi.stubGlobal(`IntersectionObserver`, MockIntersectionObserver)
vi.stubGlobal(`scrollTo`, vi.fn())

// jsdom has no ResizeObserver, and shared components observe their own size —
// `Tabs` watches its tab row to know which edge should fade when it scrolls. Stubbed
// globally rather than per suite, so rendering such a component never needs setup.
class MockResizeObserver {
  readonly observe = vi.fn()
  readonly unobserve = vi.fn()
  readonly disconnect = vi.fn()
}

vi.stubGlobal("ResizeObserver", MockResizeObserver)

const intersectionEntry = {
  isIntersecting: true,
} as unknown as IntersectionObserverEntry

vi.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (i18nKey: string) => i18nKey,
      i18n: {},
    }
  },
}))

vi.mock("i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  t: (i18nKey: string) => i18nKey,
}))
