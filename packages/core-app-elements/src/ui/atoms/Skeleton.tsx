import cn from 'classnames'
import { ReactNode } from 'react'
import { DelayShow } from './DelayShow'

export function Skeleton({
  children,
  delayMs = 500,
  ...rest
}: {
  children: ReactNode
  delayMs?: number
}): JSX.Element {
  return (
    <div {...rest} className='animate-pulse'>
      <DelayShow delayMs={delayMs}>{children}</DelayShow>
    </div>
  )
}

interface SkeletonItemProps {
  className?: string
  type?: 'box' | 'circle'
}

export function SkeletonItem({
  className,
  type = 'box',
  ...rest
}: SkeletonItemProps): JSX.Element {
  return (
    <div
      {...rest}
      className={cn(className, 'bg-gray-50', {
        'rounded-full': type === 'circle',
        rounded: type === 'box'
      })}
    />
  )
}

export default Skeleton
