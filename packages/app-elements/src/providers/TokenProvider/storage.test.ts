import { getPersistentAccessToken } from '#providers/TokenProvider/storage'
import { makeStorageKey, savePersistentAccessToken } from './storage'

describe('makeStorageKey', () => {
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

  test('should return the storage key for clientId', () => {
    const key = makeStorageKey({
      appSlug: 'imports',
      organizationSlug: 'myorg'
    })

    expect(key).to.equal('imports:myorg:accessToken')
  })
})

describe('getPersistentAccessToken', () => {
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
    localStorage.clear()
  })

  test('should retrieve the access token by inferring organization slug from URL', () => {
    window.location.hostname = 'demo-store.commercelayer.app'
    localStorage.setItem('orders:demo-store:accessToken', 'pre-saved-token')
    expect(
      getPersistentAccessToken({
        appSlug: 'orders'
      })
    ).toBe('pre-saved-token')
  })

  test('should retrieve the access token by using specific organization slug, ignoring URL', () => {
    window.location.hostname = 'demo-store.commercelayer.app'
    localStorage.setItem('orders:the-red-store:accessToken', 'pre-saved-token2')
    expect(
      getPersistentAccessToken({
        appSlug: 'orders',
        organizationSlug: 'the-red-store'
      })
    ).toBe('pre-saved-token2')
  })
})

describe('savePersistentAccessToken', () => {
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
    localStorage.clear()
  })

  test('should save the access token by inferring organization slug from URL', () => {
    window.location.hostname = 'demo-store.commercelayer.app'
    savePersistentAccessToken({
      accessToken: 'myAccessToken',
      appSlug: 'orders'
    })
    expect(localStorage.getItem('orders:demo-store:accessToken')).toBe(
      'myAccessToken'
    )
  })

  test('should save the access token by using specific organization slug, ignoring URL', () => {
    window.location.hostname = 'demo-store.commercelayer.app'
    savePersistentAccessToken({
      accessToken: 'myAccessToken2',
      appSlug: 'shipments',
      organizationSlug: 'blue-store'
    })
    expect(localStorage.getItem('shipments:demo-store:accessToken')).toBe(null)
    expect(localStorage.getItem('shipments:blue-store:accessToken')).toBe(
      'myAccessToken2'
    )
  })
})
