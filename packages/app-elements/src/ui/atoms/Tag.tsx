import { type FlexRowProps } from '#ui/internals/FlexRow'
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

const allowedTags = ['a', 'div'] as const
type AllowedTag = (typeof allowedTags)[number]

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
  const JsxTag = useMemo(() => enforceAllowedTags(rest.tag), [rest.tag])
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

function enforceAllowedTags(
  tag: AllowedTag
): Extract<keyof JSX.IntrinsicElements, AllowedTag> {
  return allowedTags.includes(tag) ? tag : 'div'
}

function removeTagProp<T extends object>(props: T): Omit<T, 'tag'> {
  return {
    ...props,
    tag: undefined
  }
}

Tag.displayName = 'Tag'
export { Tag }
