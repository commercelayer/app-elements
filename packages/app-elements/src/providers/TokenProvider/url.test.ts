import { isProductionHostname } from './url'

describe('isProductionHostname', () => {
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

  test('should return true for production hostnames', () => {
    ;[
      'org.commercelayer.app',
      'org-123.commercelayer.app',
      '123-456.commercelayer.app',
      'dashboard.commercelayer.io',
      '_org.commercelayer.app',
      'org_.commercelayer.app',
      'org-_.commercelayer.app',
      'org_-.commercelayer.app',
      '123.commercelayer.app',
      'org123.commercelayer.app'
    ].forEach((hostname) => {
      window.location.hostname = hostname
      expect(isProductionHostname()).toBe(true)
    })
  })

  test('should return false for non-production hostnames', () => {
    ;[
      'demo-store.stg.commercelayer.app',
      'demo-store.stg.commercelayer.app.test',
      'org.dashboard.commercelayer.io',
      'dashboard.commercelayer.io.test'
    ].forEach((hostname) => {
      window.location.hostname = hostname
      expect(isProductionHostname()).toBe(false)
    })
  })
})
