import cn from "classnames"
import type React from "react"

export interface TableProps {
  thead?: React.ReactNode
  className?: string
  variant?: "boxed"
  tbody?: React.ReactNode
  tfoot?: React.ReactNode
}

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
  tbody,
  tfoot,
}) => {
  return (
    <table
      className={cn([
        "w-full",
        {
          "border border-gray-200 border-separate border-spacing-0 rounded [&>tbody>tr:last-of-type>td]:border-0 first-of-type:[&>tbody>tr:last-of-type>td]:rounded-es last-of-type:[&>tbody>tr:last-of-type>td]:rounded-ee":
            variant === "boxed",
        },
        className,
      ])}
    >
      {thead != null && <thead>{thead}</thead>}
      {tbody != null && <tbody>{tbody}</tbody>}
      {tfoot != null && <tfoot>{tfoot}</tfoot>}
    </table>
  )
}

Table.displayName = "Table"
