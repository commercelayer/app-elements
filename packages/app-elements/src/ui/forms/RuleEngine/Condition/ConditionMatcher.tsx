import { type atPath } from '#ui/forms/CodeEditor/fetchCoreResourcesSuggestions'
import { InputSelect, isSingleValueSelected } from '#ui/forms/InputSelect'
import React from 'react'
import { useRuleEngine } from '../RuleEngineContext'
import {
  type ConditionMatchersWithoutValue,
  conditionMatchersWithoutValue,
  type ItemWithValue,
  type SchemaConditionItem
} from '../utils'
import { useResourcePathInfos } from './hooks'
import { guessFieldType } from './utils'

export function ConditionMatcher({
  item,
  pathPrefix
}: {
  item: SchemaConditionItem | null
  pathPrefix: string
}): React.ReactNode {
  const { setPath } = useRuleEngine()
  const { infos } = useResourcePathInfos(item)

  let fieldType = infos?.field?.type

  if (fieldType == null) {
    fieldType = guessFieldType((item as ItemWithValue | null)?.value)
  }

  return (
    <InputSelect
      name={`${pathPrefix}.matcher`}
      value={
        item != null
          ? {
              label:
                matcherDictionary.find((dict) => {
                  const found =
                    dict.matcher === item.matcher &&
                    ((fieldType != null &&
                      dict.fieldTypes.includes(fieldType)) ||
                      fieldType == null)

                  return found
                })?.label ??
                // eslint-disable-next-line no-irregular-whitespace
                (item.matcher != null ? `⚠️   ${item.matcher}` : ''),
              value: item.matcher
            }
          : undefined
      }
      initialValues={matcherDictionary
        .filter(({ fieldTypes, visible }) => {
          return visible !== false && fieldTypes.includes(fieldType)
        })
        .map(({ matcher, label }) => ({ value: matcher, label }))}
      onSelect={(selected) => {
        if (isSingleValueSelected(selected)) {
          setPath(`${pathPrefix}.matcher`, selected.value)

          if (
            conditionMatchersWithoutValue.includes(
              selected.value as ConditionMatchersWithoutValue
            )
          ) {
            setPath(`${pathPrefix}.value`, null)
          }
        }
      }}
    />
  )
}

type MatcherDictionary = Array<{
  matcher: SchemaConditionItem['matcher']
  visible?: boolean
  label: string
  fieldTypes: Array<
    NonNullable<Awaited<ReturnType<typeof atPath>>['field']>['type']
  >
}>

