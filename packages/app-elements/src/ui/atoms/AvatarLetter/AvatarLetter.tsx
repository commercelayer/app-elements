import { getDeterministicValue, getInitials } from '#utils/text'
import classNames from 'classnames'
import { useMemo } from 'react'
import { BG_COLORS, getTextColorForBackground } from './colors'

interface AvatarLetterProps {
  /**
   * text to be used to generate initials
   */
  text: string
  /**
   * css class name
   */
  className?: string
  style?: React.CSSProperties
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
  ...rest
}: AvatarLetterProps): JSX.Element {
  const backgroundColor = useMemo(
    () => getDeterministicValue(text, BG_COLORS) ?? '#FFFFFF',
    [text]
  )
  return (
    <div
      className={classNames(
        className,
        'w-[42px] h-[42px] rounded-full',
        'flex items-center justify-center',
        'font-bold text-sm',
        {
          'text-white': getTextColorForBackground(backgroundColor) === 'white',
          'text-black': getTextColorForBackground(backgroundColor) === 'black'
        }
      )}
      style={{
        backgroundColor,
        ...style
      }}
      {...rest}
    >
      {getInitials(text)}
    </div>
  )
}

AvatarLetter.displayName = 'AvatarLetter'
