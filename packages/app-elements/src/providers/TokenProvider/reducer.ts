import { type TokenProviderAllowedApp } from '#providers/TokenProvider'
import { type Organization } from '@commercelayer/sdk'
import {
  type TokenProviderAuthSettings,
  type TokenProviderAuthUser,
  type TokenProviderRolePermissions
} from './types'

interface TokenProviderInternalState {
  validAuthToken?: string
  dashboardUrl: string
  isLoading: boolean
  isTokenError: boolean
  rolePermissions: TokenProviderRolePermissions
  accessibleApps: TokenProviderAllowedApp[]
  settings: TokenProviderAuthSettings
  user: TokenProviderAuthUser | null
  organization: Organization | null
}

export const initialTokenProviderState: TokenProviderInternalState = {
  validAuthToken: undefined,
  dashboardUrl: 'https://dashboard.commercelayer.io/',
  isLoading: true,
  isTokenError: false,
  rolePermissions: {},
  accessibleApps: [],
  settings: {
    mode: 'test',
    accessToken: '',
    domain: 'commercelayer.io',
    organizationSlug: '',
    appSlug: ''
  },
  user: null,
  organization: null
}

type Action =
  | { type: 'invalidAuth' }
  | {
      type: 'validToken'
      payload: {
        settings: TokenProviderAuthSettings
        user: TokenProviderAuthUser | null
        organization: Organization | null
        rolePermissions: TokenProviderRolePermissions
        accessibleApps: TokenProviderAllowedApp[]
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
