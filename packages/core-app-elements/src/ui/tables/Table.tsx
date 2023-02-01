import React from 'react'
import cn from 'classnames'

interface Props extends React.TableHTMLAttributes<HTMLTableElement> {
  thead?: React.ReactNode
  tbody?: React.ReactNode
}

function Table({ thead, tbody, ...rest }: Props): JSX.Element {
  const topBorder = thead == null && 'border-t border-gray-100'
  return (
    <table className={cn(['w-full', topBorder])} {...rest}>
      {thead != null && <thead>{thead}</thead>}
      {tbody != null && <tbody>{tbody}</tbody>}
    </table>
  )
}

export default Table
