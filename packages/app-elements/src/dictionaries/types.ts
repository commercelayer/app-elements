import type { StatusIconProps } from "#ui/atoms/StatusIcon"

export interface DisplayStatus {
  label: string
  icon: StatusIconProps["name"]
  color: StatusIconProps["background"]
  task?: string
}
