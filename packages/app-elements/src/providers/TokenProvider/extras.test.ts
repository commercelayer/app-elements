import { isValidUser } from '#providers/TokenProvider/extras'
import { decodeExtras, encodeExtras, getExtrasFromUrl } from './extras'
import type { TokenProviderExtras } from './types'

describe('TokenProviderExtras encoding and decoding', () => {
  const extras: TokenProviderExtras = {
    salesChannels: [
      { name: 'Channel1', client_id: 'client1' },
      { name: 'Channel2', client_id: 'client2' }
    ],
    limits: {
      markets: 5,
      memberships: 10,
      organizations: 3,
      skus: 1000
    }
  }

  test('should encode extras to a Base64 string', () => {
    expect(encodeExtras(extras)).toBe(
      'eyJzYWxlc0NoYW5uZWxzIjpbeyJuYW1lIjoiQ2hhbm5lbDEiLCJjbGllbnRfaWQiOiJjbGllbnQxIn0seyJuYW1lIjoiQ2hhbm5lbDIiLCJjbGllbnRfaWQiOiJjbGllbnQyIn1dLCJsaW1pdHMiOnsibWFya2V0cyI6NSwibWVtYmVyc2hpcHMiOjEwLCJvcmdhbml6YXRpb25zIjozLCJza3VzIjoxMDAwfX0'
    )
  })

  test('should decode a Base64 string back to the original extras object', () => {
    const encoded = encodeExtras(extras)
    const decoded = decodeExtras(encoded)
    expect(decoded).toEqual(extras)
  })

  test('should handle empty extras object', () => {
    const encoded = encodeExtras({})
    const decoded = decodeExtras(encoded)
    expect(decoded).toEqual({})
  })

  test('should handle extras with only salesChannels', () => {
    const salesChannelsOnly: TokenProviderExtras = {
      salesChannels: [{ name: 'Channel1', client_id: 'client1' }]
    }
    const encoded = encodeExtras(salesChannelsOnly)
    const decoded = decodeExtras(encoded)
    expect(decoded).toEqual(salesChannelsOnly)
  })

  test('should handle extras with only limits', () => {
    const limitsOnly: TokenProviderExtras = {
      limits: {
        markets: 5,
        memberships: 10,
        organizations: 3,
        skus: 1000
      }
    }
    const encoded = encodeExtras(limitsOnly)
    const decoded = decodeExtras(encoded)
    expect(decoded).toEqual(limitsOnly)
  })
})

describe('getExtrasFromUrl', () => {
  const { location } = window
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

  test('accessToken exists in URL params', () => {
    window.location.search = '?extras=eyJzYWxlc0NoYW5uZWxzIjpbeyJuYW1lIjoiQ'
    expect(getExtrasFromUrl()).toBe('eyJzYWxlc0NoYW5uZWxzIjpbeyJuYW1lIjoiQ')
  })
})

describe('Encode object > Add in URL query string > Decode it from URL', () => {
  const { location } = window
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

  test('extras exists in URL params', () => {
    const extras: TokenProviderExtras = {
      salesChannels: [
        { name: 'Channel1', client_id: 'client1' },
        { name: 'Channel2', client_id: 'client2' }
      ],
      limits: {
        markets: 5,
        memberships: 10,
        organizations: 3,
        skus: 1000
      }
    }

    const encoded = encodeExtras(extras)
    window.location.search = `?extras=${encoded}&foo=bar`
    const decoded = decodeExtras(getExtrasFromUrl())
    expect(decoded).toEqual(extras)
  })

  test('extras does not exists in URL params', () => {
    window.location.search = '?foo=bar'
    expect(decodeExtras(getExtrasFromUrl())).toEqual(undefined)
  })
})

describe('isValidUser', () => {
  test('should return true if user is valid', () => {
    const user = {
      id: '1',
      email: 'john@doe.com',
      displayName: 'J.Doe',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      timezone: 'UTC',
      locale: 'en-US'
    } as const
    expect(isValidUser(user)).toBe(true)
  })

  test('should return false if user is null', () => {
    expect(isValidUser(null)).toBe(false)
  })

  test('should return false if user is undefined', () => {
    expect(isValidUser(undefined)).toBe(false)
  })

  test('should return false if user is empty', () => {
    // @ts-expect-error mismatching type for testing invalid user
    expect(isValidUser({})).toBe(false)
  })

  test('should return false if user is missing keys', () => {
    const user = {
      id: '1',
      email: 'john@doe.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      timezone: 'UTC'
    }
    // @ts-expect-error mismatching type for testing invalid user
    expect(isValidUser(user)).toBe(false)
  })
})
