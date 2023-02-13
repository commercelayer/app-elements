import cn from 'classnames'
import { ReactNode } from 'react'

export type TextVariant = 'danger' | 'success' | 'primary' | 'plain' | 'info'
export type TextSize = 'small' | 'regular' | 'large'

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode
  variant?: TextVariant
  size?: TextSize
  tag?: 'div' | 'span'
}

function Text({
  children,
  className,
  variant,
  size,
  tag = 'span',
  ...rest
}: TextProps): JSX.Element {
  const computedClassName = cn(className, {
    // variant
    'text-green': variant === 'success',
    'text-red': variant === 'danger',
    'text-primary': variant === 'primary',
    'text-gray-500': variant === 'info',
    // size
    'text-sm': size === 'small',
    'text-title': size === 'large'
  })
  return tag === 'span' ? (
    <span {...rest} className={computedClassName}>
      {children}
    </span>
  ) : (
    <div {...rest} className={computedClassName}>
      {children}
    </div>
  )
}

Text.displayName = 'Text'
export { Text }
