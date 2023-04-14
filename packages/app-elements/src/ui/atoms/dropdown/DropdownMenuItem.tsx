interface Props extends React.HTMLAttributes<HTMLElement> {
  label: string
  icon?: React.ReactNode
}

function DropdownMenuItem({ label, icon, ...rest }: Props): JSX.Element {
  return (
    <button
      {...rest}
      className='w-full bg-black text-white py-2 pl-4 pr-8  text-sm font-semibold cursor-pointer hover:bg-primary flex items-center'
      aria-label={label}
    >
      {icon != null && <div>{icon}</div>}
      {label}
    </button>
  )
}

DropdownMenuItem.displayName = 'DropdownMenuItem'
export { DropdownMenuItem }
