import { render, waitFor, type RenderResult } from '@testing-library/react'
import { TokenProvider, type TokenProviderProps } from './TokenProvider'

// token expires at Monday, 6 February 2023 11:53:19
// slug is `giuseppe`
// kind is `integration`
const accessTokenKindIntegration =
  'eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJrUk1lakZXalpSIiwic2x1ZyI6ImdpdXNlcHBlIiwiZW50ZXJwcmlzZSI6ZmFsc2V9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkFwUGtaaWxWQk0iLCJraW5kIjoiaW50ZWdyYXRpb24iLCJwdWJsaWMiOmZhbHNlfSwidGVzdCI6dHJ1ZSwiZXhwIjoxNjc1Njg0Mzk5LCJyYW5kIjowLjg1ODA5MzgzOTA3OTQ1OTYsImlzcyI6Imh0dHBzOi8vYXV0aC5jb21tZXJjZWxheWVyLmlvIn0.fake-signature-test'
const accessTokenKindImports =
  'eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJrUk1lakZXalpSIiwic2x1ZyI6ImdpdXNlcHBlIiwiZW50ZXJwcmlzZSI6ZmFsc2V9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkFwUGtaaWxWQk0iLCJraW5kIjoiaW1wb3J0cyIsInB1YmxpYyI6ZmFsc2V9LCJ0ZXN0Ijp0cnVlLCJleHAiOjE2NzU2ODQzOTksInJhbmQiOjAuODU4MDkzODM5MDc5NDU5NiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmNvbW1lcmNlbGF5ZXIuaW8ifQ.fake-signature-test'
