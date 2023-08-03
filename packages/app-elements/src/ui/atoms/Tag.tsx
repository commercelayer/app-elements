import { type FlexRowProps } from '#ui/internals/FlexRow'
import { enforceAllowedTags, removeTagProp } from '#utils/htmltags'
import cn from 'classnames'
import isEmpty from 'lodash/isEmpty'
import { useMemo, type FC } from 'react'

type Props = Pick<FlexRowProps, 'children'> & {
  /**
   * Icon component
   * Example: `<Icon>` or `<RadialProgress>` or `<Avatar>`
   */
  icon?: JSX.Element
}

export type TagProps = Props &
  (
    | ({
        /**
         * HTML tag to render
         */
        tag: 'div'
      } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>)
    | ({
        /**
         * HTML tag to render
         */
        tag: 'a'
      } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>)
  )

const Tag: FC<TagProps> = ({ icon, children, className, ...rest }) => {
  const JsxTag = useMemo(
    () =>
      enforceAllowedTags({
        tag: rest.tag,
        allowedTags: ['a', 'div'],
        defaultTag: 'div'
      }),
    [rest.tag]
  )
  const hasHover =
    rest.onClick != null || (rest.tag === 'a' && !isEmpty(rest.href))

  return (
    <JsxTag
      className={cn([
        className,
        'flex gap-1 items-center select-none',
        'text-black text-sm font-semibold',
        'px-4 py-1',
        'rounded border border-solid border-gray-200',
        {
          'cursor-pointer hover:bg-gray-50 text-primary outline-primary-light':
            hasHover
        }
      ])}
      // we don't want `tag` prop to be present as attribute on html tag
      // still we need to be part of `rest` to discriminate the union type
      {...(removeTagProp(rest) as any)}
    >
      {icon != null && <div className='flex-shrink-0'>{icon}</div>}
      {children}
    </JsxTag>
  )
}

Tag.displayName = 'Tag'
export { Tag }
