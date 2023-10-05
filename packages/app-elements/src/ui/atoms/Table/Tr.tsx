export interface TrProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

function Tr({ children, ...rest }: TrProps): JSX.Element {
  return <tr {...rest}>{children}</tr>
}

Tr.displayName = 'Tr'
export { Tr }
