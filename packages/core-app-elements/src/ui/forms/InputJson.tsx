import isEmpty from 'lodash/isEmpty'
import { useState, useEffect } from 'react'

export interface InputJsonProps<JsonType> {
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
  ...rest
}: InputJsonProps<JsonType>): JSX.Element {
  const [value, setValue] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>()

  useEffect(
    function parseValueAsJson() {
      setErrorMessage(null)
      if (isEmpty(value)) {
        onDataResetRequest()
        return
      }
      try {
        const json = JSON.parse(value)
        const validData = validateFn(json)
        onDataReady(validData)
      } catch (e) {
        onDataResetRequest()
        setErrorMessage(errorMessageText)
      }
    },
    [value]
  )

  return (
    <div className={className} {...rest}>
      <textarea
        data-gramm='false'
        placeholder={preparePlaceholder(placeholder)}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onBlur={() => {
          setValue(prettifyJson)
        }}
        className='bg-black text-white font-semibold text-xs font-mono h-72 p-3 w-full rounded-md outline-none'
      />
      {errorMessage !== null ? (
        <div className='text-sm text-red px-2' data-test-id='input-json-error'>
          {errorMessage}
        </div>
      ) : null}
    </div>
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
