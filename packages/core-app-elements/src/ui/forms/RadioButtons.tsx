import cn from 'classnames'
import Label from '#ui/forms/Label'

export type RadioOptionValue = string | number | boolean

export interface RadioOption {
  value: RadioOptionValue
  label: string
}

export interface RadioButtonsProps {
  id: string
  label?: string
  options: RadioOption[]
  value?: RadioOptionValue
  onChange: (value: RadioOptionValue) => void
  className?: string
}

export function RadioButtons({
  id = 'radio-buttons',
  label,
  options = [],
  value,
  onChange,
  className,
  ...rest
}: RadioButtonsProps): JSX.Element {
  return (
    <div className={className} {...rest}>
      {label != null && <Label gap>{label}</Label>}
      {options.map((opt, idx) => (
        <div key={`${id}_${idx}`} className='mb-3 last:mb-0'>
          <div className='flex items-center'>
            <div className='rounded-full w-[18px] h-[18px] flex items-center '>
              <input
                aria-labelledby={`label_${id}_${idx}`}
                id={`${id}_${idx}`}
                data-test-id={`${id}_${idx}`}
                name={`${id}_${idx}`}
                type='radio'
                value={opt.value.toString()}
                checked={value === opt.value}
                className={cn([
                  'cursor-pointer w-full h-full',
                  'border border-gray-300 text-primary',
                  'checked:border-none',
                  'focus:ring-0 focus:ring-offset-0'
                  // 'focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none'
                ])}
                onChange={(e) => {
                  console.log(e.target.value)
                  onChange(opt.value)
                }}
              />
            </div>
            <label
              id={`label_${id}_${idx}`}
              htmlFor={`${id}_${idx}`}
              className='ml-2 font-semibold cursor-pointer'
            >
              {opt.label}
            </label>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RadioButtons
