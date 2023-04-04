import { type ReactNode } from 'react'
import cn from 'classnames'

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

// TODO: Do we want to manage headings? (h2, h3, hx)

function Legend({
  title,
  titleSize = 'normal',
  actionButton,
  className,
  border,
  ...rest
}: LegendProps): JSX.Element {
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

Legend.displayName = 'Legend'
export { Legend }
