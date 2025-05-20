import { type TokenProviderClAppSlug } from '#providers/TokenProvider'
import {
  type TokenProviderAuthSettings,
  type TokenProviderAuthUser,
  type TokenProviderRolePermissions
} from './types'

interface TokenProviderInternalState {
  validAuthToken?: string
  isLoading: boolean
  isTokenError: boolean
  rolePermissions: TokenProviderRolePermissions
  accessibleApps: TokenProviderClAppSlug[]
  settings: TokenProviderAuthSettings
  user: TokenProviderAuthUser | null
}

export const initialTokenProviderState: TokenProviderInternalState = {
  validAuthToken: undefined,
  isLoading: true,
  isTokenError: false,
  rolePermissions: {},
  accessibleApps: [],
  settings: {
    mode: 'test',
    accessToken: '',
    domain: 'commercelayer.io',
    organizationSlug: '',
    appSlug: '',
    isInDashboard: false,
    dashboardUrl: 'https://dashboard.commercelayer.io/'
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
        accessibleApps: TokenProviderClAppSlug[]
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
