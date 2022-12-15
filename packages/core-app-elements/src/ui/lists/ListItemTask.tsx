import { CaretRight } from 'phosphor-react'
import { Button } from '#ui/atoms/Button'
import { StatusIcon, StatusUI } from '#ui/atoms/StatusIcon'

export interface ListItemTaskProps {
  /*
   * define the status to show the proper icon
   */
  status: StatusUI
  /*
   * Only accepted if status is `progress'
   */
  progressPercentage?: number
  /*
   * Main text to show
   */
  title: string
  /*
   * Optional text to display below the title
   */
  description?: React.ReactNode
  /*
   * Optional onClick callback, triggered on the entire element
   */
  onClick?: () => void
  /*
   * When set, this will render a `Cancel` button to cancel the current task
   */
  onCancelRequest?: () => void
}

export function ListItemTask({
  status,
  progressPercentage,
  onClick,
  title,
  onCancelRequest,
  description,
  ...rest
}: ListItemTaskProps): JSX.Element {
  return (
    <div
      className='flex gap-4 px-3 sm:px-5 py-4 first:border-t border-b border-gray-100 hover:cursor-pointer hover:bg-gray-50'
      onClick={onClick}
      {...rest}
    >
      <div className='scale-75 sm:scale-100'>
        <StatusIcon
          status={status}
          percentage={status === 'progress' ? progressPercentage : undefined}
        />
      </div>

      <div className='flex flex-col justify-between items-start'>
        <button className='font-semibold'>
          <h4 data-test-id='list-task-item-title'>{title}</h4>
        </button>
        {description != null && (
          <div
            className='text-sm font-medium text-gray-500'
            data-test-id='list-task-item-description'
          >
            {description}
          </div>
        )}
      </div>

      <div className='ml-auto flex items-center'>
        {onCancelRequest != null ? (
          <Button
            variant='danger'
            size='small'
            onClick={(e) => {
              e.stopPropagation()
              onCancelRequest()
            }}
            data-test-id='list-task-item-btn-cancel'
          >
            Cancel
          </Button>
        ) : (
          <Button
            variant='link'
            size='small'
            data-test-id='list-task-item-btn-view'
          >
            <CaretRight />
          </Button>
        )}
      </div>
    </div>
  )
}

export default ListItemTask
