interface Props extends React.TdHTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

export function Td({ children, ...rest }: Props): JSX.Element {
  return (
    <td className='p-4 border-b border-gray-100' {...rest}>
      {children}
    </td>
  )
}

export default Td
