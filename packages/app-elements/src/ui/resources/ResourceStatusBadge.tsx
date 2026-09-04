import type { DisplayStatus } from "#dictionaries/types"
import { Badge, type BadgeProps } from "#ui/atoms/Badge"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"

export interface ResourceStatusBadgeProps {
  /**
   * The resource's display status, as the dictionaries return it —
   * `getOrderDisplayStatus`, `getShipmentDisplayStatus`, and the rest.
   */
  status: DisplayStatus
  className?: string
}

/**
 * A resource's display status, as a badge.
 *
 * The one place the display status colours become `Badge` variants: every table,
 * row and page title that shows a status renders this, so a status looks the same
 * wherever it appears and the mapping cannot drift app by app.
 */
export const ResourceStatusBadge =
  withSkeletonTemplate<ResourceStatusBadgeProps>(({ status, className }) => (
    <Badge variant={toBadgeVariant(status.color)} className={className}>
      {status.label}
    </Badge>
  ))

/**
 * The display status colours, as `Badge` variants. The colours a status can
 * carry are `StatusIcon` backgrounds, which include a few — `white`, `black`,
 * `none` — that no status uses; those read as neutral.
 */
function toBadgeVariant(color: DisplayStatus["color"]): BadgeProps["variant"] {
  switch (color) {
    case "green":
      return "success"
    case "orange":
      return "warning"
    case "red":
      return "danger"
    case "teal":
      return "teal"
    default:
      return "secondary"
  }
}
