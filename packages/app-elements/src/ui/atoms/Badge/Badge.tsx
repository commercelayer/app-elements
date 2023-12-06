import { Icon } from '#ui/atoms/Icon'
import { type iconMapping } from '#ui/atoms/Icon/icons'
import cn from 'classnames'
import React from 'react'
import { variantCss } from './badgeVariants'

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Render a different variant. */
  variant: keyof typeof variantCss
  icon?: keyof typeof iconMapping
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
        'text-xs font-bold py-0.5 px-2 rounded inline-block',
        variantCss[variant]
      ])}
    >
      <div className='flex items-center gap-1'>
        {icon != null && <Icon name={icon} size={16} weight='bold' />}
        {children}
      </div>
    </div>
  )
}

Badge.displayName = 'Badge'
