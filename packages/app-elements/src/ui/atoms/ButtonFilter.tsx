import cn from 'classnames'
import { Icon, type IconProps } from './Icon'

interface ButtonFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void
  onRemoveRequest?: () => void
  icon?: IconProps['name']
  label: string
}

function ButtonFilter({
  onClick,
  onRemoveRequest,
  label,
  icon,
  className,
  ...rest
}: ButtonFilterProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-nowrap text-sm text-gray-500 transition duration-300 ease-in-out',
        'hover:bg-gray-200 bg-gray-100 rounded',
        className
      )}
      {...rest}
    >
      <button
        type='button'
        data-test-id='ButtonFilter-main'
        onClick={onClick}
        className={cn('font-bold', 'flex items-center', 'pl-4 py-[10px]', {
          'pr-4': onRemoveRequest == null,
          'pr-1': onRemoveRequest != null
        })}
      >
        {icon != null ? (
          <Icon
            name={icon}
            className='mr-2 text-base'
            data-test-id='ButtonFilter-icon'
          />
        ) : null}
        <span className='before:block before:-mt-0.5 inline-block'>
          {label}
        </span>
      </button>
      {onRemoveRequest != null ? (
        <button
          type='button'
          data-test-id='ButtonFilter-remove'
          className='pl-1 pr-4'
          onClick={onRemoveRequest}
          aria-label={`Remove ${label}`}
        >
          <Icon name='x' className='text-base' />
        </button>
      ) : null}
    </div>
  )
}

ButtonFilter.displayName = 'ButtonFilter'
export { ButtonFilter }
