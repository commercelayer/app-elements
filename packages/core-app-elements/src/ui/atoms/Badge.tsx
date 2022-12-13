import cn from 'classnames'
import React from 'react'

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'danger'
  | 'success'

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  variant: BadgeVariant
  label: string
}

const variantCss: Record<BadgeVariant, string> = {
  primary: 'text-primary bg-primary/10',
  secondary: 'text-gray-500 bg-gray-500/10',
  warning: 'text-orange bg-orange/10',
  danger: 'text-red bg-red/10',
  success: 'text-green bg-green/10'
}

export function Badge({
  variant,
  label,
  className,
  ...rest
}: Props): JSX.Element {
  return (
    <div
      {...rest}
      className={cn([
        className,
        'text-[11px] font-bold leading-none py-1 px-2 rounded-full inline-block',
        variantCss[variant]
      ])}
    >
      {label}
    </div>
  )
}

export default Badge
