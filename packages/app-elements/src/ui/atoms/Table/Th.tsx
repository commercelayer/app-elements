import cn from 'classnames'

export interface ThProps extends React.ThHTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

function Th({ children, className, ...rest }: ThProps): JSX.Element {
  return (
    <th
      className={cn(
        className,
        'p-4 text-xs uppercase bg-gray-50 text-gray-400 text-left'
      )}
      {...rest}
    >
      {children}
    </th>
  )
}

Th.displayName = 'Th'
export { Th }
