import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import cn from 'classnames'
import { type ReactNode } from 'react'

export interface LegendProps {
  /**
   * Main section title
   */
  title?: ReactNode
  /**
   * Size for the title prop
   */
  titleSize?: 'normal' | 'small'
  /**
   * Specify `none` to remove border
   */
  border?: 'none'
  /**
   * This will render a button on the right side of the row
   */
  actionButton?: ReactNode
  /**
   * CSS classes
   */
  className?: string
}

export const Legend = withSkeletonTemplate<LegendProps>(
  ({
    title,
    titleSize = 'normal',
    actionButton,
    className,
    border,
    isLoading,
    delayMs,
    ...rest
  }) => {
    return (
      <div
        className={cn(
          'border-b pb-4 flex justify-between items-center',
          {
            // border
            'border-gray-100': border == null,
            'border-transparent': border === 'none'
          },
          className
        )}
        {...rest}
      >
        <h2
          className={cn({
            // titleSize
            'text-gray-500 font-medium': titleSize === 'small',
            'text-lg font-semibold': titleSize === 'normal'
          })}
        >
          {title}
        </h2>
        <div>{actionButton}</div>
      </div>
    )
  }
)

Legend.displayName = 'Legend'
