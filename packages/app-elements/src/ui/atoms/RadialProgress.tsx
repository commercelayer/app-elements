import cn from 'classnames'
import { type SVGAttributes } from 'react'
import { Icon, type IconProps } from './Icon'

interface RadialProgressProps extends SVGAttributes<SVGElement> {
  /**
   * Progress percentage express as number from 0 to 100.
   * When not specified, it will render a dashed circle (eg: pending state)
   */
  percentage?: number
  /**
   * Size variant to match `Icon` dimension.
   * When missing, default size is 42px, small is 24px
   * @default 'large'
   */
  size?: 'small' | 'large'
  /**
   * Optional icon to be rendered in the center of the circle
   */
  icon?: IconProps['name']
}

function RadialProgress({
  percentage,
  className,
  size = 'large',
  icon,
  ...rest
}: RadialProgressProps): JSX.Element {
  const sizePixels = size === 'small' ? 24 : 42
  const viewBox = `0 0 ${sizePixels * 2} ${sizePixels * 2}`
  const circumference = sizePixels * 2 * Math.PI
  const emptyOffset =
    circumference - (parsePercentageRange(percentage) / 100) * circumference

  return (
    <div className='relative'>
      <svg
        data-testid='radial-progress'
        viewBox={viewBox}
        xmlns='http://www.w3.org/2000/svg'
        className={cn('transform -rotate-90 rounded-full', className)}
        width={sizePixels}
        height={sizePixels}
        {...rest}
      >
        {percentage == null ? (
          // pending
          <circle
            data-testid='radial-progress-pending'
            cx={sizePixels}
            cy={sizePixels}
            r={sizePixels}
            className='text-gray-500'
            stroke='currentColor'
            strokeWidth='4'
            strokeDasharray='6'
            fill={icon != null ? 'white' : 'transparent'}
          />
        ) : (
          // progress
          <>
            <circle
              data-testid='radial-progress-base'
              cx={sizePixels}
              cy={sizePixels}
              r={sizePixels}
              className='text-gray-100'
              stroke='currentColor'
              strokeWidth='12'
              fill={icon != null ? 'white' : 'transparent'}
            />
            <circle
              data-testid='radial-progress-percentage'
              cx={sizePixels}
              cy={sizePixels}
              r={sizePixels}
              className='text-primary transition-all duration-500'
              stroke='currentColor'
              strokeWidth='12'
              fill='transparent' // always transparent or will cover the circle behind
              strokeDasharray={circumference}
              strokeDashoffset={emptyOffset} // this is the gray part, to not be filled (percentage left)
            />
          </>
        )}
      </svg>
      {icon != null && (
        <Icon
          name={icon}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          data-testid='radial-progress-icon'
        />
      )}
    </div>
  )
}

/**
 * Enforce a range between 0 and 100
 * @param percentage probably a number
 * @returns a number from 0 to 100
 */
function parsePercentageRange(percentage: any): number {
  if (isNaN(percentage) || percentage < 0) {
    return 0
  }

  if (percentage > 100) {
    return 100
  }

  return percentage
}

RadialProgress.displayName = 'RadialProgress'
export { RadialProgress }
