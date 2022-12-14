import { getAccessTokenFromUrl } from './getAccessTokenFromUrl'

describe('Read JWT from URL', () => {
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
    window.location.search = '?accessToken=eyJhbGciOiJIUzUxMiJ9'
    expect(getAccessTokenFromUrl()).toBe('eyJhbGciOiJIUzUxMiJ9')
  })

  test('accessToken exists un URL along with other params', () => {
    window.location.search =
      '?foo=bar&accessToken=eyJhbGciOiJIUzUxMiJ9&client=abc123'
    expect(getAccessTokenFromUrl()).toBe('eyJhbGciOiJIUzUxMiJ9')
  })

  test('accessToken is empty', () => {
    window.location.search = '?accessToken='
    expect(getAccessTokenFromUrl()).toBe(null)
  })

  test('Query string is empty', () => {
    window.location.search = ''
    expect(getAccessTokenFromUrl()).toBe(null)
  })
})
