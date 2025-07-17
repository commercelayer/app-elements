import type { Return } from "@commercelayer/sdk"
import { getReturnDisplayStatus } from "#dictionaries/returns"
import { formatDate } from "#helpers/date"
import {
  ListItemDescription,
  ListItemIcon,
} from "#ui/resources/ResourceListItem/common"
import type { ResourceToProps } from "../types"

export const returnToProps: ResourceToProps<Return> = ({
  resource,
  user,
  t,
}) => {
  const displayStatus = getReturnDisplayStatus(resource)

  const returnStockLocationName =
    resource.stock_location?.name != null
      ? `${t("common.to")} ${resource.stock_location.name} `
      : ""
  const number = resource.number != null ? `#${resource.number}` : ""

  return {
    name: `${t("resources.returns.name")} ${number}`,
    description: (
      <ListItemDescription
        displayStatus={displayStatus}
        date={formatDate({
          format: "full",
          isoDate: resource.updated_at,
          timezone: user?.timezone,
          locale: user?.locale,
        })}
        additionalInfos={returnStockLocationName}
      />
    ),
    icon: (
      <ListItemIcon icon={displayStatus.icon} color={displayStatus.color} />
    ),
  }
}
