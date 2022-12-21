import { ReactNode } from 'react'
import cn from 'classnames'

export interface SpacingProps {
  /*
   * Value to be applied as `margin-top`
   */
  top?: SpacingValues
  /*
   * Value to be applied as `margin-bottom`.
   */
  bottom?: SpacingValues
  children?: ReactNode
}

/*
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

export function Spacer({
  top,
  bottom,
  children,
  ...rest
}: SpacingProps): JSX.Element {
  const valueTop = top ?? 'none'
  const valueBottom = bottom ?? 'none'

  return (
    <div
      className={cn([marginTopCss[valueTop], marginBottomCss[valueBottom]])}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Spacer
