import cn from 'classnames'
import { type JSX } from 'react'

type DotVariant = 'success' | 'danger' | 'warning'

export interface StatusDotProps {
  variant: DotVariant
}

const variantCss: Record<DotVariant, string> = {
  warning: 'bg-orange',
  danger: 'bg-red',
  success: 'bg-green'
}

export function StatusDot({ variant, ...rest }: StatusDotProps): JSX.Element {
  return (
    <div
      className={cn([variantCss[variant], 'w-2 h-2 rounded-full'])}
      {...rest}
    />
  )
}

StatusDot.displayName = 'StatusDot'