const accessTokenLive =
  'eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJrUk1lakZXalpSIiwic2x1ZyI6ImdpdXNlcHBlIiwiZW50ZXJwcmlzZSI6ZmFsc2V9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkFwUGtaaWxWQk0iLCJraW5kIjoiaW1wb3J0cyIsInB1YmxpYyI6ZmFsc2V9LCJ0ZXN0IjpmYWxzZSwiZXhwIjoxNjc1Njg0Mzk5LCJyYW5kIjowLjg1ODA5MzgzOTA3OTQ1OTYsImlzcyI6Imh0dHBzOi8vYXV0aC5jb21tZXJjZWxheWVyLmlvIn0.fake-signature-live'
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
    <div data-testid={id}>
      <TokenProvider {...props}>
        {({ settings: { mode }, user, canAccess }) => (
          <div>
            <p>mode: {mode}</p>
            <p>timezone: {user?.timezone}</p>
            <p>email: {user?.email}</p>
            <p>firstName: {user?.firstName}</p>
            <p>lastName: {user?.lastName}</p>
            <p>displayName: {user?.displayName}</p>
            <p>fullName: {user?.fullName}</p>
            <p>can access orders: {canAccess('orders') ? 'yes' : 'no'}</p>
            <p>can access exports: {canAccess('exports') ? 'yes' : 'no'}</p>
            <p>can access imports: {canAccess('imports') ? 'yes' : 'no'}</p>
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

  test('Should read token from props (kind: imports)', async () => {
    vi.useFakeTimers({ toFake: ['Date'] }).setSystemTime(validDateNow)
    window.location.hostname = 'giuseppe.commercelayer.app'
    const onInvalidAuth = vi.fn()

    const { element, getByText } = setup({
      id: 'token-provider',
      kind: 'imports',
      appSlug: 'imports',
      devMode: false,
      accessToken: accessTokenKindImports,
      onInvalidAuth,
      loadingElement: <div>Loading...</div>
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

    expect(getByText('can access orders: yes')).toBeVisible()
    expect(getByText('can access exports: no')).toBeVisible()
    expect(getByText('can access imports: yes')).toBeVisible()

    expect(onInvalidAuth).toHaveBeenCalledTimes(0)
  })

  test('Should read token from props (kind: integration)', async () => {
    vi.useFakeTimers({ toFake: ['Date'] }).setSystemTime(validDateNow)
    window.location.hostname = 'giuseppe.commercelayer.app'
    const onInvalidAuth = vi.fn()

    const { element, getByText } = setup({
      id: 'token-provider',
      kind: 'integration',
      appSlug: 'imports',
      devMode: false,
      accessToken: accessTokenKindIntegration,
      onInvalidAuth,
      loadingElement: <div>Loading...</div>
    })
    expect(element).toBeVisible()
    expect(getByText('Loading...')).toBeVisible()
    await waitFor(() => {
      expect(getByText('content')).toBeVisible()
    })
    expect(getByText('mode: test')).toBeVisible()
    expect(getByText('can access orders: yes')).toBeVisible()
    expect(getByText('can access exports: yes')).toBeVisible()
    expect(getByText('can access imports: yes')).toBeVisible()

    expect(onInvalidAuth).toHaveBeenCalledTimes(0)
  })

  test('Should return live mode if token comes from live environment', async () => {
    vi.useFakeTimers({ toFake: ['Date'] }).setSystemTime(validDateNow)
    window.location.hostname = 'giuseppe.commercelayer.app'
    const onInvalidAuth = vi.fn()

    const { getByText } = setup({
      id: 'token-provider',
      kind: 'imports',
      appSlug: 'imports',
      devMode: false,
      accessToken: accessTokenLive,
      onInvalidAuth
    })
    await waitFor(() => {
      expect(getByText('mode: live')).toBeVisible()
    })
  })

  test('Should read token from url', async () => {
    vi.useFakeTimers({ toFake: ['Date'] }).setSystemTime(validDateNow)
    window.location.hostname = 'giuseppe.commercelayer.app'
    window.location.search = `?accessToken=${accessTokenKindImports}`
    const onInvalidAuth = vi.fn()

    const { element, getByText } = setup({
      id: 'token-provider',
      kind: 'imports',
      appSlug: 'imports',
      devMode: false,
      onInvalidAuth,
      loadingElement: <div>Loading...</div>
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
    vi.useFakeTimers({ toFake: ['Date'] }).setSystemTime(expiredDateNow)
    const onInvalidAuth = vi.fn()

    const { getByText } = setup({
      id: 'token-provider',
      kind: 'imports',
      appSlug: 'imports',
      devMode: false,
      accessToken: accessTokenKindImports,
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
    vi.useFakeTimers({ toFake: ['Date'] }).setSystemTime(validDateNow)
    const onInvalidAuth = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const { getByText } = setup({
      id: 'token-provider',
      kind: 'sales_channel',
      appSlug: 'imports',
      devMode: false,
      loadingElement: <div>fetching token info</div>,
      errorElement: <div>custom error element</div>,
      accessToken: accessTokenKindImports,
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
    vi.useFakeTimers({ toFake: ['Date'] }).setSystemTime(validDateNow)
    const onInvalidAuth = vi.fn()

    const { getByTestId, getByText } = render(
      <div data-testid='token-provider'>
        <TokenProvider
          kind='imports'
          appSlug='imports'
          devMode
          accessToken={accessTokenKindImports}
          onInvalidAuth={onInvalidAuth}
          loadingElement={<div>Loading...</div>}
        >
          {({ emitInvalidAuth }) => {
            return (
              <div>
                <div>This is my app</div>
                <button
                  data-testid='btn-emit-error'
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
    vi.useFakeTimers({ toFake: ['Date'] }).setSystemTime(validDateNow)
    const { getByText } = setup({
      id: 'token-provider',
      kind: 'imports',
      appSlug: 'imports',
      devMode: true,
      accessToken: accessTokenKindImports,
      onInvalidAuth: () => {}
    })
    await waitFor(() => {
      expect(getByText('content')).toBeVisible()
    })
  })

  test('Should read persistent token', async () => {
    vi.useFakeTimers({ toFake: ['Date'] }).setSystemTime(validDateNow)
    const { getByText } = setup({
      id: 'token-provider',
      kind: 'imports',
      appSlug: 'imports',
      devMode: true,
      onInvalidAuth: () => {}
    })
    await waitFor(() => {
      expect(getByText('content')).toBeVisible()
    })
  })
})
