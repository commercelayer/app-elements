import cn from 'classnames'
import Label from '#ui/forms/Label'
import CopyToClipboard from '#ui/atoms/CopyToClipboard'

interface InputReadonlyProps {
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
  /**
   * optional prop to define whether to show or not the Copy to clipboard button
   */
  showCopyAction?: boolean
}

export function InputReadonly({
  label,
  value,
  wrapperClassName,
  inputClassName,
  showCopyAction = false,
  ...rest
}: InputReadonlyProps): JSX.Element {
  return (
    <div {...rest} className={wrapperClassName}>
      {label != null && <Label gap>{label}</Label>}
      <div className='relative select-none'>
        <input
          className={cn(
            'block w-full bg-gray-50 px-4 h-10 text-teal font-bold',
            'rounded outline-0',
            inputClassName
          )}
          value={value}
          readOnly
        />
        {showCopyAction && (
          <div className='absolute top-0 bottom-0 right-4 flex items-center'>
            <CopyToClipboard value={value} showValue={false} />
          </div>
        )}
      </div>
    </div>
  )
}

export default InputReadonly
