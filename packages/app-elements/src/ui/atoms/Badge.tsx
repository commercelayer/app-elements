import cn from 'classnames'
import React from 'react'

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'danger'
  | 'success'
  | 'primary-solid'
  | 'secondary-solid'
  | 'warning-solid'
  | 'danger-solid'
  | 'success-solid'

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  variant: BadgeVariant
  label: string
}

const variantCss: Record<BadgeVariant, string> = {
  primary: 'text-primary bg-primary/10',
  secondary: 'text-gray-500 bg-gray-500/10',
  warning: 'text-orange bg-orange/10',
  danger: 'text-red bg-red/10',
  success: 'text-green bg-green/10',
  'primary-solid': 'text-white bg-primary',
  'secondary-solid': 'text-white bg-gray-500',
  'warning-solid': 'text-white bg-orange',
  'danger-solid': 'text-white bg-red',
  'success-solid': 'text-white bg-green'
}

function Badge({ variant, label, className, ...rest }: Props): JSX.Element {
  return (
    <div
      {...rest}
      className={cn([
        className,
        'text-xs font-bold py-0.5 px-2 rounded inline-block',
        variantCss[variant]
      ])}
    >
      {label}
    </div>
  )
}

Badge.displayName = 'Badge'
export { Badge }
