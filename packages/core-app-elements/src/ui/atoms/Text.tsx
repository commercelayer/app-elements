import cn from 'classnames'
import { ReactNode } from 'react'

export type TextVariant =
  | 'danger'
  | 'success'
  | 'primary'
  | 'orange'
  | 'info'
  | 'plain'
export type TextSize = 'small' | 'regular' | 'large' | 'inherit'
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'inherit'
export type TextAlignment = 'center' | 'left' | 'right' | 'inherit'
export type TextWrap = 'normal' | 'nowrap' | 'inherit'

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
    'text-green': variant === 'success',
    'text-red': variant === 'danger',
    'text-primary': variant === 'primary',
    'text-gray-500': variant === 'info',
    'text-orange': variant === 'orange',
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
    'whitespace-normal': wrap === 'normal'
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
