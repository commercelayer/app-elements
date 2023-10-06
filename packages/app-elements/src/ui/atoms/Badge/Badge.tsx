import cn from 'classnames'
import React from 'react'
import { variantCss } from './badgeVariants'

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Render a different variant. */
  variant: keyof typeof variantCss
  children: string
}

/** Badges are used to highlight an item's status for quick recognition. */
export const Badge: React.FC<BadgeProps> = ({
  variant,
  children,
  className,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={cn([
        className,
        'text-xs font-bold py-0.5 px-2 rounded inline-block',
        variantCss[variant]
      ])}
    >
      {children}
    </div>
  )
}

Badge.displayName = 'Badge'
