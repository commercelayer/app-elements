import { CaretRight } from 'phosphor-react'

interface ListSimpleItemProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  label: string
}
export function ListSimpleItem({
  label,
  ...rest
}: ListSimpleItemProps): JSX.Element {
  return (
    <a
      {...rest}
      className='flex justify-between items-center px-4 py-4 border-b border-gray-100 text-gray-800 font-semibold hover:bg-gray-50'
    >
      <div>{label}</div>
      <CaretRight />
    </a>
  )
}

export default ListSimpleItem
