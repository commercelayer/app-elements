import { getDeterministicValue, getInitials } from '#utils/text'
import classNames from 'classnames'
import { useMemo } from 'react'
import { BG_COLORS, getTextColorForBackground } from './colors'

export interface AvatarLetterProps {
  /**
   * Text to be used to generate initials
   */
  text: string
  /**
   * CSS class name
   */
  className?: string
  style?: React.CSSProperties
  children?: (values: {
    initials: string
    backgroundColor: string
    textColor: string
  }) => JSX.Element
}

/**
 * This component can be used to show a profile picture without being forced to use an image.
 *
 * It takes the text and renders the initials with a background.
 * <span type="info" title="Background color">Given the same text, the background color will be always the same.</span>
 */
export function AvatarLetter({
  text,
  className,
  style,
  children,
  ...rest
}: AvatarLetterProps): JSX.Element {
  const initials = useMemo(() => getInitials(text), [text])
  const backgroundColor = useMemo(
    () => getDeterministicValue(text, BG_COLORS) ?? '#FFFFFF',
    [text]
  )
  const textColor = useMemo(
    () => getTextColorForBackground(backgroundColor),
    [backgroundColor]
  )

  if (children != null) {
    return children({
      initials,
      backgroundColor,
      textColor
    })
  }

  return (
    <div
      className={classNames(
        className,
        'w-[42px] h-[42px] rounded-full',
        'flex items-center justify-center',
        'font-bold text-sm',
        {
          'text-white': textColor === 'white',
          'text-black': textColor === 'black'
        }
      )}
      style={{
        backgroundColor,
        ...style
      }}
      {...rest}
    >
      {initials}
    </div>
  )
}

AvatarLetter.displayName = 'AvatarLetter'
