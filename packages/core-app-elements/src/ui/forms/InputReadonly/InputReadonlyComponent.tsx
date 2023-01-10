import cn from 'classnames'
import Label from '#ui/forms/Label'
import CopyToClipboard from '#ui/atoms/CopyToClipboard'

export interface InputReadonlyProps {
  /**
   * optional input label
   */
  label?: string
  /**
   * controlled value
   */
  value?: string
  /**
   * optional css class names used for the outer wrapper/container element
   */
  wrapperClassName?: string
  /**
   * optional css class names used for the input element
   */
  inputClassName?: string
}

function InputReadonlyComponent({
  value,
  wrapperClassName,
  inputClassName,
  label,
  ...rest
}: InputReadonlyProps): JSX.Element {
  return (
    <div {...rest} className={wrapperClassName}>
      {label != null && <Label gap>{label}</Label>}
      <div className='relative'>
        <input
          className={cn(
            'block w-full bg-gray-50 px-4 py-2 h-10 text-teal placeholder:text-gray-400 font-bold',
            'rounded outline-0',
            'transition duration-500 ease-in-out focus:outline-0 focus:border-primary-light',
            inputClassName
          )}
          value={value}
        />
        <div className='absolute top-0 bottom-0 right-4 flex items-center'>
          <CopyToClipboard value={value} showValue={false} hasGutter={false} />
        </div>
      </div>
    </div>
  )
}

export default InputReadonlyComponent
