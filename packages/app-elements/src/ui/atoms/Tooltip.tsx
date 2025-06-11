import { getInnerText } from '#utils/children'
import cn from 'classnames'
import { forwardRef, type JSX, type ReactNode } from 'react'
import {
  Tooltip as ReactTooltip,
  type PlacesType,
  type TooltipRefProps
} from 'react-tooltip'

export { type TooltipRefProps } from 'react-tooltip'

export interface TooltipProps {
  /** Tooltip unique identifier  */
  id?: string
  /** Label that triggers the opening of the tooltip  */
  label: ReactNode
  /** Content to be rendered inside the tooltip box */
  content: ReactNode
  /**
   * Desired direction where the tooltip content will be opened in relation to the label.
   * If the tooltip is too close to the edge of the screen, it will be repositioned automatically.
   * @default 'top'
   */
  direction?: Extract<
    PlacesType,
    'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'
  >
  /**
   * If true, the tooltip will have a fixed width of 280px.
   * If false or undefined, the tooltip will have a max-width of 280px and no minimum width.
   */
  minWidth?: boolean
}

/**
 * Render a label that will open a tooltip box when hovered/focused.
 * Both label and content can be any ReactNode.
 *
 * This component is a wrapper around react-tooltip.
 */
export const Tooltip = forwardRef<TooltipRefProps, TooltipProps>(
  (
    {
      label,
      content,
      direction = 'top',
      minWidth = false,
      id = `${getSanitizedInnerText(label)}-${getSanitizedInnerText(content)}-${direction}`
    },
    ref
  ): JSX.Element => {
    return (
      <>
        <span
          aria-description={getInnerText(content)}
          data-tooltip-id={id}
          className='cursor-pointer'
        >
          {label}
        </span>
        <ReactTooltip
          id={id}
          ref={ref}
          place={direction}
          clickable
          imperativeModeOnly={ref != null}
          // We are using our own styles, by applying tailwind classes
          // https://react-tooltip.com/docs/examples/styling#base-styles
          disableStyleInjection
          className={cn(
            'rounded bg-black text-white px-4 py-3 text-sm font-semibold w-max',
            {
              'max-w-[280px]': !minWidth,
              'min-w-[280px]': minWidth
            }
          )}
          classNameArrow={cn('w-2 h-2', {
            'rotate-[45deg]': direction.includes('top'),
            'rotate-[225deg]': direction.includes('bottom')
          })}
        >
          {content}
        </ReactTooltip>
      </>
    )
  }
)

Tooltip.displayName = 'Tooltip'

function getSanitizedInnerText(node: ReactNode): string {
  return getInnerText(node).replace(/\W+/g, '').toLowerCase()
}
