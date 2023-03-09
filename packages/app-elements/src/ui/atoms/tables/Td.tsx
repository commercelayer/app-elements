import cn from 'classnames'

interface Props extends React.TdHTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

function Td({ children, className, ...rest }: Props): JSX.Element {
  return (
    <td className={cn('p-4 border-b border-gray-100', className)} {...rest}>
      {children}
    </td>
  )
}

Td.displayName = 'Td'
export { Td }
