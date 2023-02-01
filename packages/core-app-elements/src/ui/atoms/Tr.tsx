interface Props extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

export function Tr({ children, ...rest }: Props): JSX.Element {
  return <tr {...rest}>{children}</tr>
}

export default Tr
