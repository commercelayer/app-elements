import type { ParsedScopes } from '#providers/TokenProvider/getInfoFromJwt'
import type { ListableResourceType } from '@commercelayer/sdk'

export type TokenProviderClAppSlug =
  | 'bundles'
  | 'customers'
  | 'exports'
  | 'gift_cards'
  | 'imports'
  | 'inventory'
  | 'orders'
  | 'price_lists'
  | 'promotions'
  | 'returns'
  | 'shipments'
  | 'sku_lists'
  | 'skus'
  | 'stock_transfers'
  | 'subscriptions'
  | 'tags'
  | 'webhooks'

/**
 * TokenProviderAllowedApp is a type that contains all the possible kinds of the app that you can create inside the dashboard.
 * As a convention Commerce Layer official apps have a slug that matches the kind of the app.
 */
export type TokenProviderAllowedAppKind = TokenProviderClAppSlug | 'generic'

/**
 * @deprecated Use `TokenProviderAllowedAppKind` instead.
 */
export type TokenProviderAllowedApp = TokenProviderAllowedAppKind

/**
 * The application slug. It could match one of the allowed apps or a custom string.
 * It is used as the app identifier (e.g. storage key).
 */
export type TokenProviderAllowedAppSlug =
  | TokenProviderClAppSlug
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {})

/**
 * TokenProviderTokenApplicationKind is a type that contains all the suitable api credential kinds.
 * Depending on the kind, it could be used to identify:
 * - an authentication api credential (eg. `integration`, `sales_channel`, `webapp`)
 * - a particular feature in the dashboard (eg. `resources`, `links`)
 * - an app with its dedicated set of permissions (eg. `order`, `customers`, etc...)
 */
export type TokenProviderTokenApplicationKind =
  | 'integration'
  | 'sales_channel'
  | 'webapp'
  | 'resources'
  | 'links'
  | TokenProviderAllowedAppKind

export type TokenProviderRoleActions = 'create' | 'destroy' | 'read' | 'update'

export type TokenProviderPermissionItem = Record<
  TokenProviderRoleActions,
  boolean
>
export type TokenProviderRolePermissions = Partial<
  Record<ListableResourceType | 'organizations', TokenProviderPermissionItem>
>

interface CoreApiOwnerUser {
  type: 'User'
  id: string
  first_name: string
  last_name: string
  email: string
  owner: boolean
  time_zone: string
}

interface CoreApiOwnerCustomer {
  type: 'Customer'
  id: string
  email: string
}

export interface TokenProviderTokenInfo {
  token: {
    test: boolean
    market_ids: string[]
    stock_location_ids: string[]
    lifespan: number
  }
  role: { id: string; kind: string; name: string }
  application: {
    id: string
    /**
     * Token application kind.
     */
    kind: TokenProviderTokenApplicationKind
    /**
     * The name of the application.
     * When token is generated from the dashboard it could be 'Imports', 'Orders', etc...
     * When is a standard token (`integration`, `sales_channel` or `webapp`) it will be the name assigned when the application was created.
     */
    name: string
    /**
     * This will be `true` when the token is generated from the dashboard.
     * Only dashboard can generate a `core` token.
     */
    core: boolean
  }
  /**
   * List of resources with specific permissions for current token.
   */
  permissions: {
    [key in ListableResourceType]?: { actions: TokenProviderRoleActions[] }
  }
  /**
   * Owner is only present when the token is generated with a logged-in user
   */
  owner?: CoreApiOwnerUser | CoreApiOwnerCustomer
  /**
   * This will contain the list of hub applications that the token can access.
   * Example:
   * ```
   * [{name: 'Orders',  kind: 'orders', core: true}, {name: 'Imports',  kind: 'imports', core: true}]
   * ```
   */
  accessible_apps?: Array<{
    name: string
    kind: TokenProviderAllowedAppKind
    core: boolean
  }>
}

export type Mode = 'live' | 'test'

export interface TokenProviderAuthSettings {
  /**
   * Access token that is being used to authenticate Core API requests.
   */
  accessToken: string
  /**
   * Domain used for Core API requests.
   */
  domain: string
  /**
   * Current organization slug.
   */
  organizationSlug: string
  /**
   * Current app slug.
   */
  appSlug: string
  /**
   * Current mode (live or test)
   */
  mode: Mode
  /**
   * URL of the dashboard (eg: `https://your-org-slug.commercelayer.io`)
   */
  dashboardUrl: string
  /**
   * When `true` it means that the app has been initialized from the Dashboard.
   * Useful when is needed to tweak some UI elements.
   */
  isInDashboard: boolean
  /**
   * Optional callback available within the TokenProvider context to be invoked when the app is closed.
   * This is defined only if it has been declared when TokenProvider has been initialized.
   */
  onAppClose?: () => void
  /**
   * If token has a scope, it will be parsed and made available here in the keys of `markets` and `stock_locations`
   */
  scopes?: ParsedScopes
  /**
   * Extra data received from the outside and made available in the app.
   */
  extras?: TokenProviderExtras
}

export interface TokenProviderAuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  fullName: string
  timezone: string
  locale: 'en-US' | 'it-IT'
}

export interface TokenProviderExtras {
  /** List of sales channel to be used inside the app. */
  salesChannels?: Array<{ name: string; client_id: string }>
  /** Current user plan limits, received from provisioning API subscription, when available. */
  limits?: {
    markets?: number
    memberships?: number
    organizations?: number
    skus?: number
  }
  /** Allow to pass the current user in the app context when using an access token that does not contain an owner. */
  user?: TokenProviderAuthUser
}
