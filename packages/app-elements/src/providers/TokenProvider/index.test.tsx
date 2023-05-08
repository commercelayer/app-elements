import { TokenProvider, type TokenProviderProps } from './index'
import { render, type RenderResult, waitFor } from '@testing-library/react'

// token expires at Monday, 6 February 2023 11:53:19
// slug is `giuseppe`
// kind is `integration`
const accessToken =
  'eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJrUk1lakZXalpSIiwic2x1ZyI6ImdpdXNlcHBlIiwiZW50ZXJwcmlzZSI6ZmFsc2V9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkFwUGtaaWxWQk0iLCJraW5kIjoiaW50ZWdyYXRpb24iLCJwdWJsaWMiOmZhbHNlfSwidGVzdCI6dHJ1ZSwiZXhwIjoxNjc1Njg0Mzk5LCJyYW5kIjowLjg1ODA5MzgzOTA3OTQ1OTZ9.fake-signature-test'
const accessTokenLive =
  'eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJrUk1lakZXalpSIiwic2x1ZyI6ImdpdXNlcHBlIiwiZW50ZXJwcmlzZSI6ZmFsc2V9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkFwUGtaaWxWQk0iLCJraW5kIjoiaW50ZWdyYXRpb24iLCJwdWJsaWMiOmZhbHNlfSwidGVzdCI6dHJ1ZSwiZXhwIjoxNjc1Njg0Mzk5LCJyYW5kIjowLjg1ODA5MzgzOTA3OTQ1OTZ9.fake-signature-live'
const validDateNow = new Date('2023-02-06T10:00:00.000Z')
const expiredDateNow = new Date('2023-02-10T10:00:00.000Z')

