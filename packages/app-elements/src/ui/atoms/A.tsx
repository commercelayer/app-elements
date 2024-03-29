import cn from 'classnames'
import { type SetRequired } from 'type-fest'
import {
  getInteractiveElementClassName,
  type InteractiveElementProps
} from '../internals/InteractiveElement.className'

export type AProps = SetRequired<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> &
  InteractiveElementProps

/**
 * This component wraps an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) HTML element.
 * <span type='info'>This component is always rendered as an accessible `<a>` HTML element. It has the same props from the `Button` component, so it can renders as a button (UI only).</span>
 */
export const A: React.FC<AProps> = ({
  alignItems,
  children,
  className,
  disabled,
  fullWidth,
  href,
  size = 'regular',
  variant = 'link',
  ...rest
}) => {
  return (
    <a
      className={cn(
        className,
        getInteractiveElementClassName({
          alignItems,
          children,
          disabled,
          fullWidth,
          size,
          variant
        })
      )}
      aria-disabled={disabled}
      href={href}
      {...rest}
    >
      {children}
    </a>
  )
}

A.displayName = 'A'
