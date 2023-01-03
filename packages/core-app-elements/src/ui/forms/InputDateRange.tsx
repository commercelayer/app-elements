import { ArrowRight } from 'phosphor-react'
import InputDate from './InputDate'
import Label from './Label'
import { useEffect } from 'react'
import { InputDateProps } from './InputDate/InputDateComponent'

export interface InputDateRangeProps
  extends Pick<
    InputDateProps,
    'label' | 'isClearable' | 'format' | 'autoPlaceholder'
  > {
  /**
   * value for the `from` date
   */
  fromDate?: Date | null
  /**
   * triggered when `from` date is changed
   */
  onFromChange: (date: Date | null) => void
  /**
   * optional placeholder text for the `from` date
   */
  fromPlaceholder?: string
  /**
   * value for the `to` date
   */
  toDate?: Date | null
  /**
   * triggered when `to` date is changed
   */
  onToChange: (date: Date | null) => void
  /**
   * optional placeholder text for the `to` date
   */
  toPlaceholder?: string
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
  autoPlaceholder,
  isClearable,
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
          isClearable={isClearable}
          autoPlaceholder={autoPlaceholder}
        />
        <div className='px-2 text-gray-300'>
          <ArrowRight size={24} />
        </div>
        <InputDate
          value={toDate}
          onChange={onToChange}
          placeholder={toPlaceholder}
          minDate={fromDate ?? undefined}
          format={format}
          wrapperClassName='flex-1'
          isClearable={isClearable}
          autoPlaceholder={autoPlaceholder}
        />
      </div>
    </div>
  )
}

export default InputDateRange
