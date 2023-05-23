import classNames from 'classnames'
import { useMemo } from 'react'

interface AvatarLetterProps {
  /**
   * text to be used to generate initials
   */
  text: string
  /**
   * css class name
   */
  className?: string
}

function AvatarLetter({
  text,
  className,
  ...rest
}: AvatarLetterProps): JSX.Element {
  const backgroundColor = useMemo(
    () => getDeterministicColor(text, BG_COLORS),
    [text]
  )
  return (
    <div
      className={classNames(
        className,
        'w-[42px] h-[42px] rounded-full',
        'flex items-center justify-center',
        'font-bold text-sm text-white'
      )}
      style={{
        backgroundColor
      }}
      {...rest}
    >
      {getInitials(text)}
    </div>
  )
}

AvatarLetter.displayName = 'AvatarLetter'
export { AvatarLetter }

export function getInitials(text: string): string {
  const textParts = text.toUpperCase().split(' ')

  if (textParts.length > 1 && textParts[1].length > 0) {
    const [firstName, lastName] = textParts
    return `${firstName[0]}${lastName[0]}`
  }

  return textParts[0].slice(0, 2)
}

export function getDeterministicColor(text: string, colors: string[]): string {
  const utf8Encode = new TextEncoder()
  const hashCode = utf8Encode.encode(text).reduce((sum, v) => sum + v, 0)
  const colorIndex = hashCode % colors.length
  return colors[colorIndex]
}

const BG_COLORS: string[] = [
  '#101111',
  '#666EFF',
  '#055463',
  '#F40009',
  '#FF656B',
  '#FFAB2E',
  '#942e0c',
  '#0A472D',
  '#181650',
  '#A00148',
  '#3b36f5',
  '#0BB7D8',
  '#F40009',
  '#f98107',
  '#F5DC00',
  '#11A868',
  '#D80261',
  '#181650',
  '#055463',
  '#4B0003',
  '#461202',
  '#4D4500',
  '#03160E',
  '#310016',
  '#942e0c',
  '#840005'
]
