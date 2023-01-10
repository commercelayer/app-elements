import { ReactNode } from 'react'
import cn from 'classnames'

interface LegendProps {
  /**
   * Main section title
   */
  title?: ReactNode
  /**
   * This will render a button on the right side of the row
   */
  actionButton?: ReactNode
  /**
   * CSS classes
   */
  className?: string
}

export function Legend({
  title,
  actionButton,
  className,
  ...rest
}: LegendProps): JSX.Element {
  return (
    <div
      className={cn('flex justify-between items-center', className)}
      {...rest}
    >
      <h2 className='text-gray-500 font-medium'>{title}</h2>
      <div>{actionButton}</div>
    </div>
  )
}

export default Legend
