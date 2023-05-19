import {
  API_ERROR_FIELD_NAME,
  setApiFormErrors
} from '#helpers/setApiFormErrors'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { ValidationError } from './ValidationError'

interface ValidationApiErrorProps {
  /**
   * An error object returned from a failed API request.
   * We expect an object that contain an `errors` property with the Core Api error items shape.
   */
  apiError: any
  /**
   * Optional map of app field names to API error field names.
   * This is useful when the API returns field names that are different from the app field names.
   * For example, if the API returns `first_name` instead of `firstName`, you can pass `{ first_name: 'firstName' }`.
   *
   * Format is:
   * ```{ apiFieldName: appFieldName }```
   */
  fieldMap?: Record<string, string>
}

function ValidationApiError({
  apiError,
  fieldMap
}: ValidationApiErrorProps): JSX.Element {
  const { setError, getValues } = useFormContext()

  useEffect(() => {
    if (apiError != null) {
      setApiFormErrors({
        apiError,
        setError,
        formFields: Object.keys(getValues()),
        fieldMap
      })
    }
  }, [apiError, apiError?.errors])

  return <ValidationError name={API_ERROR_FIELD_NAME} />
}

ValidationApiError.displayName = 'ValidationApiError'
export { ValidationApiError }
