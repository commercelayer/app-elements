import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { ArrowRight } from '@phosphor-icons/react'
import classNames from 'classnames'
import { endOfDay } from 'date-fns/endOfDay'
import { forwardRef, type JSX, useEffect } from 'react'
import { InputDate } from '../InputDate'
import {
  type InputDateProps,
  type MaybeDate
} from '../InputDate/InputDateComponent'

export interface InputDateRangeProps
  extends Pick<
      InputDateProps,
      | 'isClearable'
      | 'format'
      | 'timezone'
      | 'autoPlaceholder'
      | 'showTimeSelect'
    >,
    InputWrapperBaseProps {
  /** a tuple that represents the [from, to] dates */
  value: [MaybeDate, MaybeDate]
  /** callback triggered when one of the two dates changes */
  onChange: (dates: [MaybeDate, MaybeDate]) => void

  /** label to be displayed on the `from` date input. */
  fromLabel?: string
  /** optional placeholder text for the `from` date  */
  fromPlaceholder?: string
  /** optional hint text for the `from` date  */
  fromHint?: InputWrapperBaseProps['hint']
  /** label to be displayed on the `to` date input */
  /** optional feedback message for the `from` date  */
  fromFeedback?: InputWrapperBaseProps['feedback']

  toLabel?: string
  /** optional placeholder text for the `to` date */
  toPlaceholder?: string
  /** optional hint text for the `to` date  */
  toHint?: InputWrapperBaseProps['hint']
  /** optional feedback message for the `to` date  */
  toFeedback?: InputWrapperBaseProps['feedback']
}

export const InputDateRange = forwardRef<HTMLDivElement, InputDateRangeProps>(
  (
    {
      value = [null, null],
      fromPlaceholder,
      toPlaceholder,
      label,
      format,
      timezone,
      autoPlaceholder,
      isClearable,
      onChange,
      hint,
      feedback,
      showTimeSelect,
      fromLabel,
      toLabel,
      fromHint,
      toHint,
      fromFeedback,
      toFeedback,
      ...rest
    },
    ref
  ): JSX.Element => {
    const [fromDate, toDate] = value

    useEffect(
      function syncToDateWhenFromIsFuture() {
        if (fromDate == null || toDate == null) {
          return
        }

        if (fromDate > toDate) {
          onChange([
            fromDate,
            showTimeSelect === true ? fromDate : toEndOfDay(fromDate)
          ])
        }
      },
      [fromDate, toDate]
    )

    const hasSingleLabels = fromLabel != null || toLabel != null

    return (
      <InputWrapper label={label} hint={hint} feedback={feedback} {...rest}>
        <div
          className={classNames('flex', {
            'items-center': !hasSingleLabels,
            'items-start': hasSingleLabels
          })}
        >
          <InputDate
            value={fromDate}
            onChange={(newDate) => {
              onChange([newDate, toDate])
            }}
            placeholder={fromPlaceholder}
            format={format}
            timezone={timezone}
            wrapperClassName='flex-1'
            isClearable={isClearable}
            autoPlaceholder={autoPlaceholder}
            feedback={fromFeedback}
            showTimeSelect={showTimeSelect}
            label={fromLabel}
            hint={fromHint}
          />
          <div className='px-4 text-gray-300'>
            {hasSingleLabels ? null : <ArrowRight size={24} />}
          </div>
          <InputDate
            value={toDate}
            onChange={(newDate) => {
              onChange([
                fromDate,
                showTimeSelect === true ? newDate : toEndOfDay(newDate)
              ])
            }}
            placeholder={toPlaceholder}
            minDate={fromDate ?? undefined}
            format={format}
            timezone={timezone}
            wrapperClassName='flex-1'
            isClearable={isClearable}
            autoPlaceholder={autoPlaceholder}
            feedback={toFeedback}
            showTimeSelect={showTimeSelect}
            label={toLabel}
            hint={toHint}
          />
        </div>
      </InputWrapper>
    )
  }
)

// quick helper to set the time to the end of the day compatible with nullable date
function toEndOfDay(date: Date | null): Date | null {
  if (date == null) {
    return null
  }
  return endOfDay(date)
}

InputDateRange.displayName = 'InputDateRange'
