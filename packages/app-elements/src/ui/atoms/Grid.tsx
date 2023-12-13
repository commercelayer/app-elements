import cn from 'classnames'
import React, { type ReactNode } from 'react'

export interface GridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Grid items
   */
  children: ReactNode
  /**
   * Number of columns
   */
  columns: '1' | '2'
  /**
   * Items alignment
   * @default start
   */
  alignItems?: 'center' | 'start' | 'end'
}

function Grid({
  children,
  columns,
  className,
  alignItems = 'start',
  ...rest
}: GridProps): JSX.Element {
  return (
    <div
      className={cn('grid grid-cols-1 gap-4', className, {
        'sm:grid-cols-2': columns === '2',
        'items-center': alignItems === 'center',
        'items-start': alignItems === 'start',
        'items-end': alignItems === 'end'
      })}
      {...rest}
    >
      {children}
    </div>
  )
}

Grid.displayName = 'Grid'
export { Grid }
