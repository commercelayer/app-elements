import cn from 'classnames'
import React from 'react'

export interface TableProps {
  thead?: React.ReactNode
  tbody?: React.ReactNode
  className?: string
  variant?: 'boxed'
}

/**
 * `<Table>` component is used to organize and display data efficiently.
 *
 * These are all the available components you can use to manage a table:
 * ```
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
  tbody,
  className,
  variant
}) => {
  return (
    <table
      className={cn([
        'w-full',
        {
          'border border-gray-200 border-separate border-spacing-0 rounded [&>tbody>tr:last-of-type>td]:border-0':
            variant === 'boxed'
        },
        className
      ])}
    >
      {thead != null && <thead>{thead}</thead>}
      {tbody != null && <tbody>{tbody}</tbody>}
    </table>
  )
}

Table.displayName = 'Table'
