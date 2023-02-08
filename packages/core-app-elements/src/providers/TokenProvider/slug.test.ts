import { getOrgSlugFromCurrentUrl, makeDashboardUrl } from './slug'

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
