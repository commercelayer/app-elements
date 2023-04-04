import cn from 'classnames'
import { type SVGAttributes } from 'react'

interface RadialProgressProps extends SVGAttributes<SVGElement> {
  /**
   * Progress percentage express as number from 0 to 100.
   * When not specified, it will render a dashed circle (eg: pending state)
   */
  percentage?: number
  /**
   * Size in pixels, default is 42
   */
  size?: number
}

function RadialProgress({
  percentage,
  className,
  size = 42,
  ...rest
}: RadialProgressProps): JSX.Element {
  const viewBox = `0 0 ${size * 2} ${size * 2}`
  const circumference = size * 2 * Math.PI
  const emptyOffset =
    circumference - (parsePercentageRange(percentage) / 100) * circumference

  return (
    <svg
      data-test-id='radial-progress'
      viewBox={viewBox}
      xmlns='http://www.w3.org/2000/svg'
      className={cn('transform -rotate-90 rounded-full', className)}
      width={size}
      height={size}
      {...rest}
    >
      {percentage == null ? (
        // pending
        <circle
          data-test-id='radial-progress-pending'
          cx={size}
          cy={size}
          r={size}
          className='text-gray-500'
          stroke='currentColor'
          strokeWidth='4'
          strokeDasharray='6'
          fill='transparent'
        />
      ) : (
        // progress
        <>
          <circle
            data-test-id='radial-progress-base'
            cx={size}
            cy={size}
            r={size}
            className='text-gray-100'
            stroke='currentColor'
            strokeWidth='12'
            fill='transparent'
          />
          <circle
            data-test-id='radial-progress-percentage'
            cx={size}
            cy={size}
            r={size}
            className='text-primary transition-all duration-500'
            stroke='currentColor'
            strokeWidth='12'
            fill='transparent'
            strokeDasharray={circumference}
            strokeDashoffset={emptyOffset} // this is the gray part, to not be filled (percentage left)
          />
        </>
      )}
    </svg>
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
