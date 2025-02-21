import cn from 'classnames'
import { type JSX, type ReactNode } from 'react'

type TextVariant =
  | 'danger'
  | 'success'
  | 'primary'
  | 'warning'
  | 'info'
  | 'plain'
  | 'disabled'
type TextSize = 'small' | 'regular' | 'large' | 'inherit'
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'inherit'
type TextAlignment = 'center' | 'left' | 'right' | 'inherit'
type TextWrap = 'normal' | 'nowrap' | 'inherit'

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode
  variant?: TextVariant
  size?: TextSize
  weight?: TextWeight
  align?: TextAlignment
  wrap?: TextWrap
  tag?: 'div' | 'span'
}

function Text({
  children,
  className,
  variant = 'plain',
  weight = 'inherit',
  size = 'inherit',
  align = 'inherit',
  wrap = 'inherit',
  tag = 'span',
  ...rest
}: TextProps): JSX.Element {
  const computedClassName = cn(className, {
    // variant
    'text-green-600': variant === 'success',
    'text-red-500': variant === 'danger',
    'text-primary': variant === 'primary',
    'text-gray-500': variant === 'info',
    'text-orange-600': variant === 'warning',
    'text-gray-300': variant === 'disabled',
    // weight
    'font-regular': weight === 'regular',
    'font-medium': weight === 'medium',
    'font-semibold': weight === 'semibold',
    'font-bold': weight === 'bold',
    // size
    'text-sm': size === 'small',
    'text-base': size === 'regular',
    'text-title': size === 'large',
    // size
    'text-left': align === 'left',
    'text-right': align === 'right',
    'text-center': align === 'center',
    // wrap
    'whitespace-nowrap': wrap === 'nowrap',
    'whitespace-normal': wrap === 'normal',
    '[overflow-wrap:anywhere]': true
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
