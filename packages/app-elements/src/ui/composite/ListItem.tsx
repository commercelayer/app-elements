import { FlexRow, type FlexRowProps } from '#ui/internals/FlexRow'
import { enforceAllowedTags, removeUnwantedProps } from '#utils/htmltags'
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
   * Icon alignment
   * @default 'top'
   */
  alignIcon?: 'top' | 'center' | 'bottom'
  /**
   * Control the horizontal padding (`x`) or vertical padding (`y`).
   * You can specify `none` to remove the padding.
   * @default 'xy'
   */
  padding?: 'xy' | 'x' | 'y' | 'none'
  /**
   * Control the padding size.
   * @default '4'
   */
  paddingSize?: '4' | '2'
  /**
   * Border style to render
   * @default 'solid'
   */
  borderStyle?: 'dashed' | 'solid' | 'none'
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

export const ListItem: FC<ListItemProps> = ({
  icon,
  children,
  className,
  padding = 'xy',
  paddingSize = '4',
  alignItems = 'center',
  alignIcon = 'top',
  borderStyle = 'solid',
  ...rest
}) => {
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

  const pySize = cn({
    'py-4': paddingSize === '4',
    'py-2': paddingSize === '2'
  })

  const pxSize = cn({
    'px-4': paddingSize === '4',
    'px-2': paddingSize === '2'
  })

  return (
    <JsxTag
      className={cn(
        'flex gap-4 border-gray-100',
        'text-gray-800 hover:text-gray-800 font-normal', // keep default text color also when used as `<a>` tag
        {
          [pySize]: padding !== 'none' && padding !== 'x',
          [pxSize]: padding !== 'none' && padding !== 'y',
          'border-dashed': borderStyle === 'dashed',
          'border-b': borderStyle !== 'none',
          'cursor-pointer hover:bg-gray-50': hasHover
        },
        className
      )}
      // we don't want `tag` prop to be present as attribute on html tag
      // still we need to be part of `rest` to discriminate the union type
      {...(removeUnwantedProps(rest, ['tag']) as any)}
    >
      <div className={cn('flex gap-4 flex-1 items-center')}>
        {icon != null && (
          <div
            className={cn('flex-shrink-0', {
              // If icon is aligned to top we add a margin to simulate centered alignment
              // of icon with right content of most common case with one or two rows of text
              // like in case of ListItem Order
              'my-0.5': alignIcon === 'top',
              'self-center': alignIcon === 'center',
              'self-start': alignIcon === 'top',
              'self-end': alignIcon === 'bottom'
            })}
          >
            {icon}
          </div>
        )}
        <FlexRow alignItems={alignItems}>{children}</FlexRow>
      </div>
    </JsxTag>
  )
}

ListItem.displayName = 'ListItem'
