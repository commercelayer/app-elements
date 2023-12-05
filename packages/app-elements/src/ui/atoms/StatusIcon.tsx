import cn from 'classnames'
import { Icon } from './Icon'
import { type iconMapping } from './Icon/icons'

export interface StatusIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Name of the icon to display
   */
  name: keyof typeof iconMapping
  /**
   * Background color, `none` for no background
   */
  background?:
    | 'green'
    | 'orange'
    | 'red'
    | 'gray'
    | 'teal'
    | 'white'
    | 'black'
    | 'none'
  /**
   * padding around the icon can bne: 'none' | 'small' | 'large'
   */
  gap?: 'none' | 'small' | 'large'
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  name,
  className,
  background = 'none',
  gap = 'none',
  ...rest
}) => {
  return (
    <div
      className={cn([
        'inline-block',
        'align-middle',
        'w-fit',
        // padding
        { 'p-[10px]': gap === 'large' },
        { 'p-[3px]': gap === 'small' },
        // variants
        { 'border rounded-full': background !== 'none' },
        { 'bg-green border-green text-white': background === 'green' },
        { 'bg-red border-red text-white': background === 'red' },
        { 'bg-gray-300 border-gray-300 text-white': background === 'gray' },
        { 'bg-orange border-orange text-white': background === 'orange' },
        { 'bg-teal border-teal text-white': background === 'teal' },
        { 'bg-white border-gray-200': background === 'white' },
        { 'bg-gray-800 border-gray-800 text-white': background === 'black' },
        // className
        className
      ])}
      {...rest}
    >
      <Icon
        name={name}
        size={gap === 'large' ? '1.25rem' : undefined}
        weight={background !== 'none' ? 'bold' : undefined}
      />
    </div>
  )
}

StatusIcon.displayName = 'StatusIcon'
