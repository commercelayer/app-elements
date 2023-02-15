import cn from 'classnames'
import { forwardRef } from 'react'
import { Hint, HintProps } from '#ui/atoms/Hint'

interface InputTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * optional hint to be rendered below
   */
  hint?: {
    icon?: HintProps['icon']
    text: HintProps['children']
  }
}

const InputTextArea = forwardRef<HTMLTextAreaElement, InputTextAreaProps>(
  ({ className, hint, ...rest }, ref): JSX.Element => {
    return (
      <>
        <textarea
          {...rest}
          className={cn(
            'h-52 p-3 w-full border border-gray-200 bg-white rounded-md',
            className
          )}
          ref={ref}
        />
        {hint != null && (
          <Hint className='mt-1' icon={hint.icon}>
            {hint.text}
          </Hint>
        )}
      </>
    )
  }
)

InputTextArea.displayName = 'InputTextArea'
export { InputTextArea }
