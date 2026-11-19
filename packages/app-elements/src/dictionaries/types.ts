import type { IconProps } from "#ui/atoms/Icon"
import type { StatusIconProps } from "#ui/atoms/StatusIcon"

export interface DisplayStatus {
  label: string
  icon: StatusIconProps["name"]
  color: StatusIconProps["background"]
  task?: string
  /** An icon on the status badge, for a status that says who it waits on. */
  badgeIcon?: IconProps["name"]
}
