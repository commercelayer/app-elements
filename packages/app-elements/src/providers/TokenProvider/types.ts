import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'

export type TokenProviderAllowedApp =
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
  | 'skus'
  | 'stock_transfers'
  | 'subscriptions'
  | 'tags'
  | 'webhooks'

export type TokenProviderTokenApplicationKind =
  | 'integration'
  | 'sales_channel'
  | 'webapp'
  | 'resources'
  | TokenProviderAllowedApp

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
     * When token is generated from the dashboard hub it could be 'Imports', 'Orders', etc...
     * When is a standard token (`integration`, `sales_channel` or `webapp`) it will be the name assigned when the application was created.
     */
    name: string
    /**
     * This will be `true` when the token is generated from the dashboard hub.
     * Only dashboard hub can generate a `core` token.
     */
    core: boolean
  }
  /**
   * List of resources with specific permissions for current token.
   */
  permissions: Record<
    ListableResourceType,
    { actions: TokenProviderRoleActions[] }
  >
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
    kind: TokenProviderAllowedApp
    core: boolean
  }>
}

export type Mode = 'live' | 'test'

export interface TokenProviderAuthSettings {
  accessToken: string
  organizationSlug: string
  appSlug: string
  domain: string
  mode: Mode
}

export interface TokenProviderAuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  fullName: string
  timezone: string
}
