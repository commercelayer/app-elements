import cn from 'classnames'
import React, { type ReactNode } from 'react'

export interface GridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode
  columns: '1' | '2'
}

function Grid({
  children,
  columns,
  className,
  ...rest
}: GridProps): JSX.Element {
  return (
    <div
      className={cn('grid grid-cols-1 gap-4', className, {
        'sm:grid-cols-2': columns === '2'
      })}
      {...rest}
    >
      {children}
    </div>
  )
}

Grid.displayName = 'Grid'
export { Grid }
