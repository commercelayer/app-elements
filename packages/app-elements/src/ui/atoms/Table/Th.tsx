export interface ThProps extends React.ThHTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

function Th({ children, ...rest }: ThProps): JSX.Element {
  return (
    <th
      className='p-4 text-xs uppercase bg-gray-50 text-gray-400 text-left'
      {...rest}
    >
      {children}
    </th>
  )
}

Th.displayName = 'Th'
export { Th }
