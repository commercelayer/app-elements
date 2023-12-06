import { Icon, type IconProps } from '#ui/atoms/Icon/Icon'
import { type FC } from 'react'

export interface DropdownItemProps extends React.HTMLAttributes<HTMLElement> {
  label: string
  icon?: IconProps['name'] | 'keep-space'
}

export const DropdownItem: FC<DropdownItemProps> = ({
  label,
  icon,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className='w-full bg-black text-white py-2 pl-4 pr-8 text-sm font-semibold cursor-pointer flex items-center hover:bg-primary focus:bg-primary focus:!outline-none'
      aria-label={label}
    >
      {icon != null ? (
        <div className='mr-2'>
          {icon === 'keep-space' ? (
            <FakeIcon /> // keep the gap as if there was an icon
          ) : (
            <Icon name={icon} weight='bold' />
          )}
        </div>
      ) : null}

      <span
        className='text-ellipsis overflow-hidden whitespace-nowrap'
        title={label}
      >
        {label}
      </span>
    </button>
  )
}
DropdownItem.displayName = 'DropdownItem'

const FakeIcon: FC = () => {
  return <div className='w-[14px]' />
}
