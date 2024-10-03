import cn from 'classnames'
import React from 'react'

export type TableProps = {
  thead?: React.ReactNode
  className?: string
  variant?: 'boxed'
} & (
  | {
      tbody?: React.ReactNode
    }
  | {
      children: React.ReactNode
    }
)

/**
 * `<Table>` component is used to organize and display data efficiently.
 *
 * These are all the available components you can use to manage a table:
 *
 * ```js
 * import {
 *   Table,
 *   Tr,
 *   Th,
 *   Td
 * } from '@commercelayer/app-elements'
 * ```
 */
export const Table: React.FC<TableProps> = ({
  thead,
  className,
  variant,
  ...rest
}) => {
  return (
    <table
      className={cn([
        'w-full',
        {
          'border border-gray-200 border-separate border-spacing-0 rounded [&>tbody>tr:last-of-type>td]:border-0 [&>tbody>tr:last-of-type>td]:first-of-type:rounded-es [&>tbody>tr:last-of-type>td]:last-of-type:rounded-ee':
            variant === 'boxed'
        },
        className
      ])}
    >
      {thead != null && <thead>{thead}</thead>}
      {'tbody' in rest && rest.tbody != null ? (
        <tbody>{rest.tbody}</tbody>
      ) : 'children' in rest ? (
        <>{rest.children}</>
      ) : null}
    </table>
  )
}

Table.displayName = 'Table'
