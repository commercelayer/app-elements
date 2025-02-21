import cn from 'classnames'
import { type JSX, type ReactNode } from 'react'

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value to be applied as `margin-top`
   */
  top?: SpacerValues
  /**
   * Value to be applied as `margin-bottom`.
   */
  bottom?: SpacerValues
  /**
   * Value to be applied as `margin-left`.
   */
  left?: SpacerValues
  /**
   * Value to be applied as `margin-right`.
   */
  right?: SpacerValues
  children?: ReactNode
}

/**
 * Possible values are:
 * 2: 0.5rem, 8px
 * 4: 1rem, 16px
 * 6: 1.5rem, 24px
 * 8: 2rem, 32px
 * 12: 3rem, 48px
 * 14: 3.5rem, 56px
 */
type SpacerValues = '1' | '2' | '4' | '6' | '8' | '10' | '12' | '14'

const marginTopCss: Record<SpacerValues | 'none', string> = {
  none: '',
  '1': 'mt-1',
  '2': 'mt-2',
  '4': 'mt-4',
  '6': 'mt-6',
  '8': 'mt-8',
  '10': 'mt-10',
  '12': 'mt-12',
  '14': 'mt-14'
}

const marginBottomCss: Record<SpacerValues | 'none', string> = {
  none: '',
  '1': 'mb-1',
  '2': 'mb-2',
  '4': 'mb-4',
  '6': 'mb-6',
  '8': 'mb-8',
  '10': 'mb-10',
  '12': 'mb-12',
  '14': 'mb-14'
}

const marginLeftCss: Record<SpacerValues | 'none', string> = {
  none: '',
  '1': 'ml-1',
  '2': 'ml-2',
  '4': 'ml-4',
  '6': 'ml-6',
  '8': 'ml-8',
  '10': 'ml-10',
  '12': 'ml-12',
  '14': 'ml-14'
}

const marginRightCss: Record<SpacerValues | 'none', string> = {
  none: '',
  '1': 'mr-1',
  '2': 'mr-2',
  '4': 'mr-4',
  '6': 'mr-6',
  '8': 'mr-8',
  '10': 'mr-10',
  '12': 'mr-12',
  '14': 'mr-14'
}

function Spacer({
  top,
  bottom,
  left,
  right,
  children,
  ...rest
}: SpacerProps): JSX.Element {
  const valueTop = top ?? 'none'
  const valueBottom = bottom ?? 'none'
  const valueLeft = left ?? 'none'
  const valueRight = right ?? 'none'

  return (
    <div
      className={cn([
        marginTopCss[valueTop],
        marginBottomCss[valueBottom],
        marginLeftCss[valueLeft],
        marginRightCss[valueRight]
      ])}
      {...rest}
    >
      {children}
    </div>
  )
}

Spacer.displayName = 'Spacer'
export { Spacer }
