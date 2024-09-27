import { type FlexRowProps } from '#ui/internals/FlexRow'
import { removeUnwantedProps } from '#utils/htmltags'
import cn from 'classnames'
import { type FC } from 'react'

type Props = Pick<FlexRowProps, 'children'> & {
  /**
   * Icon component
   * Example: `<StatusIcon>` or `<RadialProgress>` or `<Avatar>`
   */
  icon?: JSX.Element
}

export type TagProps = React.HTMLAttributes<HTMLElement> &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick' | 'href'> &
  Props

export const Tag: FC<TagProps> = ({ icon, children, className, ...rest }) => {
  const wantedProps =
    'overflow' in rest ? removeUnwantedProps(rest, ['overflow']) : rest
  const JsxTag =
    rest.href != null ? 'a' : rest.onClick != null ? 'button' : 'div'
  const hasHover = rest.onClick != null || rest.href != null

  return (
    <JsxTag
      className={cn([
        className,
        'flex gap-2 items-center select-none',
        'text-black text-sm',
        'px-4 py-1',
        'rounded border border-solid border-gray-200',
        'bg-gray-50',
        {
          'cursor-pointer hover:bg-gray-100  outline-primary-light': hasHover
        }
      ])}
      type={JsxTag === 'button' ? 'button' : undefined}
      // we don't want `tag` and eventually `buttonStyle` props to be present as attribute on html tag
      // still we need to be part of `rest` to discriminate the union type
      {...(wantedProps as any)}
    >
      {icon != null && <div className='flex-shrink-0'>{icon}</div>}
      {children}
    </JsxTag>
  )
}

Tag.displayName = 'Tag'
