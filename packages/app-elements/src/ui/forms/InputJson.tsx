import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import isEmpty from 'lodash/isEmpty'
import { useEffect, useState } from 'react'

export interface InputJsonProps<JsonType> extends InputWrapperBaseProps {
  placeholder: object
  validateFn: (json: any) => JsonType
  onDataReady: (validJson: JsonType) => void
  onDataResetRequest: () => void
  errorMessageText?: string
  className?: string
}

function InputJson<JsonType extends object>({
  placeholder,
  validateFn,
  onDataReady,
  onDataResetRequest,
  errorMessageText = 'Invalid JSON',
  className,
  label,
  feedback,
  hint,
  ...rest
}: InputJsonProps<JsonType>): JSX.Element {
  const [value, setValue] = useState('')
  const [internalFeedback, setInternalFeedback] =
    useState<InputWrapperBaseProps['feedback']>(feedback)

  useEffect(
    function parseValueAsJson() {
      setInternalFeedback(undefined)
      if (isEmpty(value)) {
        onDataResetRequest()
        return
      }
      try {
        const json = JSON.parse(value)
        const validData = validateFn(json)
        onDataReady(validData)
      } catch {
        onDataResetRequest()
        setInternalFeedback({
          variant: 'danger',
          message: errorMessageText
        })
      }
    },
    [value]
  )

  return (
    <InputWrapper
      className={className}
      label={label}
      hint={hint}
      feedback={internalFeedback}
      {...rest}
    >
      <textarea
        data-gramm='false'
        placeholder={preparePlaceholder(placeholder)}
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value)
        }}
        onBlur={() => {
          setValue(prettifyJson)
        }}
        className='bg-black text-white font-semibold text-xs font-mono h-72 p-3 w-full rounded-md outline-none'
      />
    </InputWrapper>
  )
}

InputJson.displayName = 'InputJson'
export { InputJson }

function preparePlaceholder(obj: object): string {
  const content = JSON.stringify(obj, null, 2)
  return `Example: \n${content}`
}

function prettifyJson(maybeJsonString: string): string {
  try {
    return JSON.stringify(JSON.parse(maybeJsonString), null, 2)
  } catch {
    return maybeJsonString
  }
}
