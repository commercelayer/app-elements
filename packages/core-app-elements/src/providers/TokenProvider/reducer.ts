import {
  TokenProviderAuthSettings,
  TokenProviderRolePermissions
} from './types'

interface TokenProviderInternalState {
  validAuthToken?: string
  dashboardUrl: string
  isLoading: boolean
  isTokenError: boolean
  rolePermissions: TokenProviderRolePermissions
  settings: TokenProviderAuthSettings
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
  }
}

type Action =
  | { type: 'setIsLoading'; payload: boolean }
  | { type: 'setIsTokenError'; payload: boolean }
  | { type: 'setDashboardUrl'; payload: string }
  | { type: 'setSettings'; payload: TokenProviderAuthSettings }
  | { type: 'setRolePermissions'; payload: TokenProviderRolePermissions }

export const reducer = (
  state: TokenProviderInternalState,
  action: Action
): TokenProviderInternalState => {
  switch (action.type) {
    case 'setIsLoading':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'setIsTokenError':
      return {
        ...state,
        isLoading: false,
        isTokenError: action.payload
      }
    case 'setDashboardUrl':
      return {
        ...state,
        dashboardUrl: action.payload
      }
    case 'setSettings':
      return {
        ...state,
        isLoading: false,
        settings: action.payload
      }
    case 'setRolePermissions':
      return {
        ...state,
        rolePermissions: action.payload
      }
    default:
      return state
  }
}
