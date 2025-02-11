import {
  AuthContext,
  type TokenProviderProps,
  type TokenProviderValue
} from './TokenProvider'

export function MockTokenProvider({
  children,
  isInDashboard,
  onAppClose
}: TokenProviderProps): JSX.Element {
  const value: TokenProviderValue = {
    settings: {
      accessToken: '1234',
      domain: 'localhost',
      mode: 'test',
      organizationSlug: 'mock',
      appSlug: 'elements',
      isInDashboard: Boolean(isInDashboard),
      dashboardUrl: '',
      onAppClose
    },
    user: {
      displayName: 'J. Doe',
      email: 'john.doe@commercelayer.io',
      firstName: 'John',
      fullName: 'John Doe',
      id: '1234',
      lastName: 'Doe',
      timezone: 'Europe/Rome',
      locale: 'en-US'
    },
    organization: {
      id: '1234',
      name: 'Commerce Layer',
      slug: 'mock',
      type: 'organizations',
      created_at: '2021-01-01T00:00:00.000Z',
      updated_at: '2021-01-01T00:00:00.000Z'
    },
    canUser: (action, resource) => true,
    canAccess: () => true,
    emitInvalidAuth: () => {}
  }

  return (
    <AuthContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </AuthContext.Provider>
  )
}

MockTokenProvider.displayName = 'TokenProvider'
