import cn from 'classnames'
import React from 'react'

export type BadgeVariant =
  | 'danger-solid'
  | 'danger'
  | 'primary-solid'
  | 'primary'
  | 'secondary-solid'
  | 'secondary'
  | 'success-solid'
  | 'success'
  | 'teal-solid'
  | 'teal'
  | 'warning-solid'
  | 'warning'

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Render a different variant. */
  variant: BadgeVariant
  children: string
}

const variantCss: Record<BadgeVariant, string> = {
  'danger-solid': 'text-white bg-red',
  'primary-solid': 'text-white bg-primary',
  'secondary-solid': 'text-white bg-gray-500',
  'success-solid': 'text-white bg-green',
  'teal-solid': 'text-white bg-teal',
  'warning-solid': 'text-white bg-orange',
  danger: 'text-red bg-red/10',
  primary: 'text-primary bg-primary/10',
  secondary: 'text-gray-500 bg-gray-500/10',
  success: 'text-green bg-green/10',
  teal: 'text-teal-800 bg-teal-800/10',
  warning: 'text-orange bg-orange/10'
}

export const badgeVariants = Object.keys(variantCss) as Array<
  keyof typeof variantCss
>

/** Badges are used to highlight an item's status for quick recognition. */
export const Badge: React.FC<Props> = ({
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
