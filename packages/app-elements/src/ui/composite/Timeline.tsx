import { formatDate, isCurrentYear, isToday } from '#helpers/date'
import { Card } from '#ui/atoms/Card'
import { Icon } from '#ui/atoms/Icon'
import { Input } from '#ui/forms/Input'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'
import { FC, Fragment, ReactNode, useMemo } from 'react'

interface Event {
  date: string
  message: ReactNode
  note?: string
}

type EventWithIcon = Event & {
  icon: JSX.Element
}

interface Props {
  events: Event[]
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
}

export const Timeline: FC<Props> = ({ events, onChange, onKeyDown }) => {
  const groupedEvents = useMemo(() => {
    const ordered: EventWithIcon[] = orderBy(events, 'date', 'desc').map(
      (event, index, arr) => {
        return { ...event, icon: getIcon(event, index, arr) }
      }
    )
    return groupBy(ordered, (val) => getDate(val.date))
  }, [events])
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
            <div className='my-6 bg-gray-100 h-[1px] relative'>
              <div
                data-test-id='timeline-date-group'
                className='rounded-full bg-gray-100 text-xs text-gray-500 py-1 px-3 font-bold absolute -top-[13px] right-0'
              >
                {date.toUpperCase()}
              </div>
            </div>
            {eventsByDate.map((event) => (
              <Fragment key={event.date}>
                <div className='flex gap-2 mt-6 items-center'>
                  <div className='relative -left-[13px] self-start'>
                    <div
                      data-test-id='timeline-event-icon'
                      className='bg-white py-1'
                    >
                      {event.icon}
                    </div>
                  </div>
                  <div data-test-id='timeline-event-message'>
                    {event.message}
                  </div>
                </div>
                {event.note != null && (
                  <div className='flex gap-2 mt-1'>
                    <div>
                      <div className='w-6' />
                    </div>
                    <Card data-test-id='timeline-event-note'>{event.note}</Card>
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

function getDate(isoDate: string): string {
  return isToday(isoDate)
    ? 'TODAY'
    : formatDate({
        isoDate,
        format: isCurrentYear(isoDate) ? 'noYear' : 'noTime'
      })
}

function getIcon(event: Event, index: number, events: Event[]): JSX.Element {
  const isFirst = index === events.length - 1

  if (event.note != null) {
    return <Icon name='chatCircle' background='black' gap='small' />
  }

  return isFirst ? (
    <Icon name='flag' background='black' gap='small' />
  ) : (
    <div className='bg-gray-300 rounded-full w-[16px] h-[16px] mx-1' />
  )
}
