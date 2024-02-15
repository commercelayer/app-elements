import cn from 'classnames'
import { forwardRef, type ReactNode } from 'react'
import {
  Tooltip as ReactTooltip,
  type PlacesType,
  type TooltipRefProps
} from 'react-tooltip'

export { type TooltipRefProps } from 'react-tooltip'

export interface TooltipProps {
  /** Tooltip unique identifier  */
  id: string
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
}

/**
 * Render a label that will open a tooltip box when hovered/focused.
 * Both label and content can be any ReactNode.
 *
 * This component is a wrapper around react-tooltip.
 */
export const Tooltip = forwardRef<TooltipRefProps, TooltipProps>(
  ({ id, label, content, direction = 'top' }, ref): JSX.Element => {
    return (
      <>
        <span
          aria-describedby={id}
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
          className='rounded bg-black text-white px-4 py-3 text-sm font-semibold w-max'
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
