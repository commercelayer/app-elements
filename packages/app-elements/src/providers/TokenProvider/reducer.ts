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
  user: TokenProviderAuthUser | null
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
  user: null
}

type Action =
  | { type: 'invalidAuth' }
  | {
      type: 'validToken'
      payload: {
        settings: TokenProviderAuthSettings
        user: TokenProviderAuthUser | null
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
        isLoading: false
      }
    default:
      return state
  }
}
