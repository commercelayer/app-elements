import cn from 'classnames'

export interface InputToggleListBoxOption {
  value: string
  label: string
}

interface Props
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'value' | 'onChange' | 'onSelect'
  > {
  id: string
  label: string
  description?: React.ReactNode
  value: string
  options: InputToggleListBoxOption[]
  className?: string
  onSelect: (value: string) => void
}

export function InputToggleListBox({
  id,
  className,
  label,
  value,
  options = [],
  onSelect,
  description,
  ...rest
}: Props): JSX.Element {
  return (
    <div
      className={cn('px-4 first:border-t border-b b-gray-100 py-4', className)}
    >
      <div className='flex justify-between items-start gap-5'>
        <div>
          <label htmlFor={id} className='font-semibold'>
            {label}
          </label>
          {description != null ? (
            <p className='text-sm font-medium text-gray-500'>{description}</p>
          ) : null}
        </div>
        <div className='relative'>
          <select
            id={id}
            value={value}
            onChange={(e) => {
              onSelect(e.currentTarget.value)
            }}
            className='appearance-none cursor-pointer border-0 py-0 pr-9 font-medium text-gray-500 focus:outline-none focus:ring-0 focus:shadow-none'
            {...rest}
          >
            {options.map((opt) => (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default InputToggleListBox
