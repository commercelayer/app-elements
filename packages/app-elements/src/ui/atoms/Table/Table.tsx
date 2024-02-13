import cn from 'classnames'
import React from 'react'

export interface TableProps {
  thead?: React.ReactNode
  tbody?: React.ReactNode
  className?: string
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
export const Table: React.FC<TableProps> = ({ thead, tbody, className }) => {
  return (
    <table className={cn(['w-full', className])}>
      {thead != null && <thead>{thead}</thead>}
      {tbody != null && <tbody>{tbody}</tbody>}
    </table>
  )
}

Table.displayName = 'Table'
