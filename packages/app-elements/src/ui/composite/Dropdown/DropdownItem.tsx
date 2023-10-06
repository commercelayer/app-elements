export interface DropdownItemProps extends React.HTMLAttributes<HTMLElement> {
  label: string
  icon?: React.ReactNode
}

export function DropdownItem({
  label,
  icon,
  ...rest
}: DropdownItemProps): JSX.Element {
  return (
    <button
      {...rest}
      className='w-full bg-black text-white py-2 pl-4 pr-8  text-sm font-semibold cursor-pointer flex items-center hover:bg-primary focus:bg-primary focus:!outline-none'
      aria-label={label}
    >
      {icon != null && <div>{icon}</div>}
      {label}
    </button>
  )
}

DropdownItem.displayName = 'DropdownItem'
