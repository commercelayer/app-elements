import type { Customer } from "@commercelayer/sdk"
import isEmpty from "lodash-es/isEmpty"
import { AvatarLetter } from "#ui/atoms/AvatarLetter"
import { Tag } from "#ui/atoms/Tag"
import type { ResourceToProps } from "../types"

export const customerToProps: ResourceToProps<Customer> = ({ resource, t }) => {
  const customerTags = resource.tags?.map((tag) => (
    <Tag key={tag.id}>{tag.name}</Tag>
  ))

  return {
    name: resource.email,
    description: `${resource.total_orders_count ?? 0} ${t(
      "resources.orders.name",
      {
        count: resource.total_orders_count ?? 0,
      },
    ).toLowerCase()}
    ${
      !isEmpty(resource.customer_group)
        ? ` · ${resource.customer_group?.name}`
        : ""
    }`,
    bottomContent:
      customerTags != null ? (
        <div className="flex flex-wrap gap-2">{customerTags}</div>
      ) : undefined,
    icon: <AvatarLetter text={resource.email} />,
  }
}
