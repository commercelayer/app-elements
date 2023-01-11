declare module 'TokenProvider' {
  import {
    ResourceTypeLock,
    ResourceTypeLock
  } from '@commercelayer/sdk/lib/cjs/api'
  import { RoleActions } from 'TokenProvider'

  export type CurrentApp =
    | 'imports'
    | 'exports'
    | 'webhooks'
    | 'resources'
    | 'orders'
    | 'custom'

  export type RoleActions = 'create' | 'destroy' | 'read' | 'update'

  export type PermissionItem = Record<RoleActions, boolean>
  export type RolePermissions = Partial<
    Record<ResourceTypeLock, PermissionItem>
  >

  export interface TokenInfo {
    token: {
      test: boolean
      market_ids: string[]
      stock_location_ids: string[]
      lifespan: number
    }
    role: { id: string; kind: string; name: string }
    application: {
      id: string
      kind: 'integration' | 'sales_channel' | 'webapp'
      name: string
      core: boolean
    }
    permissions: Record<ResourceTypeLock, { actions: RoleActions[] }>
  }
}
