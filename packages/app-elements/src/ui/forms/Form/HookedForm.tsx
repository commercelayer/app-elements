import { type JSX } from 'react'
import {
  FormProvider,
  type FieldValues,
  type FormProviderProps
} from 'react-hook-form'

interface FormProps<T extends FieldValues> extends FormProviderProps<T> {
  /**
   * Callback invoked on submit when form has been successfully validated
   */
  onSubmit: (data: T) => Promise<void> | void
}

/**
 * Form component to be used as main provider for the `react-hook-form` context.
 *
 * Example:
 *
 * ```tsx
 * import { useForm } from "react-hook-form"
 * import { zodResolver } from "@hookform/resolvers/zod"
 * import { HookedForm, HookedInput, HookedInputDate} from "@commercelayer/app-elements"
 * function MyForm() {
 *   const methods = useForm({
 *     resolver: zodResolver(schema),
 *   });
 *   return (
 *     <HookedForm {...methods} onSubmit={(values) => myPostToServer(values)}>
 *       <HookedInput name="companyName" label="Company name" />
 *       <HookedInputDate name="dateSingle" label="Date" />
 *       <Button type='submit'>Submit</Button>
 *     </HookedForm>
 *    );
 * }
 *```
 */
export const HookedForm = <T extends FieldValues>({
  onSubmit,
  children,
  handleSubmit,
  ...rest
}: FormProps<T>): JSX.Element => {
  const doSubmit = handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <FormProvider handleSubmit={handleSubmit} {...rest}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void doSubmit(e)
        }}
      >
        {children}
      </form>
    </FormProvider>
  )
}

HookedForm.displayName = 'HookedForm'
