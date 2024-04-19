import { type FC } from 'react'

export interface DropdownDividerProps
  extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

export const DropdownDivider: FC<DropdownDividerProps> = ({
  children,
  ...rest
}) => {
  return (
    <div {...rest} className='h-px my-2'>
      <hr className='border-gray-600' />
    </div>
  )
}

DropdownDivider.displayName = 'DropdownDivider'
