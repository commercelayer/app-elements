interface Props extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

function DropdownMenuDivider({ children, ...rest }: Props): JSX.Element {
  return (
    <div {...rest} className='py-1'>
      <hr className='border-gray-600' />
    </div>
  )
}

DropdownMenuDivider.displayName = 'DropdownMenuDivider'
export { DropdownMenuDivider }
