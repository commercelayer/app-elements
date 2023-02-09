interface Props extends React.HTMLAttributes<HTMLElement> {
  label: string
  icon?: React.ReactNode
}

export function DropdownMenuItem({ label, icon, ...rest }: Props): JSX.Element {
  return (
    <button
      {...rest}
      className='w-full bg-black text-white py-1 px-4 text-sm font-semibold cursor-pointer hover:bg-primary flex items-center'
      aria-label={label}
    >
      {icon != null && <div>{icon}</div>}
      {label}
    </button>
  )
}

export default DropdownMenuItem
