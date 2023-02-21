import { ReactNode } from 'react'
import cn from 'classnames'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link'
export type ButtonSize = 'small' | 'regular' | 'large'

const sizeCss: Record<ButtonSize, string> = {
  small: 'px-6 py-2',
  regular: 'px-6 py-3',
  large: 'px-8 py-4'
}

const variantCss: Record<ButtonVariant, string> = {
  primary: 'bg-black text-white hover:opacity-80',
  secondary:
    'bg-white border border-gray-300 text-black hover:opacity-80 hover:bg-gray-50',
  danger: 'bg-white border border-red text-red hover:bg-red/10',
  link: 'border border-transparent hover:opacity-80'
}

function Button({
  children,
  className,
  size = 'regular',
  variant = 'primary',
  disabled,
  ...rest
}: Props): JSX.Element {
  return (
    <button
      className={cn([
        className,
        'text-sm rounded text-center font-bold transition-opacity duration-500 focus:outline-none',
        { 'opacity-50 pointer-events-none touch-none': disabled },
        sizeCss[size],
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
export { Button }
