interface Props extends React.ThHTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

export function Th({ children, ...rest }: Props): JSX.Element {
  return (
    <th
      className='p-4 text-xs uppercase bg-gray-50 text-gray-400 text-left'
      {...rest}
    >
      {children}
    </th>
  )
}

export default Th
