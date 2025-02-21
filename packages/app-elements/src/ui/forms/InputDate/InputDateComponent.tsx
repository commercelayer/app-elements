import DatePicker from 'react-datepicker'

import {
  InputWrapper,
  getFeedbackStyle,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { CalendarBlank, X } from '@phosphor-icons/react'
import cn from 'classnames'
import { forwardRef, type JSX } from 'react'

export type MaybeDate = Date | null

export interface InputDateProps extends InputWrapperBaseProps {
  /**
   * Controlled value
   */
  value?: MaybeDate
  /**
   * Callback fired when value is changed
   */
  onChange: (date: MaybeDate) => void
  /**
   * Optional CSS class names used for the outer wrapper/container element
   */
  wrapperClassName?: string
  /**
   * Optional CSS class names used for the input element
   */
  inputClassName?: string
  /**
   * Optional placeholder text
   */
  placeholder?: string
  /**
   * Show the time selector
   */
  showTimeSelect?: boolean | undefined
  /**
   * String to be parsed as formatter (eg. MM/dd/yyyy, dd-MM-yy, ect...).
   * When undefined, will autodetect format from user's browser
   */
  format?: string
  /**
   * Disable selection of previous dates
   */
  minDate?: Date
  /**
   * Set placeholder as detected date format
   */
  autoPlaceholder?: boolean
  /**
   * Enables a button to clear the selected date
   */
  isClearable?: boolean
  /**
   * Prevent the date picker calendar from opening on focus,
   * this is useful when showing validation error message and
   * to avoid the calendar to open on top of the error message
   */
  preventOpenOnFocus?: boolean
}

export const InputDateComponent = forwardRef<DatePicker, InputDateProps>(
  (
    {
      onChange,
      value,
      wrapperClassName,
      inputClassName,
      showTimeSelect = false,
      format,
      placeholder,
      minDate,
      label,
      autoPlaceholder,
      isClearable,
      hint,
      feedback,
      preventOpenOnFocus,
      ...rest
    },
    ref
  ): JSX.Element => {
    const dateFormat = format ?? detectDateTimeFormat(showTimeSelect)
    return (
      <InputWrapper
        {...rest}
        className={wrapperClassName}
        hint={hint}
        feedback={feedback}
        label={label}
      >
        <div className='relative w-full'>
          <DatePicker
            ref={ref}
            selected={value}
            onChange={onChange}
            dateFormat={dateFormat}
            showTimeSelect={showTimeSelect}
            placeholderText={
              autoPlaceholder === true ? dateFormat.toLowerCase() : placeholder
            }
            minDate={minDate}
            openToDate={value ?? minDate}
            className={cn(
              'block w-full px-4 py-2.5 placeholder:text-gray-400 font-medium',
              'rounded outline-0',
              'transition duration-500 ease-in-out focus:outline-0 focus:border-primary-light',
              getFeedbackStyle(feedback),
              inputClassName
            )}
            preventOpenOnFocus={preventOpenOnFocus}
          />
          <div className='absolute top-0 bottom-0 right-4 flex items-center pointer-events-none touch-none'>
            <CalendarBlank />
          </div>
          {value != null && isClearable === true ? (
            <button
              className='absolute top-0 bottom-0 right-11 flex items-center'
              onClick={() => {
                onChange(null)
              }}
            >
              <X />
            </button>
          ) : null}
        </div>
      </InputWrapper>
    )
  }
)

InputDateComponent.displayName = 'InputDateComponent'

function detectDateTimeFormat(showTime: boolean): string {
  const date = new Date(2023, 11, 15) //  15th of December

  const dateFormat = date
    .toLocaleDateString()
    .replace('15', 'dd')
    .replace('12', 'MM')
    .replace('2023', 'yyyy')

  const timeFormat = ', h:mm aa'

  return `${dateFormat}${showTime ? timeFormat : ''}`
}
