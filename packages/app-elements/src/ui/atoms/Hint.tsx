import cn from 'classnames'
import { type JSX, type ReactNode } from 'react'
import { Icon, type IconProps } from './Icon'

export interface HintProps {
  icon?: IconProps['name']
  className?: string
  children: ReactNode
}

export function Hint({
  icon,
  className,
  children,
  ...rest
}: HintProps): JSX.Element {
  return (
    <div className={cn('flex gap-2 items-center', className)} {...rest}>
      {icon != null && <Icon name={icon} size={24} />}
      <div className='text-sm font-medium text-gray-500'>{children}</div>
    </div>
  )
}

Hint.displayName = 'Hint'
