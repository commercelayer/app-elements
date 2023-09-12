import { AvatarLetter } from '#ui/atoms/AvatarLetter'
import type { Customer } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { type ResourceToProps } from '../types'

export const customerToProps: ResourceToProps<Customer> = ({
  resource,
  user
}) => {
  return {
    name: resource.email,
    description: `${resource.total_orders_count ?? 0} orders
    ${
      !isEmpty(resource.customer_group)
        ? ` · ${resource.customer_group?.name}`
        : ''
    }`,
    icon: <AvatarLetter text={resource.email} />
  }
}