interface SetupProps extends Omit<TokenProviderProps, 'children'> {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...props }: SetupProps): SetupResult => {
  const utils = render(
    <div data-test-id={id}>
      <TokenProvider {...props}>
        {({ settings: { mode }, user }) => (
          <div>
            <p>mode: {mode}</p>
            <p>timezone: {user?.timezone}</p>
            <p>email: {user?.email}</p>
            <p>firstName: {user?.firstName}</p>
            <p>lastName: {user?.lastName}</p>
            <p>displayName: {user?.displayName}</p>
            <p>fullName: {user?.fullName}</p>
            <p>content</p>
          </div>
        )}
      </TokenProvider>
    </div>
  )
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('TokenProvider', () => {
  const { location } = window
  beforeEach(() => {
    localStorage.clear()
  })
  beforeAll(function clearLocation() {
    delete (window as any).location
    ;(window as any).location = {
      ...location,
      hostname: ''
    }
  })
  afterAll(function resetLocation() {
    window.location = location
  })

  test('Should read token from props', async () => {
    vi.useFakeTimers().setSystemTime(validDateNow)
    window.location.hostname = 'giuseppe.commercelayer.app'
    const onInvalidAuth = vi.fn()

    const { element, getByText } = setup({
      id: 'token-provider',
      clientKind: 'integration',
      currentApp: 'imports',
      devMode: false,
      accessToken,
      onInvalidAuth
    })
    expect(element).toBeVisible()
    expect(getByText('Loading...')).toBeVisible()
    await waitFor(() => {
      expect(getByText('content')).toBeVisible()
    })
    expect(getByText('mode: test')).toBeVisible()
    expect(getByText('timezone: Europe/Rome')).toBeVisible()
    expect(getByText('email: user@commercelayer.io')).toBeVisible()
    expect(getByText('firstName: Ringo')).toBeVisible()
    expect(getByText('lastName: Starr')).toBeVisible()
    expect(getByText('displayName: R. Starr')).toBeVisible()
    expect(getByText('fullName: Ringo Starr')).toBeVisible()
    expect(onInvalidAuth).toBeCalledTimes(0)
  })

  test('Should return live mode if token comes from live environment', async () => {
    vi.useFakeTimers().setSystemTime(validDateNow)
    window.location.hostname = 'giuseppe.commercelayer.app'
    const onInvalidAuth = vi.fn()

    const { getByText } = setup({
      id: 'token-provider',
      clientKind: 'integration',
      currentApp: 'imports',
      devMode: false,
      accessToken: accessTokenLive,
      onInvalidAuth
    })
    await waitFor(() => {
      expect(getByText('mode: live')).toBeVisible()
    })
  })

  test('Should read token from url', async () => {
    vi.useFakeTimers().setSystemTime(validDateNow)
    window.location.hostname = 'giuseppe.commercelayer.app'
    window.location.search = `?accessToken=${accessToken}`
    const onInvalidAuth = vi.fn()

    const { element, getByText } = setup({
      id: 'token-provider',
      clientKind: 'integration',
      currentApp: 'imports',
      devMode: false,
      onInvalidAuth
    })
    expect(element).toBeVisible()
    expect(getByText('Loading...')).toBeVisible()
    await waitFor(() => {
      expect(getByText('content')).toBeVisible()
    })
    expect(onInvalidAuth).toBeCalledTimes(0)
  })

  test('Should trigger expired token', async () => {
    // faking expired date
    vi.useFakeTimers().setSystemTime(expiredDateNow)
    const onInvalidAuth = vi.fn()

    const { getByText } = setup({
      id: 'token-provider',
      clientKind: 'integration',
      currentApp: 'imports',
      devMode: false,
      accessToken,
      onInvalidAuth
    })
    await waitFor(() => {
      expect(getByText('Invalid token')).toBeVisible()
    })
    expect(onInvalidAuth).toHaveBeenCalledWith({
      dashboardUrl: 'https://dashboard.commercelayer.io/test/giuseppe',
      reason: 'accessToken is expired'
    })
  })

  test('Should trigger invalid when `kind` is not matched', async () => {
    vi.useFakeTimers().setSystemTime(validDateNow)
    const onInvalidAuth = vi.fn()

    const { getByText } = setup({
      id: 'token-provider',
      clientKind: 'sales_channel',
      currentApp: 'imports',
      devMode: false,
      loadingElement: <div>fetching token info</div>,
      errorElement: <div>custom error element</div>,
      accessToken,
      onInvalidAuth
    })
    expect(getByText('fetching token info')).toBeVisible()
    await waitFor(() => {
      expect(getByText('custom error element')).toBeVisible()
    })
    expect(onInvalidAuth).toHaveBeenCalledWith({
      dashboardUrl: 'https://dashboard.commercelayer.io/test/giuseppe',
      reason: 'accessToken is not valid'
    })
  })

  test('Should be able to receive an emitInvalidAuth event', async () => {
    vi.useFakeTimers().setSystemTime(validDateNow)
    const onInvalidAuth = vi.fn()

    const { getByTestId, getByText } = render(
      <div data-test-id='token-provider'>
        <TokenProvider
          clientKind='integration'
          currentApp='imports'
          devMode
          accessToken={accessToken}
          onInvalidAuth={onInvalidAuth}
        >
          {({ emitInvalidAuth }) => {
            return (
              <div>
                <div>This is my app</div>
                <button
                  data-test-id='btn-emit-error'
                  onClick={() => {
                    emitInvalidAuth('custom error trigger')
                  }}
                >
                  show error ui
                </button>
              </div>
            )
          }}
        </TokenProvider>
      </div>
    )

    expect(getByTestId('token-provider')).toBeVisible()
    expect(getByText('Loading...')).toBeVisible()
    await waitFor(() => {
      expect(getByTestId('btn-emit-error')).toBeVisible()
    })
    getByTestId('btn-emit-error').click()
    await waitFor(() => {
      expect(getByText('Invalid token')).toBeVisible()
    })
    expect(onInvalidAuth).toHaveBeenCalledWith({
      dashboardUrl: 'https://dashboard.commercelayer.io/test/giuseppe',
      reason: 'custom error trigger'
    })
  })
})

describe('TokenProvider and localStorage', () => {
  test('Should save persistent token', async () => {
    vi.useFakeTimers().setSystemTime(validDateNow)
    const { getByText } = setup({
      id: 'token-provider',
      clientKind: 'integration',
      currentApp: 'imports',
      devMode: true,
      accessToken,
      onInvalidAuth: () => {}
    })
    await waitFor(() => {
      expect(getByText('content')).toBeVisible()
    })
  })

  test('Should read persistent token', async () => {
    vi.useFakeTimers().setSystemTime(validDateNow)
    const { getByText } = setup({
      id: 'token-provider',
      clientKind: 'integration',
      currentApp: 'imports',
      devMode: true,
      onInvalidAuth: () => {}
    })
    await waitFor(() => {
      expect(getByText('content')).toBeVisible()
    })
  })
})
