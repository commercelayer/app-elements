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
   * Items alignment.
   * When not set all items will hame same height (items-stretch)
   */
  alignItems?: 'center' | 'start' | 'end'
}

/**
 * Render the children as a grid.
 * By default the grid will have 1 column and al items will have same height.
 * It's possible to set the number of columns and the alignment of the items.
 */
function Grid({
  children,
  columns,
  className,
  alignItems,
  ...rest
}: GridProps): JSX.Element {
  return (
    <div
      className={cn('grid grid-cols-1 gap-4', className, {
        'sm:!grid-cols-2': columns === '2',
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
