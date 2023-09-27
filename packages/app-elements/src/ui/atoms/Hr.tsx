import cn from 'classnames'

type Props = Omit<React.HTMLProps<HTMLHRElement>, 'children'>

/**
 * This component wraps an [`<hr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr) HTML element.
 * <span type='info'>All the props are directly sent to the horizontal rule element.</span>
 */
export const Hr: React.FC<Props> = ({ className, ...rest }) => {
  return (
    <hr className={cn(['border-t border-gray-100', className])} {...rest} />
  )
}

Hr.displayName = 'Hr'
