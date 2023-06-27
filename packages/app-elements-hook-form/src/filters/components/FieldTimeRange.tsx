import { InputDate } from '#components/InputDate'
import { ToggleButtons } from '#components/ToggleButtons'
import {
  PageLayout,
  Spacer,
  useOverlayNavigation,
  useTokenProvider
} from '@commercelayer/app-elements'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  getTimeRangeCustomLabel,
  getTimeRangePresetName
} from '../methods/timeUtils'
import {
  filtrableTimeRangePreset,
  type FilterItemTime,
  type TimeRangeFormValues
} from '../methods/types'

interface FieldTimeRangeProps {
  item: FilterItemTime
}

export function FieldTimeRange({ item }: FieldTimeRangeProps): JSX.Element {
  const { user } = useTokenProvider()
  const { Overlay, close, open } = useOverlayNavigation({
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
      <ToggleButtons
        label={item.label}
        name='timePreset'
        mode='single'
        options={filtrableTimeRangePreset.map((option) => {
          const label =
            option === 'custom' && timeFrom != null && timeTo != null
              ? getTimeRangeCustomLabel(timeFrom, timeTo, user?.timezone)
              : getTimeRangePresetName(option)
          return {
            label,
            value: option
          }
        })}
      />
      <Overlay
        button={{
          label: 'Apply',
          onClick: () => {
            void trigger().then((isValid) => {
              if (isValid) {
                close()
              }
            })
          }
        }}
      >
        <PageLayout
          title='Custom Time Range'
          onGoBack={() => {
            setValue('timeFrom', null)
            setValue('timeTo', null)
            setValue('timePreset', null)
            close()
          }}
        >
          <Spacer bottom='14'>
            <InputDate
              name='timeFrom'
              label='From'
              isClearable
              preventOpenOnFocus
            />
          </Spacer>
          <Spacer bottom='14'>
            <InputDate
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
