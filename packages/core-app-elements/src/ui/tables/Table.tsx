import React from 'react'
import cn from 'classnames'

type TableRowVariant = 'tr' | 'th'

interface TableRowProps {
  variant?: TableRowVariant
  children?: React.ReactNode
}

const tableRowVariantCss: Record<TableRowVariant, string> = {
  tr: 'border-b border-gray-100',
  th: 'text-xs uppercase p-4 bg-gray-50 text-gray-400 text-left'
}

export function TableRow({
  variant = 'tr',
  children
}: TableRowProps): JSX.Element {
  return <tr className={tableRowVariantCss[variant]}>{children}</tr>
}

type TableCellVariant = 'td' | 'th'

interface TableCellProps {
  variant?: TableCellVariant
  children?: React.ReactNode
}

export function TableCell({
  variant = 'td',
  children
}: TableCellProps): JSX.Element {
  const tableCellClassNames = 'p-4'
  if (variant === 'td') {
    return <td className={tableCellClassNames}>{children}</td>
  } else {
    return <th className={tableCellClassNames}>{children}</th>
  }
}

export interface TableProps {
  className?: string
  thead?: React.ReactNode
  tbody?: React.ReactNode
}

export function Table({
  className,
  thead,
  tbody,
  ...rest
}: TableProps): JSX.Element {
  const topBorder = thead == null && 'border-t border-gray-100'
  return (
    <table className={cn(['w-full', topBorder])} {...rest}>
      {thead != null && <thead>{thead}</thead>}
      {tbody != null && <tbody>{tbody}</tbody>}
    </table>
  )
}
