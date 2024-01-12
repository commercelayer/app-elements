import { formatDateRange } from '#helpers/date'
import { useOverlay } from '#hooks/useOverlay'
import { useTokenProvider } from '#providers/TokenProvider'
import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { PageLayout } from '#ui/composite/PageLayout'
import { HookedInputDate } from '#ui/forms/InputDate'
import { HookedInputToggleButton } from '#ui/forms/InputToggleButton'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { getDefaultBrowserTimezone, getTimeRangePresetName } from './timeUtils'
import {
  filterableTimeRangePreset,
  type FilterItemTime,
  type TimeRangeFormValues
} from './types'

interface FieldTimeRangeProps {
  item: FilterItemTime
}

export function FieldTimeRange({ item }: FieldTimeRangeProps): JSX.Element {
  const { user } = useTokenProvider()
  const { Overlay, close, open } = useOverlay({
    queryParam: `timeRangePickerView`
  })

  const { watch, setValue, trigger } = useFormContext<TimeRangeFormValues>()
  const timePreset = watch('timePreset')
  const timeFrom = watch('timeFrom')
  const timeTo = watch('timeTo')

  useEffect(
    function openToTimeRangePickerOverlay() {
      const isRangeNotSet = timeFrom == null || timeTo == null
      if (timePreset === 'custom' && isRangeNotSet) {
        open()
      }
    },
    [timePreset]
  )

  useEffect(
    function resetTimeRangeOnPreset() {
      if (timePreset !== 'custom') {
        setValue('timeFrom', null)
        setValue('timeTo', null)
      }
    },
    [timePreset]
  )

  useEffect(
    function validateOnChange() {
      void trigger('timeFrom')
    },
    [timeFrom]
  )

  useEffect(
    function validateOnChange() {
      void trigger('timeTo')
    },
    [timeTo]
  )

  return (
    <>
      <HookedInputToggleButton
        label={item.label}
        name='timePreset'
        mode='single'
        options={filterableTimeRangePreset.map((option) => {
          const label =
            option === 'custom' && timeFrom != null && timeTo != null
              ? formatDateRange({
                  rangeFrom: timeFrom.toString(),
                  rangeTo: timeTo.toString(),
                  timezone: user?.timezone ?? getDefaultBrowserTimezone()
                })
              : getTimeRangePresetName(option)
          return {
            label,
            value: option
          }
        })}
      />
      <Overlay
        footer={
          <Button
            fullWidth
            type='button'
            onClick={() => {
              void trigger().then((isValid) => {
                if (isValid) {
                  close()
                }
              })
            }}
          >
            Apply
          </Button>
        }
      >
        <PageLayout
          title='Custom Time Range'
          navigationButton={{
            label: 'Back',
            onClick: () => {
              setValue('timeFrom', null)
              setValue('timeTo', null)
              setValue('timePreset', null)
              close()
            }
          }}
        >
          <Spacer bottom='14'>
            <HookedInputDate
              name='timeFrom'
              label='From'
              isClearable
              preventOpenOnFocus
            />
          </Spacer>
          <Spacer bottom='14'>
            <HookedInputDate
              name='timeTo'
              label='To'
              minDate={timeFrom ?? undefined}
              isClearable
              preventOpenOnFocus
            />
          </Spacer>
        </PageLayout>
      </Overlay>
    </>
  )
}
