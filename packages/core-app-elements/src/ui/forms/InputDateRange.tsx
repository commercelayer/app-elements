import { ArrowRight } from 'phosphor-react'
import InputDate from './InputDate'
import Label from './Label'
import { forwardRef, useEffect } from 'react'
import { InputDateProps, MaybeDate } from './InputDate/InputDateComponent'

export interface InputDateRangeProps
  extends Pick<
    InputDateProps,
    'label' | 'isClearable' | 'format' | 'autoPlaceholder'
  > {
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

function InputDateRange(
  {
    value = [null, null],
    fromPlaceholder,
    toPlaceholder,
    label,
    format,
    autoPlaceholder,
    isClearable,
    onChange,
    ...rest
  }: InputDateRangeProps,
  ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
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
    <div {...rest} ref={ref}>
      {label != null && <Label gap>{label}</Label>}
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
        />
      </div>
    </div>
  )
}

export default forwardRef<HTMLDivElement, InputDateRangeProps>(InputDateRange)
