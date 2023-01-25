import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './InputDate.css'

import cn from 'classnames'
import { CalendarBlank, X } from 'phosphor-react'
import Label from '#ui/forms/Label'
import { forwardRef } from 'react'

export type MaybeDate = Date | null

export interface InputDateProps {
  /**
   * optional input label
   */
  label?: string
  /**
   * controlled value
   */
  value?: MaybeDate
  /**
   * callback fired when value is changed
   */
  onChange: (date: MaybeDate) => void
  /**
   * optional css class names used for the outer wrapper/container element
   */
  wrapperClassName?: string
  /**
   * optional css class names used for the input element
   */
  inputClassName?: string
  /**
   * optional placeholder text
   */
  placeholder?: string
  /**
   * string to be parsed as formatter (eg. MM/dd/yyyy, dd-MM-yy, ect...).
   * When undefined, will autodetect format from user's browser
   */
  format?: string
  /**
   * disable selection of previous dates
   */
  minDate?: Date
  /**
   * set placeholder as detected date format
   */
  autoPlaceholder?: boolean
  /**
   * enables a button to clear the selected date
   */
  isClearable?: boolean
}

function InputDateComponent(
  {
    onChange,
    value,
    wrapperClassName,
    inputClassName,
    format,
    placeholder,
    minDate,
    label,
    autoPlaceholder,
    isClearable,
    ...rest
  }: InputDateProps,
  ref: React.ForwardedRef<DatePicker>
): JSX.Element {
  const dateFormat = format ?? detectDateFormat()
  return (
    <div {...rest} className={wrapperClassName}>
      {label != null && <Label gap>{label}</Label>}
      <div className='relative'>
        <DatePicker
          ref={ref}
          selected={value}
          onChange={onChange}
          dateFormat={dateFormat}
          placeholderText={
            autoPlaceholder === true ? dateFormat.toLowerCase() : placeholder
          }
          minDate={minDate}
          openToDate={value ?? minDate}
          className={cn(
            'block w-full px-4 py-2 h-10 placeholder:text-gray-400 font-medium',
            'border border-gray-200 rounded outline-0',
            'transition duration-500 ease-in-out focus:outline-0 focus:border-primary-light',
            inputClassName
          )}
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
    </div>
  )
}

export default forwardRef<DatePicker, InputDateProps>(InputDateComponent)

function detectDateFormat(): string {
  const date = new Date(2023, 11, 15) //  15th of December
  let format = date.toLocaleDateString()
  format = format.replace('15', 'dd')
  format = format.replace('12', 'MM')
  format = format.replace('2023', 'yyyy')
  return format
}
