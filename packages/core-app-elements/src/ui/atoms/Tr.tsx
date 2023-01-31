type TableRowVariant = 'tbody' | 'thead'

interface Props extends React.HTMLAttributes<HTMLElement> {
  variant?: TableRowVariant
  children?: React.ReactNode
}

const tableRowVariantCss: Record<TableRowVariant, string> = {
  tbody: '',
  thead: ''
}

export function Tr({
  variant = 'tbody',
  children,
  ...rest
}: Props): JSX.Element {
  return (
    <tr className={tableRowVariantCss[variant]} {...rest}>
      {children}
    </tr>
  )
}

export default Tr
