import cn from 'classnames'
import { FlexRow, FlexRowProps } from '#ui/atoms/FlexRow'
import { FC, useMemo } from 'react'

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
  borderStyle?: 'dashed' | 'solid'
}

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
  tag = 'div',
  ...rest
}) => {
  const JsxTag = useMemo(
    // enforce allowed tags only
    () => enforceAllowedTags(tag),
    [tag]
  )
  const hasHover = rest.onClick != null || tag === 'a'

  return (
    <JsxTag
      className={cn(
        'flex gap-4 py-4 border-b border-gray-100',
        {
          'px-4': gutter !== 'none',
          'border-dashed': borderStyle === 'dashed',
          'cursor-pointer hover:bg-gray-50': hasHover
        },
        className
      )}
      {...(rest as any)}
    >
      <div className='flex gap-4 flex-1'>
        {icon != null && <div className='flex-shrink-0'>{icon}</div>}
        <FlexRow alignItems={alignItems}>{children}</FlexRow>
      </div>
    </JsxTag>
  )
}

ListItem.displayName = 'ListItem'
export { ListItem }

const allowedTags = ['a', 'div'] as const
type AllowedTag = typeof allowedTags[number]
function enforceAllowedTags(
  tag: AllowedTag
): Extract<keyof JSX.IntrinsicElements, AllowedTag> {
  return allowedTags.includes(tag) ? tag : 'div'
}
