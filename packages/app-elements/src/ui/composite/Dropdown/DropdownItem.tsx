import { Icon, type IconProps } from '#ui/atoms/Icon/Icon'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import cn from 'classnames'
import { type FC } from 'react'

export interface DropdownItemProps extends React.HTMLAttributes<HTMLElement> {
  label: string
  icon?: IconProps['name'] | 'keep-space'
}

export const DropdownItem = withSkeletonTemplate<DropdownItemProps>(
  ({ label, icon, isLoading, delayMs, className, ...rest }) => {
    return (
      <button
        {...rest}
        className={cn(
          'w-full bg-black text-white py-2 pl-4 pr-8 text-sm font-semibold flex items-center focus:!outline-none',
          className,
          {
            'hover:bg-primary cursor-pointer focus:bg-primary':
              rest.onClick != null,
            'cursor-default': rest.onClick == null
          }
        )}
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
)
DropdownItem.displayName = 'DropdownItem'

const FakeIcon: FC = () => {
  return <div className='w-[14px]' />
}
