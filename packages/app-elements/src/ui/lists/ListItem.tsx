import { FlexRow, type FlexRowProps } from '#ui/atoms/FlexRow'
import cn from 'classnames'
import isEmpty from 'lodash/isEmpty'
import { useMemo, type FC } from 'react'

type Props = Pick<FlexRowProps, 'alignItems' | 'children'> & {
  /**
   * Icon component
   * Example: `<Icon>` or `<RadialProgress>` or `<Avatar>`
   */
  icon?: JSX.Element
  /**
   * Specify `none` to remove side gutter
   */
  gutter?: 'none'
  /**
   * Border style to render
   */
  borderStyle?: 'dashed' | 'solid' | 'none'
}

const allowedTags = ['a', 'div'] as const
type AllowedTag = (typeof allowedTags)[number]

export type ListItemProps = Props &
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

const ListItem: FC<ListItemProps> = ({
  icon,
  children,
  className,
  gutter,
  alignItems = 'center',
  borderStyle = 'solid',
  ...rest
}) => {
  const JsxTag = useMemo(() => enforceAllowedTags(rest.tag), [rest.tag])
  const hasHover =
    rest.onClick != null || (rest.tag === 'a' && !isEmpty(rest.href))

  return (
    <JsxTag
      className={cn(
        'flex gap-4 py-4 border-gray-100',
        {
          'px-4': gutter !== 'none',
          'border-dashed': borderStyle === 'dashed',
          'border-b': borderStyle !== 'none',
          'cursor-pointer hover:bg-gray-50': hasHover
        },
        className
      )}
      // we don't want `tag` prop to be present as attribute on html tag
      // still we need to be part of `rest` to discriminate the union type
      {...(removeTagProp(rest) as any)}
    >
      <div className='flex gap-4 flex-1'>
        {icon != null && <div className='flex-shrink-0'>{icon}</div>}
        <FlexRow alignItems={alignItems}>{children}</FlexRow>
      </div>
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

ListItem.displayName = 'ListItem'
export { ListItem }
