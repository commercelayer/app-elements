import { formatDate, sortAndGroupByDate, timeSeparator } from '#helpers/date'
import { Badge } from '#ui/atoms/Badge'
import { Card } from '#ui/atoms/Card'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'
import { Input } from '#ui/forms/Input'
import { Fragment, useMemo, type ReactNode } from 'react'

export interface TimelineEvent {
  date: string
  author?: string
  message: ReactNode
  note?: string
}

type EventWithIcon = TimelineEvent & {
  icon: JSX.Element
}

export interface TimelineProps {
  disabled?: boolean
  events: TimelineEvent[]
  timezone?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
}

export const Timeline = withSkeletonTemplate<TimelineProps>(
  ({ disabled, events, timezone, onChange, onKeyDown }) => {
    const groupedEvents = useMemo(() => {
      const eventsWithIcon: EventWithIcon[] = events.map((event) => ({
        ...event,
        icon: getIcon(event)
      }))

      return sortAndGroupByDate(eventsWithIcon, { timezone })
    }, [events, timezone])
    return (
      <div data-testid='timeline'>
        <Input
          disabled={disabled}
          onKeyDown={onKeyDown}
          onChange={onChange}
          className='relative bg-gray-50'
          placeholder='Leave a note or comment'
        />
        <div className='border-gray-100 border-l-2 ml-[13px]'>
          <div className='pt-2 pb-4 text-right text-sm text-gray-400'>
            Only you and other staff can see comments
          </div>
          {Object.entries(groupedEvents).map(([date, eventsByDate]) => (
            <div key={date}>
              <div className='flex items-center my-6'>
                <div className='bg-gray-100 h-[1px] grow' />
                <Badge
                  data-testid='timeline-date-group'
                  className='rounded-full bg-gray-100 py-1 px-3 font-bold'
                  variant='secondary'
                >
                  {date}
                </Badge>
              </div>
              {eventsByDate.map((event) => (
                <Fragment key={event.date}>
                  <div className='flex gap-2 mt-6 items-center'>
                    <div
                      className={`relative -left-[13px] ${
                        event.position === 'first'
                          ? 'self-stretch bg-white'
                          : 'self-start'
                      }`}
                    >
                      <div
                        data-testid='timeline-event-icon'
                        className='bg-white py-1'
                      >
                        {event.icon}
                      </div>
                    </div>
                    <div data-testid='timeline-event-message'>
                      <>
                        {event.author != null && (
                          <Text weight='bold' className='text-black'>
                            {event.author}{' '}
                          </Text>
                        )}
                        <Text variant='info'>
                          {event.message} {timeSeparator}{' '}
                          {formatDate({
                            format: 'time',
                            isoDate: event.date,
                            timezone
                          })}
                        </Text>
                      </>
                    </div>
                  </div>
                  {event.note != null && (
                    <div className='flex gap-2 mt-1'>
                      <div>
                        <div className='w-6' />
                      </div>
                      <Card
                        overflow='hidden'
                        data-testid='timeline-event-note'
                        className='w-full mt-1'
                      >
                        {event.note}
                      </Card>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
)

function getIcon(event: TimelineEvent): JSX.Element {
  if (event.note != null) {
    return <StatusIcon name='chatCircle' background='black' gap='small' />
  }

  return (
    <StatusIcon
      name='check'
      background='gray'
      className='!text-transparent rounded-full !w-[16px] !h-[16px] mx-1'
    />
  )
}
