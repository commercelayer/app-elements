import { type ReactNode } from 'react'
import cn from 'classnames'

export interface SpacingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value to be applied as `margin-top`
   */
  top?: SpacingValues
  /**
   * Value to be applied as `margin-bottom`.
   */
  bottom?: SpacingValues
  /**
   * Value to be applied as `margin-left`.
   */
  left?: SpacingValues
  /**
   * Value to be applied as `margin-right`.
   */
  right?: SpacingValues
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
export type SpacingValues = '2' | '4' | '6' | '8' | '12' | '14'

const marginTopCss: Record<SpacingValues | 'none', string> = {
  none: '',
  '2': 'mt-2',
  '4': 'mt-4',
  '6': 'mt-6',
  '8': 'mt-8',
  '12': 'mt-12',
  '14': 'mt-14'
}

const marginBottomCss: Record<SpacingValues | 'none', string> = {
  none: '',
  '2': 'mb-2',
  '4': 'mb-4',
  '6': 'mb-6',
  '8': 'mb-8',
  '12': 'mb-12',
  '14': 'mb-14'
}

const marginLeftCss: Record<SpacingValues | 'none', string> = {
  none: '',
  '2': 'ml-2',
  '4': 'ml-4',
  '6': 'ml-6',
  '8': 'ml-8',
  '12': 'ml-12',
  '14': 'ml-14'
}

const marginRightCss: Record<SpacingValues | 'none', string> = {
  none: '',
  '2': 'mr-2',
  '4': 'mr-4',
  '6': 'mr-6',
  '8': 'mr-8',
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
}: SpacingProps): JSX.Element {
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
