import { getPersistentAccessToken } from '#providers/TokenProvider/storage'
import { makeStorageKey, savePersistentAccessToken } from './storage'

describe('makeStorageKey', () => {
  test('should return the storage key for clientId', () => {
    const key = makeStorageKey({
      appSlug: 'imports',
      organizationSlug: 'myorg'
    })

    expect(key).to.equal('imports:myorg:accessToken')
  })
})

describe('getPersistentAccessToken', () => {
  test('should retrieve the access token by inferring organization slug from URL', () => {
    localStorage.setItem('orders:commercelayer:accessToken', 'pre-saved-token')
    expect(
      getPersistentAccessToken({
        appSlug: 'orders'
      })
    ).toBe('pre-saved-token')
  })

  test('should retrieve the access token by using specific organization slug, ignoring URL', () => {
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
  test('should save the access token by using specific organization slug', () => {
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
