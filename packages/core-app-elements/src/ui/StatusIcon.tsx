import { Check, X } from 'phosphor-react'
import invariant from 'ts-invariant'

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
    <div {...rest} className='w-10 h-10'>
      <>{statusVariant[status]({ percentage })}</>
    </div>
  )
}

const statusVariant: Record<
  StatusUI,
  ((p?: any) => JSX.Element) | (() => JSX.Element)
> = {
  progress: (p) => <ProgressCircle {...p} />,
  success: () => <SuccessCircle />,
  pending: () => <PendingCircle />,
  danger: () => <DangerCircle />
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

const SuccessCircle = (): JSX.Element => (
  <div
    data-test-id='icon-success'
    className='flex justify-center align-middle text-center items-center w-full h-full rounded-full bg-green border-green border text-white'
  >
    <Check />
  </div>
)

const PendingCircle = (): JSX.Element => (
  <div
    data-test-id='icon-pending'
    className='w-full h-full rounded-full border-gray-500 border border-dashed'
  />
)

const DangerCircle = (): JSX.Element => (
  <div
    data-test-id='icon-danger'
    className='flex justify-center align-middle text-center items-center w-full h-full rounded-full bg-red border-red border text-white'
  >
    <X />
  </div>
)

export default StatusIcon
