import cn from 'classnames'
import { SVGAttributes } from 'react'

interface RadialProgressProps extends SVGAttributes<SVGElement> {
  /**
   * Progress percentage express as number from 0 to 100
   */
  percentage: number
}

function RadialProgress({
  percentage,
  className,
  ...rest
}: RadialProgressProps): JSX.Element {
  const circleSize = 50
  const strokeWidth = 8
  const radius = circleSize - strokeWidth // radius needs to be smaller than circe size because the stroke is outer
  const viewBox = `0 0 ${circleSize * 2} ${circleSize * 2}`
  const circumference = radius * 2 * Math.PI
  const circumferenceDelta =
    circumference - (parsePercentageRange(percentage) / 100) * circumference // this is the gray part (percentage left)

  return (
    <svg
      data-test-id='radial-progress'
      viewBox={viewBox}
      xmlns='http://www.w3.org/2000/svg'
      className={cn(
        'w-[42px] h-[42px] transform -rotate-90 rounded-full',
        className
      )}
      {...rest}
    >
      <circle
        cx={circleSize}
        cy={circleSize}
        r={radius}
        className='text-gray-100'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        fill='transparent'
      />
      <circle
        data-test-id='radial-progress-fill'
        cx={circleSize}
        cy={circleSize}
        r={radius}
        className='text-primary transition-all duration-500'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        fill='transparent'
        strokeDasharray={circumference}
        strokeDashoffset={circumferenceDelta}
      />
    </svg>
  )
}

RadialProgress.displayName = 'RadialProgress'
export { RadialProgress }

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
