import { getPersistentJWT, makeStorageKey, savePersistentJWT } from './storage'

describe('makeStorageKey', () => {
  test('should return the storage key for access token', () => {
    const key = makeStorageKey({
      appSlug: 'imports',
      organizationSlug: 'myorg',
      itemType: 'accessToken'
    })

    expect(key).toEqual('imports:myorg:accessToken')
  })

  test('should return the storage key for extras', () => {
    const key = makeStorageKey({
      appSlug: 'imports',
      organizationSlug: 'myorg',
      itemType: 'extras'
    })

    expect(key).toEqual('imports:myorg:extras')
  })
})

describe('getPersistentJWT', () => {
  test('should retrieve the access token by inferring organization slug from URL', () => {
    localStorage.setItem('orders:commercelayer:accessToken', 'pre-saved-token')
    expect(
      getPersistentJWT({
        appSlug: 'orders',
        itemType: 'accessToken'
      })
    ).toBe('pre-saved-token')
  })

  test('should retrieve the access token by using specific organization slug, ignoring URL', () => {
    localStorage.setItem('orders:the-red-store:accessToken', 'pre-saved-token2')
    expect(
      getPersistentJWT({
        appSlug: 'orders',
        organizationSlug: 'the-red-store',
        itemType: 'accessToken'
      })
    ).toBe('pre-saved-token2')
  })
})

describe('savePersistentAccessToken', () => {
  test('should save the access token by using specific organization slug', () => {
    savePersistentJWT({
      jwt: 'myAccessToken2',
      appSlug: 'shipments',
      organizationSlug: 'blue-store',
      itemType: 'accessToken'
    })
    expect(localStorage.getItem('shipments:demo-store:accessToken')).toBe(null)
    expect(localStorage.getItem('shipments:blue-store:accessToken')).toBe(
      'myAccessToken2'
    )
  })
})
