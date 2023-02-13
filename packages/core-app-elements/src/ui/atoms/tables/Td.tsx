interface Props extends React.TdHTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

function Td({ children, ...rest }: Props): JSX.Element {
  return (
    <td className='p-4 border-b border-gray-100' {...rest}>
      {children}
    </td>
  )
}

Td.displayName = 'Td'
export { Td }
