import cn from 'classnames'
import { Icon } from './Icon'

export type StatusIconProps = {
  /**
   * CSS classes
   */
  className?: string
} & (
  | {
      /**
       * A different icon will be displayed depending on the status. When status is `progress` we can also pass a `percentage` prop
       */
      status: 'success' | 'danger' | 'pending'
    }
  | {
      /**
       * A different icon will be displayed depending on the status. When status is `progress` we can also pass a `percentage` prop
       */
      status: 'progress'
      /**
       * Only used when `status` is progress. Accepts number from 0 to 100
       */
      percentage: number
    }
)

function StatusIcon({ className, ...props }: StatusIconProps): JSX.Element {
  switch (props.status) {
    case 'danger':
      return (
        <Icon
          className={className}
          name='x'
          background='red'
          gap='large'
          data-test-id='icon-danger'
        />
      )

    case 'success':
      return (
        <Icon
          className={className}
          name='check'
          background='green'
          gap='large'
          data-test-id='icon-success'
        />
      )

    case 'progress':
      return (
        <ProgressCircle className={className} percentage={props.percentage} />
      )

    case 'pending':
      return <PendingCircle className={className} />
  }
}

const ProgressCircle = ({
  percentage,
  className
}: {
  percentage: number
  className?: string
}): JSX.Element => {
  const circleSize = 50
  const strokeWidth = 8
  const radius = circleSize - strokeWidth // radius needs to be smaller than circe size because the stroke is outer
  const viewBox = `0 0 ${circleSize * 2} ${circleSize * 2}`
  const circumference = radius * 2 * Math.PI
  const circumferenceDelta = circumference - (percentage / 100) * circumference // this is the gray part (percentage left)

  return (
    <svg
      data-test-id='icon-progress'
      viewBox={viewBox}
      xmlns='http://www.w3.org/2000/svg'
      className={cn(
        'w-[42px] h-[42px] transform -rotate-90 rounded-full',
        className
      )}
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

const PendingCircle = ({ className }: { className?: string }): JSX.Element => (
  <div
    data-test-id='icon-pending'
    className={cn(
      'w-[42px] h-[42px] rounded-full border-gray-500 border border-dashed',
      className
    )}
  />
)

StatusIcon.displayName = 'StatusIcon'
export { StatusIcon }
