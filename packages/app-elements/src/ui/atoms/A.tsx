import { type SetRequired } from 'type-fest'

export type Props = SetRequired<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>

/**
 * This component wraps an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) HTML element.
 * <blockquote type='info'>All the props are directly sent to the anchor element.</blockquote>
 */
export const A: React.FC<Props> = ({ children, href, ...rest }) => {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}

A.displayName = 'A'
