import { type atPath } from '#ui/forms/CodeEditor/fetchCoreResourcesSuggestions'
import { isValid, parseJSON } from 'date-fns'
import { type ItemWithValue } from '../utils'

export function guessFieldType(
  value: ItemWithValue['value'] | undefined
): NonNullable<Awaited<ReturnType<typeof atPath>>['field']>['type'] {
  if (typeof value === 'string') {
    if (isValid(parseJSON(value))) {
      return 'datetime'
    } else {
      return 'string'
    }
  }

  if (typeof value === 'number') {
    return 'integer'
  }

  if (typeof value === 'boolean') {
    return 'boolean'
  }

  if (Array.isArray(value)) {
    if (typeof value[0] === 'string') {
      if (isValid(parseJSON(value[0]))) {
        return 'datetime'
      } else {
        return 'string'
      }
    }

    if (typeof value[0] === 'number') {
      return 'integer'
    }
  }

  return 'string' // default fallback
}
