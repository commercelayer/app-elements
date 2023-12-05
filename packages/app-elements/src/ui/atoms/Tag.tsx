import { type FlexRowProps } from '#ui/internals/FlexRow'
import { enforceAllowedTags, removeUnwantedProps } from '#utils/htmltags'
import cn from 'classnames'
import { useMemo, type FC } from 'react'

type Props = Pick<FlexRowProps, 'children'> & {
  /**
   * Icon component
   * Example: `<StatusIcon>` or `<RadialProgress>` or `<Avatar>`
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
        tag: 'button'
        buttonStyle: 'anchor' | 'button'
      } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>)
  )

export const Tag: FC<TagProps> = ({ icon, children, className, ...rest }) => {
  const JsxTag = useMemo(
    () =>
      enforceAllowedTags({
        tag: rest.tag,
        allowedTags: ['button', 'div'],
        defaultTag: 'div'
      }),
    [rest.tag]
  )
  const hasHover = rest.onClick != null && rest.tag === 'button'
  const wantedProps =
    rest.tag === 'button'
      ? removeUnwantedProps(rest, ['tag', 'buttonStyle'])
      : removeUnwantedProps(rest, ['tag'])

  return (
    <JsxTag
      className={cn([
        className,
        'flex gap-2 items-center select-none',
        'text-black text-sm',
        'px-4 py-1',
        'rounded border border-solid border-gray-200',
        {
          'cursor-pointer hover:bg-gray-50  outline-primary-light': hasHover,
          'font-semibold': hasHover && rest.buttonStyle === 'button',
          'text-primary font-bold': hasHover && rest.buttonStyle === 'anchor'
        }
      ])}
      type={rest.tag === 'button' ? 'button' : undefined}
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
