interface Props extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

export function DropdownDivider({ children, ...rest }: Props): JSX.Element {
  return (
    <div {...rest} className='h-px'>
      <hr className='border-gray-600' />
    </div>
  )
}

DropdownDivider.displayName = 'DropdownDivider'
