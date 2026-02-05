import cn from "classnames"
import type React from "react"
import { Icon, type IconProps } from "#ui/atoms/Icon"
import { variantCss } from "./badgeVariants"

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Render a different variant. */
  variant: keyof typeof variantCss
  icon?: IconProps["name"]
  children: React.ReactNode
}

/** Badges are used to highlight an item's status for quick recognition. */
export const Badge: React.FC<BadgeProps> = ({
  variant,
  icon,
  children,
  className,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={cn([
        className,
        "text-[12px] font-semibold px-2 py-1.5 leading-3 rounded inline-block",
        variantCss[variant],
      ])}
    >
      <div className="flex items-center gap-1">
        {icon != null && <Icon name={icon} size={16} weight="bold" />}
        {children}
      </div>
    </div>
  )
}

Badge.displayName = "Badge"
