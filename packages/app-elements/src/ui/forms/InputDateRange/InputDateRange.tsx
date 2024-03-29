import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { ArrowRight } from '@phosphor-icons/react'
import { forwardRef, useEffect } from 'react'
import { InputDate } from '../InputDate'
import {
  type InputDateProps,
  type MaybeDate
} from '../InputDate/InputDateComponent'

export interface InputDateRangeProps
  extends Pick<InputDateProps, 'isClearable' | 'format' | 'autoPlaceholder'>,
    InputWrapperBaseProps {
  /**
   * a tuple that represents the [from, to] dates
   */
  value: [MaybeDate, MaybeDate]
  /**
   * callback triggered when one of the two dates changes
   */
  onChange: (dates: [MaybeDate, MaybeDate]) => void
  /**
   * optional placeholder text for the `from` date
   */
  fromPlaceholder?: string
  /**
   * optional placeholder text for the `to` date
   */
  toPlaceholder?: string
}

export const InputDateRange = forwardRef<HTMLDivElement, InputDateRangeProps>(
  (
    {
      value = [null, null],
      fromPlaceholder,
      toPlaceholder,
      label,
      format,
      autoPlaceholder,
      isClearable,
      onChange,
      hint,
      feedback,
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
          onChange([fromDate, fromDate])
        }
      },
      [fromDate]
    )

    return (
      <InputWrapper label={label} hint={hint} feedback={feedback} {...rest}>
        <div className='flex items-center'>
          <InputDate
            value={fromDate}
            onChange={(newDate) => {
              onChange([newDate, toDate])
            }}
            placeholder={fromPlaceholder}
            format={format}
            wrapperClassName='flex-1'
            isClearable={isClearable}
            autoPlaceholder={autoPlaceholder}
            feedback={feedback}
          />
          <div className='px-2 text-gray-300'>
            <ArrowRight size={24} />
          </div>
          <InputDate
            value={toDate}
            onChange={(newDate) => {
              onChange([fromDate, newDate])
            }}
            placeholder={toPlaceholder}
            minDate={fromDate ?? undefined}
            format={format}
            wrapperClassName='flex-1'
            isClearable={isClearable}
            autoPlaceholder={autoPlaceholder}
            feedback={feedback}
          />
        </div>
      </InputWrapper>
    )
  }
)

InputDateRange.displayName = 'InputDateRange'
