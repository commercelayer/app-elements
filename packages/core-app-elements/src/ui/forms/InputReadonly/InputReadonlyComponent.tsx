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
      <div className='relative select-none'>
        <input
          className={cn(
            'block w-full bg-gray-50 p-3 h-10 text-teal font-bold',
            'rounded outline-0',
            inputClassName
          )}
          value={value}
          readOnly
        />
        <div className='absolute top-0 bottom-0 right-4 flex items-center'>
          <CopyToClipboard value={value} showValue={false} hasGutter={false} />
        </div>
      </div>
    </div>
  )
}

export default InputReadonlyComponent
