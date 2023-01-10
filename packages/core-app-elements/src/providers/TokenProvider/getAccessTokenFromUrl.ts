import isEmpty from 'lodash/isEmpty'

export const getAccessTokenFromUrl = (): string | null => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')
    return isEmpty(accessToken) ? null : accessToken
  }

  return null
}
