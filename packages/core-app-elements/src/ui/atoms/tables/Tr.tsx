interface Props extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

function Tr({ children, ...rest }: Props): JSX.Element {
  return <tr {...rest}>{children}</tr>
}

Tr.displayName = 'Tr'
export { Tr }