const matcherDictionary: MatcherDictionary = [
  {
    /** Matches if field value equals provided value
     * @field Integer, String, Datetime, Boolean
     * @value Integer, String, Datetime, Boolean
     */
    matcher: 'eq',
    label: 'equals',
    fieldTypes: ['integer', 'string', 'datetime', 'boolean']
  },
  {
    /** Matches if field value is not equal to provided value
     * @field Integer, String, Datetime, Boolean
     * @value Integer, String, Datetime, Boolean
     */
    matcher: 'not_eq',
    label: 'not equals',
    fieldTypes: ['integer', 'string', 'datetime', 'boolean']
  },
  {
    /** Matches if field value is less than provided value
     * @field Integer, Datetime
     * @value Integer, Datetime
     */
    matcher: 'lt',
    label: '<',
    fieldTypes: ['integer', 'datetime']
  },
  {
    /** Matches if field value is less than or equal to provided value
     * @field Integer, Datetime
     * @value Integer, Datetime
     */
    matcher: 'lteq',
    label: '≤',
    fieldTypes: ['integer', 'datetime']
  },
  {
    /** Matches if field value is greater than provided value
     * @field Integer, Datetime
     * @value Integer, Datetime
     */
    matcher: 'gt',
    label: '>',
    fieldTypes: ['integer', 'datetime']
  },
  {
    /** Matches if field value is greater than or equal to provided value
     * @field Integer, Datetime
     * @value Integer, Datetime
     */
    matcher: 'gteq',
    label: '≥',
    fieldTypes: ['integer', 'datetime']
  },
  {
    /** Matches if field value is a multiple of provided value
     * @field Integer
     * @value Integer
     */
    matcher: 'multiple',
    label: 'is a multiple of',
    fieldTypes: ['integer']
  },
  {
    /** Matches if field value matches regex pattern
     * @field String
     * @value String
     */
    matcher: 'matches',
    label: 'matches regex',
    fieldTypes: ['string']
  },
  {
    /** Matches if field value does not match regex pattern
     * @field String
     * @value String
     */
    matcher: 'does_not_match',
    label: "doesn't match regex",
    fieldTypes: ['string']
  },
  {
    /** Matches if field value starts with provided string
     * @field String
     * @value String
     */
    matcher: 'start_with',
    label: 'starts with',
    fieldTypes: ['string']
  },
  {
    /** Matches if field value does not start with provided string
     * @field String
     * @value String
     */
    matcher: 'not_start_with',
    label: "doesn't start with",
    fieldTypes: ['string']
  },
  {
    /** Matches if field value ends with provided string
     * @field String
     * @value String
     */
    matcher: 'end_with',
    label: 'ends with',
    fieldTypes: ['string']
  },
  {
    /** Matches if field value does not end with provided string
     * @field String
     * @value String
     */
    matcher: 'not_end_with',
    label: "doesn't end with",
    fieldTypes: ['string']
  },
  {
    /** Matches if field value is between two values (exclusive)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: 'gt_lt',
    label: '> and <',
    fieldTypes: ['integer']
  },
  {
    /** Matches if field value is between two values (inclusive start, exclusive end)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: 'gteq_lt',
    label: '≥ and <',
    fieldTypes: ['integer']
  },
  {
    /** Matches if field value is greater than first and less than or equal to second
     * @field Integer, Datetime
     * @value Array
     */
    matcher: 'gt_lteq',
    label: '> and ≤',
    fieldTypes: ['integer']
  },
  {
    /** Matches if field value is between two values (inclusive)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: 'gteq_lteq',
    label: '≥ and ≤',
    fieldTypes: ['integer']
  },
  {
    /** Matches if field value is between two values (exclusive)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: 'gt_lt',
    label: 'date range',
    visible: false,
    fieldTypes: ['datetime']
  },
  {
    /** Matches if field value is between two values (inclusive start, exclusive end)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: 'gteq_lt',
    label: 'date range',
    visible: false,
    fieldTypes: ['datetime']
  },
  {
    /** Matches if field value is greater than first and less than or equal to second
     * @field Integer, Datetime
     * @value Array
     */
    matcher: 'gt_lteq',
    label: 'date range',
    visible: false,
    fieldTypes: ['datetime']
  },
  {
    /** Matches if field value is between two values (inclusive)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: 'gteq_lteq',
    label: 'date range',
    visible: true,
    fieldTypes: ['datetime']
  },
  {
    /** Matches if field value is in provided array
     * @field Integer, String, Datetime
     * @value Array
     */
    matcher: 'is_in',
    label: 'is one of',
    fieldTypes: ['integer', 'string', 'datetime']
  },
  {
    /** Matches if field value is not in provided array
     * @field Integer, String, Datetime
     * @value Array
     */
    matcher: 'is_not_in',
    label: 'is not one of',
    fieldTypes: ['integer', 'string', 'datetime']
  },
  {
    /** Matches objects within arrays that meet specified requirements
     * @field Array
     * @value Object
     */
    matcher: 'array_match',
    label: 'is',
    fieldTypes: ['integer', 'string', 'datetime']
  },
  {
    /** Matches if field value is null or empty string */
    matcher: 'blank',
    label: 'is blank',
    fieldTypes: ['integer', 'string', 'datetime', 'boolean']
  },
  {
    /** Matches if field value is null */
    matcher: 'null',
    label: 'is null',
    fieldTypes: ['integer', 'string', 'datetime', 'boolean']
  },
  {
    /** Matches if field value is not null */
    matcher: 'not_null',
    label: 'is not null',
    fieldTypes: ['integer', 'string', 'datetime', 'boolean']
  },
  {
    /** Matches if field value is not null */
    matcher: 'present',
    label: 'is present',
    fieldTypes: ['integer', 'string', 'datetime', 'boolean']
  }
]
