import cn from "classnames"
import type React from "react"

export interface TableProps {
  /**
   * Column definitions (`<col>` elements), rendered before the header.
   *
   * This is where column widths belong when the table lays out with
   * `table-layout: fixed`: widths declared on the header row are lost as soon as
   * the header is hidden, while a `colgroup` holds regardless.
   */
  colgroup?: React.ReactNode
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
  colgroup,
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
          // With the header hidden on mobile the first row starts with no line
          // above it, so it gets one that matches the dividers between rows (the
          // colour comes from `Td`'s own `border-gray-100`). Above `md` the header
          // is back and its bottom border draws that line instead.
          //
          // Not for `boxed`, where the card's own border already closes the top.
          "[&>tbody>tr:first-of-type>td]:border-t md:[&>tbody>tr:first-of-type>td]:border-t-0":
            variant !== "boxed",
        },
        className,
      ])}
    >
      {colgroup}
      {thead != null && (
        // Hidden on mobile: a table shows a single column there (see
        // `useResourceTable`), and a header labelling one column is noise — it
        // reads as a list, not a table. Column widths are declared on the body
        // cells as well, so hiding the header does not lose them.
        <thead className="hidden md:table-header-group">{thead}</thead>
      )}
      {tbody != null && <tbody>{tbody}</tbody>}
      {tfoot != null && <tfoot>{tfoot}</tfoot>}
    </table>
  )
}

Table.displayName = "Table"
