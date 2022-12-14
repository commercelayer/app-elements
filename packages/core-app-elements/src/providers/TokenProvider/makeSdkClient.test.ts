import { makeSdkClient } from './makeSdkClient'

describe('makeSdkClient', () => {
  it('should return a valid sdk client', () => {
    const sdkClient = makeSdkClient({
      accessToken: 'xxx',
      organization: 'xxx',
      onInvalidToken: () => {}
    })
    expect(sdkClient).toHaveProperty('skus')
    expect(sdkClient).toHaveProperty('addResponseInterceptor')
    expect(sdkClient).toHaveProperty('addRequestInterceptor')
    expect(sdkClient).toHaveProperty('removeInterceptor')
    expect(sdkClient).toBeInstanceOf(Object)
  })
})
