import { formatDate, timeSeparator } from '#helpers/date'
import { Badge } from '#ui/atoms/Badge'
import { Card } from '#ui/atoms/Card'
import { Icon } from '#ui/atoms/Icon'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Input } from '#ui/forms/Input'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'
import { Fragment, type ReactNode, useMemo } from 'react'

export interface TimelineEvent {
  date: string
  message: ReactNode
  note?: string
}

type Position = 'first' | 'other'

type EventWithIcon = TimelineEvent & {
  position: Position
  icon: JSX.Element
}

interface Props {
  events: TimelineEvent[]
  timezone?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
}

export const Timeline = withSkeletonTemplate<Props>(
  ({ events, timezone, onChange, onKeyDown }) => {
    const groupedEvents = useMemo(() => {
      const ordered: EventWithIcon[] = orderBy(events, 'date', 'desc').map(
        (event, index, arr) => {
          const position: Position =
            index === events.length - 1 ? 'first' : 'other'
          return {
            ...event,
            position,
            icon: getIcon(event, position)
          }
        }
      )
      return groupBy(ordered, (val) =>
        formatDate({
          isoDate: val.date,
          format: 'date',
          timezone
        }).toUpperCase()
      )
    }, [events, timezone])
    return (
      <div data-test-id='timeline'>
        <Input
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
                  data-test-id='timeline-date-group'
                  className='rounded-full bg-gray-100 py-1 px-3 font-bold'
                  label={date}
                  variant='secondary'
                />
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
                        data-test-id='timeline-event-icon'
                        className='bg-white py-1'
                      >
                        {event.icon}
                      </div>
                    </div>
                    <div data-test-id='timeline-event-message'>
                      {event.message} {timeSeparator}{' '}
                      {formatDate({
                        format: 'time',
                        isoDate: event.date,
                        timezone
                      })}
                    </div>
                  </div>
                  {event.note != null && (
                    <div className='flex gap-2 mt-1'>
                      <div>
                        <div className='w-6' />
                      </div>
                      <Card
                        data-test-id='timeline-event-note'
                        className='w-full'
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

function getIcon(event: TimelineEvent, position: Position): JSX.Element {
  if (event.note != null) {
    return <Icon name='chatCircle' background='black' gap='small' />
  }

  return position === 'first' ? (
    <Icon name='flag' background='black' gap='small' />
  ) : (
    <Icon
      name='check'
      background='gray'
      className='!text-transparent rounded-full !w-[16px] !h-[16px] mx-1'
    />
  )
}
