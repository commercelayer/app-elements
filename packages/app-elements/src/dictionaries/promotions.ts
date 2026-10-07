import type { Promotion } from "@commercelayer/sdk"
import { t } from "i18next"
import type { DisplayStatus } from "./types"

interface PromotionDisplayStatus extends DisplayStatus {
  status: "disabled" | "active" | "upcoming" | "expired" | "used"
}

export function getPromotionDisplayStatus(
  promotion: Omit<Promotion, "type" | "promotion_rules">,
): PromotionDisplayStatus {
  if (promotion.disabled_at != null) {
    return {
      status: "disabled",
      label: t("resources.promotions.attributes.status.disabled"),
      icon: "minus",
      color: "lightGray",
    }
  }

  if (
    promotion.total_usage_limit != null &&
    promotion.total_usage_count === promotion.total_usage_limit
  ) {
    return {
      status: "used",
      label: t("resources.promotions.attributes.status.expired"),
      icon: "flag",
      color: "gray",
    }
  }

  switch (getPromotionTimeframe(promotion)) {
    case "past":
      return {
        status: "expired",
        label: t("resources.promotions.attributes.status.expired"),
        icon: "flag",
        color: "gray",
      }

    case "upcoming":
      return {
        status: "upcoming",
        label: t("apps.promotions.display_status.upcoming"),
        icon: "calendarBlank",
        color: "gray",
      }

    case "active":
      return {
        status: "active",
        label: t("resources.promotions.attributes.status.active"),
        icon: "pulse",
        color: "green",
      }
  }
}

/**
 * Whether the promotion has yet to start, is running or is over.
 * `starts_at` and `expires_at` are absolute instants, so they are compared to
 * the current time as they are: the browser timezone must not play any role.
 */
function getPromotionTimeframe(
  promotion: Pick<Promotion, "starts_at" | "expires_at">,
): "upcoming" | "active" | "past" {
  const now = Date.now()

  if (new Date(promotion.starts_at).getTime() > now) {
    return "upcoming"
  }

  if (new Date(promotion.expires_at).getTime() < now) {
    return "past"
  }

  return "active"
}
