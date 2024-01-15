import cn from 'classnames'
import { Icon, type IconProps } from './Icon'

type ButtonCardPadding = 'none' | '4' | '6'

const paddingCss: Record<ButtonCardPadding, string> = {
  none: 'p-0',
  '4': 'p-4',
  '6': 'p-6'
}

export interface ButtonCardProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  padding?: ButtonCardPadding
  icon?: IconProps['name']
  iconLabel?: string
  fullWidth?: boolean
  children?: React.ReactNode
}

function ButtonCard({
  padding = '4',
  icon,
  iconLabel,
  fullWidth,
  children,
  className,
  ...rest
}: ButtonCardProps): JSX.Element {
  return (
    <button
      type='button'
      data-testid='ButtonCard-main'
      className={cn(
        'border border-dashed border-gray-300 hover:border-primary hover:border-solid hover:ring-inset hover:ring-1 hover:ring-primary',
        paddingCss[padding],
        children == null ? 'rounded' : 'rounded-md',
        children == null && 'text-primary',
        fullWidth === true && 'w-full',
        className
      )}
      {...rest}
    >
      <div className='flex items-center justify-between'>
        {children}
        {(icon != null || iconLabel != null) && (
          <div
            className={cn(
              'flex items-center gap-2 justify-center',
              children == null ? 'w-full' : null
            )}
          >
            {icon != null && (
              <Icon
                name={icon}
                size={32}
                className='shrink-0'
                data-testid='ButtonCard-icon'
              />
            )}
            {iconLabel != null && (
              <span
                className='inline-block font-bold'
                data-testid='ButtonCard-iconLabel'
              >
                {iconLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}

ButtonCard.displayName = 'ButtonCard'
export { ButtonCard }
