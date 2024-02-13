import cn from 'classnames'

export interface ThProps extends React.ThHTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

function Th({ children, className, ...rest }: ThProps): JSX.Element {
  return (
    <th
      className={cn(
        className,
        'p-4 text-xs uppercase bg-gray-50 text-gray-400 text-left first-of-type:rounded-ss last-of-type:rounded-se'
      )}
      {...rest}
    >
      {children}
    </th>
  )
}

Th.displayName = 'Th'
export { Th }
