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
