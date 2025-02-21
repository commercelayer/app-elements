import { AvatarLetter } from '#ui/atoms/AvatarLetter'
import type { Customer } from '@commercelayer/sdk'
import isEmpty from 'lodash-es/isEmpty'
import { type ResourceToProps } from '../types'

export const customerToProps: ResourceToProps<Customer> = ({ resource, t }) => {
  return {
    name: resource.email,
    description: `${resource.total_orders_count ?? 0} ${t(
      'resources.orders.name',
      {
        count: resource.total_orders_count ?? 0
      }
    ).toLowerCase()}
    ${
      !isEmpty(resource.customer_group)
        ? ` · ${resource.customer_group?.name}`
        : ''
    }`,
    icon: <AvatarLetter text={resource.email} />
  }
}
