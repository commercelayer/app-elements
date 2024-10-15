import type { OnValidate } from '@monaco-editor/react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from '../ReactHookForm'
import { CodeEditor } from './CodeEditor'
import { type CodeEditorProps } from './CodeEditorComponent'

export interface HookedCodeEditorProps
  extends Omit<CodeEditorProps, 'name'>,
    Required<Pick<CodeEditorProps, 'name'>> {}

/**
 * `Input` component ready to be used with the `react-hook-form` context.
 * @see InputSelect
 */
export function HookedCodeEditor({
  name,
  ...props
}: HookedCodeEditorProps): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)
  const [isValid, setIsValid] = useState<Parameters<OnValidate>[0] | null>(null)

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: () => {
          return isValid == null || isValid.length === 0
            ? true
            : isValid[0]?.message.includes('Valid values: ') === true
              ? 'Value is not accepted.'
              : isValid[0]?.message
        }
      }}
      render={({ field }) => (
        <CodeEditor
          {...props}
          name={name}
          feedback={feedback}
          defaultValue={field.value}
          onValidate={(markers) => {
            setIsValid(markers)
          }}
          onChange={(values) => {
            field.onChange(values)
          }}
        />
      )}
    />
  )
}
