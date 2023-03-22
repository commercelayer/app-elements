import { useDelayShow } from '#hooks/useDelayShow'
import cn from 'classnames'
import { ReactNode } from 'react'

interface SkeletonProps {
  /**
   * This prevents Skeleton to appear immediately.
   * It can be used when loading times are too short and you don't want flashing of content
   */
  delayMs?: number
  /**
   * Manly <SkeletonItem /> components should be used as children.
   * But you might want to also pass a grid or something else that has <SkeletonItem /> as children
   */
  children: ReactNode
}

function Skeleton({
  children,
  delayMs = 500,
  ...rest
}: SkeletonProps): JSX.Element {
  const [show] = useDelayShow(delayMs)
  return (
    <div data-test-id='skeleton' className='animate-pulse' {...rest}>
      <div style={{ opacity: show ? 1 : 0 }}>{children}</div>
    </div>
  )
}

interface SkeletonItemProps {
  /**
   * CSS classes
   */
  className?: string
  /**
   * Can be `box` (default) to render a rectangular shape or `circle`
   */
  type?: 'box' | 'circle'
  /**
   * CSS dimension for width. It can be number if expressed in pixels or string.
   * Example: `16`, `1rem` or '100%'.
   * If no className is provided, the default value is `100%`.
   */
  width?: string | number
  /**
   * CSS dimension for height. It can be number if expressed in pixels or string.
   * Example: `16`, `1rem` or '100%'.
   * If no className is provided, the default value is `1em`.
   */
  height?: string | number
}

export function SkeletonItem({
  className,
  type = 'box',
  width,
  height,
  ...rest
}: SkeletonItemProps): JSX.Element {
  return (
    <div
      data-test-id='skeleton-item'
      className={cn(className, 'bg-gray-50', {
        'rounded-full': type === 'circle',
        rounded: type === 'box'
      })}
      style={{
        width: className == null ? width ?? '100%' : undefined,
        height: className == null ? height ?? '1em' : undefined
      }}
      {...rest}
    />
  )
}

Skeleton.displayName = 'Skeleton'
export { Skeleton }
