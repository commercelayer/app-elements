import { ArrowRight } from 'phosphor-react'
import InputDate from './InputDate'
import Label from './Label'
import { useEffect } from 'react'

export interface InputDateRangeProps {
  /**
   * optional input label
   */
  label?: string
  /**
   * value for the `from` date
   */
  fromDate?: Date
  /**
   * triggered when `from` date is changed
   */
  onFromChange: (date: Date) => void
  /**
   * optional placeholder text for the `from` date
   */
  fromPlaceholder?: string
  /**
   * value for the `to` date
   */
  toDate?: Date
  /**
   * triggered when `to` date is changed
   */
  onToChange: (date: Date) => void
  /**
   * optional placeholder text for the `to` date
   */
  toPlaceholder?: string
  /**
   * string to be parsed as formatter (eg. MM/dd/yyyy, dd-MM-yy, ect...).
   * When undefined, will autodetect format from user's browser
   */
  format?: string
}

function InputDateRange({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  fromPlaceholder,
  toPlaceholder,
  label,
  format,
  ...rest
}: InputDateRangeProps): JSX.Element {
  useEffect(
    function syncToDateWhenFromIsFuture() {
      if (fromDate == null || toDate == null) {
        return
      }

      if (fromDate > toDate) {
        onToChange(fromDate)
      }
    },
    [fromDate]
  )

  return (
    <div {...rest}>
      {label != null && <Label gap>{label}</Label>}
      <div className='flex items-center'>
        <InputDate
          value={fromDate}
          onChange={onFromChange}
          placeholder={fromPlaceholder}
          format={format}
          wrapperClassName='flex-1'
        />
        <div className='px-2 text-gray-300'>
          <ArrowRight size={24} />
        </div>
        <InputDate
          value={toDate}
          onChange={onToChange}
          placeholder={toPlaceholder}
          minDate={fromDate}
          format={format}
          wrapperClassName='flex-1'
        />
      </div>
    </div>
  )
}

export default InputDateRange
