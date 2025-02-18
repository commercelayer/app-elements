import { type JSX } from 'react'
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

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CodeEditor
          {...props}
          name={name}
          feedback={feedback}
          defaultValue={field.value}
          onChange={(values) => {
            field.onChange(values)
          }}
        />
      )}
    />
  )
}
