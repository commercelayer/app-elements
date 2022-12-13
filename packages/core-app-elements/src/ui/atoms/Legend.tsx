import { ReactNode } from 'react'

interface LegendProps {
  title?: ReactNode
  actionButton?: ReactNode
}

export function Legend({
  title,
  actionButton,
  ...rest
}: LegendProps): JSX.Element {
  return (
    <div
      className='flex justify-between items-center pb-4 border-b border-gray-100'
      {...rest}
    >
      <h2 className='text-gray-500 font-medium'>{title}</h2>
      <div>{actionButton}</div>
    </div>
  )
}

export default Legend
