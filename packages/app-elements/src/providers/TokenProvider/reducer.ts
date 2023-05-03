import { computeFullname, formatDisplayName } from '#helpers/name'
import {
  type TokenProviderAuthUser,
  type TokenProviderAuthSettings,
  type TokenProviderRolePermissions
} from './types'

interface TokenProviderInternalState {
  validAuthToken?: string
  dashboardUrl: string
  isLoading: boolean
  isTokenError: boolean
  rolePermissions: TokenProviderRolePermissions
  settings: TokenProviderAuthSettings
  user: TokenProviderAuthUser
}

export const initialTokenProviderState: TokenProviderInternalState = {
  validAuthToken: undefined,
  dashboardUrl: 'https://dashboard.commercelayer.io/',
  isLoading: true,
  isTokenError: false,
  rolePermissions: {},
  settings: {
    mode: 'test',
    accessToken: '',
    domain: 'commercelayer.io',
    organizationSlug: ''
  },
  user: {}
}

type Action =
  | { type: 'invalidAuth' }
  | {
      type: 'validToken'
      payload: {
        settings: TokenProviderAuthSettings
        user: TokenProviderAuthUser
        rolePermissions: TokenProviderRolePermissions
      }
    }

export const reducer = (
  state: TokenProviderInternalState,
  action: Action
): TokenProviderInternalState => {
  switch (action.type) {
    case 'invalidAuth':
      return {
        ...state,
        isLoading: false,
        isTokenError: true
      }
    case 'validToken':
      return {
        ...state,
        ...action.payload,
        user: {
          ...action.payload.user,
          displayName: formatDisplayName(
            action.payload.user.firstName,
            action.payload.user.lastName
          ),
          fullName: computeFullname(
            action.payload.user.firstName,
            action.payload.user.lastName
          )
        },
        isLoading: false
      }
    default:
      return state
  }
}
