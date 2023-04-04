import {
  type FieldValues,
  FormProvider,
  type FormProviderProps
} from 'react-hook-form'

interface FormProps<T extends FieldValues> extends FormProviderProps<T> {
  /**
   * Callback invoked on submit when form has been successfully validated
   */
  onSubmit: (data: T) => void
}

const Form = <T extends FieldValues>({
  onSubmit,
  children,
  handleSubmit,
  ...rest
}: FormProps<T>): JSX.Element => {
  const doSubmit = handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <FormProvider handleSubmit={handleSubmit} {...rest}>
      <form
        onSubmit={(e) => {
          void doSubmit(e)
        }}
      >
        {children}
      </form>
    </FormProvider>
  )
}

Form.displayName = 'Form'
export { Form }
