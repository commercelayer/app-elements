import isObject from "lodash-es/isObject"
import merge from "lodash-es/merge"
import reduce from "lodash-es/reduce"
import { type JSX, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { HookedValidationError } from "./HookedValidationError"
import { setApiFormErrors } from "./setApiFormErrors"

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

export function HookedValidationApiError({
  apiError,
  fieldMap,
}: ValidationApiErrorProps): JSX.Element {
  const { setError, getValues } = useFormContext()

  const flattenKeys = (obj: any, path: string[] = []): Record<string, any> =>
    !isObject(obj)
      ? { [path.join(".")]: obj }
      : reduce(
          obj,
          (cum, next, key) => merge(cum, flattenKeys(next, [...path, key])),
          {},
        )

  useEffect(() => {
    if (apiError != null) {
      setApiFormErrors({
        apiError,
        setError,
        formFields: [
          ...Object.keys(getValues()),
          ...Object.keys(flattenKeys(getValues())),
        ],
        fieldMap,
      })
    }
  }, [apiError, apiError?.errors])

  // field name `root.apiError` should match what is defined in `setApiFormErrors`
  return <HookedValidationError name="root.apiError" />
}

HookedValidationApiError.displayName = "HookedValidationApiError"
