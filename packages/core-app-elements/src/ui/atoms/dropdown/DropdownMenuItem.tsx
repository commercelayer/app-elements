interface Props extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  icon?: React.ReactNode
}

export function DropdownMenuItem({
  children,
  icon,
  ...rest
}: Props): JSX.Element {
  return (
    <button
      {...rest}
      className='w-full bg-black text-white py-1 px-4 text-sm font-semibold cursor-pointer hover:bg-primary flex items-center'
    >
      <div>{icon}</div>
      <div>{children}</div>
    </button>
  )
}

export default DropdownMenuItem
