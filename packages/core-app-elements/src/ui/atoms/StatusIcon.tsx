import invariant from 'ts-invariant'
import Icon from './Icon'

export type StatusUI = 'success' | 'danger' | 'pending' | 'progress'

export interface StatusIconProps {
  /**
   * A different icon will be displayed depending on the status. When status is `progress` we can also pass a `percentage` prop
   */
  status: StatusUI
  /**
   * Only used when `status` is progress. Accepts number from 0 to 100
   */
  percentage?: number
}

export function StatusIcon({
  status,
  percentage,
  ...rest
}: StatusIconProps): JSX.Element {
  const isNotProgress = status !== 'progress' && percentage == null
  const isValidProgress = status === 'progress' && percentage != null
  const isValidProgressRange =
    isValidProgress && percentage >= 0 && percentage <= 100

  invariant(
    isNotProgress || isValidProgress,
    'Percentage needs to be used, and only used, when status is progress'
  )

  invariant(
    isNotProgress || isValidProgressRange,
    `Percentage must be between 0 and 10`
  )

  return (
    <div {...rest} className='w-[42px] h-[42px]'>
      <>{statusVariant[status]({ percentage })}</>
    </div>
  )
}

const statusVariant: Record<
  StatusUI,
  ((p?: any) => JSX.Element) | (() => JSX.Element)
> = {
  success: () => <Icon name='check' background='green' gap='large' />,
  danger: () => <Icon name='x' background='red' gap='large' />,
  progress: (p) => <ProgressCircle {...p} />,
  pending: () => <PendingCircle />
}

const ProgressCircle = ({
  percentage
}: {
  percentage: number
}): JSX.Element => {
  const circleSize = 50
  const strokeWidth = 8
  const radius = circleSize - strokeWidth // radius needs to be smaller than circe size because the stroke is outer
  const viewBox = `0 0 ${circleSize * 2} ${circleSize * 2}`
  const circumference = radius * 2 * Math.PI
  const circumferenceDelta = circumference - (percentage / 100) * circumference // this is the gray part (percentage left)

  return (
    <svg
      viewBox={viewBox}
      xmlns='http://www.w3.org/2000/svg'
      className='transform -rotate-90'
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

const PendingCircle = (): JSX.Element => (
  <div
    data-test-id='icon-pending'
    className='w-full h-full rounded-full border-gray-500 border border-dashed'
  />
)

export default StatusIcon
