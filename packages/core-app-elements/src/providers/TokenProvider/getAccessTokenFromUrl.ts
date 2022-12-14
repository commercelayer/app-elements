import { isEmpty } from 'lodash-es'

export const getAccessTokenFromUrl = (): string | null => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')
    return isEmpty(accessToken) ? null : accessToken
  }

  return null
}
