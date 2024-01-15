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
  /**
   * Set button content padding
   */
  padding?: ButtonCardPadding
  /**
   * Set button width to 100%
   */
  fullWidth?: boolean
  /**
   * Optional button free content
   */
  children?: React.ReactNode
  /**
   * Optional button icon name
   */
  icon?: IconProps['name']
  /**
   * Optional button icon label
   */
  iconLabel?: string
}

/**
 * Renders a `button` tag with customizable content and Card-like UI.
 * <span type='info'>Content can be customized by providing `children` and/or `icon` and/or `iconLabel` props.</span>
 */
export function ButtonCard({
  padding = '4',
  fullWidth,
  children,
  icon,
  iconLabel,
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
