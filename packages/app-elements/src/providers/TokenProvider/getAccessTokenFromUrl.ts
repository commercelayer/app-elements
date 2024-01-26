import { type Mode } from '#providers/TokenProvider/types'
import isEmpty from 'lodash/isEmpty'
import { getInfoFromJwt } from './getInfoFromJwt'

export const getAccessTokenFromUrl = (): string | null => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')
    return isEmpty(accessToken) ? null : accessToken
  }

  return null
}

/**
 * Try to get the current mode from the access token (also if expired) or from the URL params.
 * If no mode is found, return 'live' as optimistic default.
 */
export const getCurrentMode = ({
  accessToken
}: {
  accessToken?: string | null
}): Mode => {
  if (typeof window === 'undefined') {
    return 'live'
  }

  const defaultMode = 'live'
  const modeParam = new URLSearchParams(window.location.search).get('mode')

  if (modeParam === 'test' || modeParam === 'live') {
    return modeParam
  }

  if (accessToken != null) {
    const { mode } = getInfoFromJwt(accessToken)
    return mode ?? defaultMode
  }

  return defaultMode
}

export const removeAuthParamsFromUrl = (): void => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    url.searchParams.delete('accessToken')
    url.searchParams.delete('mode')
    window.history.replaceState({}, '', url.toString())
  }
}
