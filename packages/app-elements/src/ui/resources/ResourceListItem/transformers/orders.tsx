import type { Order } from "@commercelayer/sdk"
import { getOrderDisplayStatus } from "#dictionaries/orders"
import { formatDate } from "#helpers/date"
import { Text } from "#ui/atoms/Text"
import type { ResourceToProps } from "../types"

/**
 * An order as a row: its number with the status as a badge, when it was placed,
 * and what it came to.
 *
 * No icon and no market prefix — the row is listed inside the resource it belongs
 * to (a customer, a subscription), which already says whose order it is, and the
 * badge says where it stands.
 */
export const orderToProps: ResourceToProps<Order> = ({ resource, user, t }) => {
  return {
    name: `${t("resources.orders.name")} #${resource.number ?? ""}`.trim(),
    description: formatDate({
      format: "full",
      isoDate: resource.placed_at ?? resource.updated_at,
      timezone: user?.timezone,
      locale: user?.locale,
    }),
    status: getOrderDisplayStatus(resource),
    showRightContent: true,
    rightContent: (
      <Text
        tag="div"
        weight="semibold"
        data-testid="ResourceListItem-total"
        className="break-keep"
        wrap="nowrap"
      >
        {resource.formatted_total_amount_with_taxes}
      </Text>
    ),
  }
}
