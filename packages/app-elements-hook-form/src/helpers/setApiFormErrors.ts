import { type UseFormSetError } from 'react-hook-form'

interface ApiError {
  /**
   * Error message without attribute key
   * Example: "must be less than or equal to 10"
   */
  title: string
  /**
   * Computed error message that also includes attribute key
   * Example: "quantity - must be less than or equal to 10"
   */
  detail: string
  /**
   * error code
   * Example: "VALIDATION_ERROR"
   */
  code?: string
  /**
   * HTTP status code
   * Example: "422"
   */
  status?: string
  /**
   * Points where the error occurred
   * Only when  code: 'VALIDATION_ERROR'
   * Example: {"pointer": "/data/attributes/quantity"}
   */
  source?: {
    pointer: string
  }
  meta?: unknown
}

interface ApiErrorResponse {
  errors: ApiError[]
}

const genericError: ApiErrorResponse = {
  errors: [
    {
      title: 'Generic error',
      detail: 'Could not process your request'
    }
  ]
}

function isApiError(error: any): error is ApiErrorResponse {
  try {
    const hasErrorsArray =
      'errors' in error &&
      Array.isArray(error.errors) &&
      error.errors.length > 0
    const errorsHaveApiErrorShape = (error as ApiErrorResponse).errors.every(
      (err) => 'title' in err && 'detail' in err && 'code' in err
    )
    return hasErrorsArray && errorsHaveApiErrorShape
  } catch {
    return false
  }
}

/**
 * Guesses the field name from the error source pointer (if available).
 * Example: "/data/attributes/quantity" -> "quantity"
 * Otherwise, guesses the field name from the error detail.
 * Example: "quantity - must be less than or equal to 10" -> "quantity"
 */
function guessField(item: ApiError): string | undefined {
  if (item.source?.pointer != null && item.source?.pointer !== '') {
    const field = item.source?.pointer.split('/').at(-1)
    return field
  }

  if (item.detail != null && item.detail !== '') {
    const field = item.detail.split(' - ').at(0)
    return field
  }
}

export const API_ERROR_FIELD_NAME = 'root.apiError'

export function setApiFormErrors({
  apiError,
  setError,
  fieldMap,
  formFields
}: {
  /**
   * Error response from API
   */
  apiError: any
  /**
   * setError function from react-hook-form, it comes from same useForm() context
   */
  setError: UseFormSetError<any>
  /**
   * list of from fields
   */
  formFields: string[]
  /**
   * Map of field names from API to field names in the form
   */
  fieldMap?: Record<string, string>
}): void {
  const { errors } = isApiError(apiError) ? apiError : genericError

  const errorByTypes = errors.reduce(
    (allErrors, item) => {
      const guessedField = guessField(item)
      const field =
        guessedField != null
          ? fieldMap?.[guessedField] ?? guessedField
          : undefined

      // Once we have a field name we check if it's part of the form fields, otherwise we cannot
      // set the error on it because it won't be visible to the user.
      // This because API can still return `VALIDATION_ERROR` for a field that is no part of the form.
      // If we don't perform this check here, the form will not be submitted and the user will not see any errors.
      // Example: `VALIDATION_ERROR` is returned for field `quantity` but we don't have a field with that name in the form.
      const isFieldInForm = Boolean(field != null && formFields.includes(field))

      if (item.code === 'VALIDATION_ERROR' && field != null && isFieldInForm) {
        return {
          ...allErrors,
          validation: [
            ...allErrors.validation,
            {
              field,
              message: item.title
            }
          ]
        }
      }

      return {
        ...allErrors,
        others: [...allErrors.others, item.detail]
      }
    },
    {
      validation: [] as Array<{ field: string; message: string }>,
      others: [] as string[]
    }
  )

  errorByTypes.validation.forEach((error, idx) => {
    setError(
      error.field,
      {
        type: 'serverValidation',
        message: error.message
      },
      {
        shouldFocus: idx === 0
      }
    )
  })

  if (errorByTypes.others.length > 0) {
    setError(API_ERROR_FIELD_NAME, {
      type: 'server',
      message: errorByTypes.others.join('. ')
    })
  }
}
