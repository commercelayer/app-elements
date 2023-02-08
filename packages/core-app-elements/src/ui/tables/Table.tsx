import React from 'react'
import cn from 'classnames'

interface Props extends React.TableHTMLAttributes<HTMLTableElement> {
  thead?: React.ReactNode
  tbody?: React.ReactNode
}

function Table({ thead, tbody, className, ...rest }: Props): JSX.Element {
  return (
    <table className={cn(['w-full', className])} {...rest}>
      {thead != null && <thead>{thead}</thead>}
      {tbody != null && <tbody>{tbody}</tbody>}
    </table>
  )
}

export default Table
