import cn from 'classnames'
import { type ReactNode } from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button content
   */
  children: ReactNode
  /**
   * Render a different variant
   */
  variant?: ButtonVariant
  /**
   * Set button size
   */
  size?: ButtonSize
  /**
   * Set button width to 100%
   */
  fullWidth?: boolean
  /**
   * Flex content alignment with a standard gap
   */
  alignItems?: 'center'
}

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link'
type ButtonSize = 'small' | 'regular' | 'large'

const sizeCss: Record<ButtonSize, string> = {
  small: 'px-4 py-2',
  regular: 'px-6 py-3',
  large: 'px-8 py-4'
}

const variantCss: Record<ButtonVariant, string> = {
  primary: 'font-bold bg-black border border-black text-white hover:opacity-80',
  secondary:
    'font-semibold bg-white border border-black text-black hover:opacity-80 hover:bg-gray-50',
  danger: 'font-bold bg-white border border-red text-red hover:bg-red/10',
  link: 'font-bold text-primary hover:opacity-80'
}

/** Button component is used to trigger an action or event, such as submitting a form, opening a Dialog, or performing an action. */
export function Button({
  children,
  className,
  size = 'regular',
  variant = 'primary',
  disabled,
  fullWidth,
  alignItems,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      className={cn([
        className,
        'rounded text-center focus:outline-none whitespace-nowrap',
        {
          'opacity-50 pointer-events-none touch-none': disabled,
          'w-full': fullWidth === true,
          'flex gap-1': alignItems != null,
          'items-center': alignItems === 'center',
          [`text-sm transition-opacity duration-500 ${sizeCss[size]}`]:
            variant !== 'link'
        },
        variantCss[variant]
      ])}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

Button.displayName = 'Button'
