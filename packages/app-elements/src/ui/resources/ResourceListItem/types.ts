import type { TokenProviderAuthUser } from '#providers/TokenProvider/types'

export interface ResourceListItemComponentProps {
  name: string
  description: JSX.Element | string
  icon: JSX.Element
  rightContent?: JSX.Element
  showArrow?: boolean
}

export type ResourceToProps<Resource> = (options: {
  resource: Resource
  user: TokenProviderAuthUser | null
}) => ResourceListItemComponentProps
