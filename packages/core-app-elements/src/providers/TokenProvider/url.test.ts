import {
  getOrgSlugFromCurrentUrl,
  makeDashboardUrl,
  makeReAuthenticationUrl
} from './url'

describe('Get org slug from URL', () => {
  const { location } = window
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

  test('should get subdomain as slug', () => {
    window.location.hostname = 'my-slug.commercelayer.app'
    expect(getOrgSlugFromCurrentUrl()).toBe('my-slug')
  })

  test('should aways get the deeper domain lavel', () => {
    window.location.hostname = 'deep.subdomain.commercelayer.app'
    expect(getOrgSlugFromCurrentUrl()).toBe('deep')
  })

  test('Compute proper dashboard url get subdomain as slug', () => {
    window.location.hostname = 'my-org.commercelayer.app'
    expect(makeDashboardUrl({})).toBe(
      'https://dashboard.commercelayer.io/live/my-org'
    )
  })

  test('Compute proper dashboard url with custom domain and mode', () => {
    window.location.hostname = 'my-org.commercelayer.app'
    expect(makeDashboardUrl({ domain: 'commercelayer.co', mode: 'test' })).toBe(
      'https://dashboard.commercelayer.co/test/my-org'
    )
  })
})

describe('makeReAuthenticationUrl', () => {
  const { location } = window
  const dashboardUrl = 'https://dashboard.commercelayer.io/test/demo-store'
  beforeAll(function clearLocation() {
    delete (window as any).location
    ;(window as any).location = {
      ...location,
      href: 'http://domain.com',
      search: ''
    }
  })
  afterAll(function resetLocation() {
    window.location = location
  })

  test('should return valid url', () => {
    // @ts-expect-error
    window.location.origin = 'https://demo-store.commercelayer.app'
    window.location.pathname = '/exports/new'

    expect(makeReAuthenticationUrl(dashboardUrl, 'exports')).toBe(
      'https://dashboard.commercelayer.io/test/demo-store/hub/exports/authenticate?redirect_to=https://demo-store.commercelayer.app/exports/new'
    )
  })

  test('should return valid url when current pathname is empty', () => {
    // @ts-expect-error
    window.location.origin = 'https://demo-store.commercelayer.app'
    window.location.pathname = '/'

    expect(makeReAuthenticationUrl(dashboardUrl, 'exports')).toBe(
      'https://dashboard.commercelayer.io/test/demo-store/hub/exports/authenticate?redirect_to=https://demo-store.commercelayer.app/'
    )
  })

  test('should return undefined when dashboard url is invalid', () => {
    // @ts-expect-error
    window.location.origin = 'https://demo-store.commercelayer.app'
    window.location.pathname = '/exports/new'

    expect(makeReAuthenticationUrl('broken-url', 'exports')).toBe(undefined)
  })

  test('should return undefined when app name is invalid', () => {
    // @ts-expect-error
    window.location.origin = 'https://demo-store.commercelayer.app'
    window.location.pathname = '/exports/new'

    expect(makeReAuthenticationUrl(dashboardUrl, '')).toBe(undefined)
  })
})
