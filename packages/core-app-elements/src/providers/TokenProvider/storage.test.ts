import { makeStorageKey } from './storage'

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
    window.location.hostname = 'myorg.commercelayer.app'
    const key = makeStorageKey({
      currentApp: 'imports',
      item: 'accessToken'
    })

    expect(key).to.equal('imports:myorg:accessToken')
  })
})
