import { type SetRequired } from 'type-fest'

export type AProps = SetRequired<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>

/**
 * This component wraps an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) HTML element.
 * <span type='info'>All the props are directly sent to the anchor element.</span>
 */
export const A: React.FC<AProps> = ({ children, href, ...rest }) => {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}

A.displayName = 'A'
