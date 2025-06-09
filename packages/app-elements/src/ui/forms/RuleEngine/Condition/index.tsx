import { atPath } from '#ui/forms/CodeEditor/fetchCoreResourcesSuggestions'
import { Input } from '#ui/forms/Input'
import { InputDate } from '#ui/forms/InputDate'
import { InputDateRange } from '#ui/forms/InputDateRange'
import {
  InputSelect,
  isMultiValueSelected,
  isSingleValueSelected
} from '#ui/forms/InputSelect'
import classNames from 'classnames'
import { isValid, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import { useRuleEngine } from '../RuleEngineContext'
import {
  type ConditionMatchersWithoutValue,
  conditionMatchersWithoutValue,
  expectNever,
  type SchemaCondition,
  type SchemaConditionItem
} from '../utils'

export function Condition({
  item,
  children,
  isNested = false,
  pathPrefix
}: {
  item?: SchemaCondition
  isNested?: boolean
  children?: React.JSX.Element
  pathPrefix: string
}): React.JSX.Element {
  const {
    state: { selectedRuleIndex }
  } = useRuleEngine()
  const conditionsLogin = item?.conditions_logic?.toLowerCase() ?? 'and'
  const { setPath } = useRuleEngine()

  return (
    <div
      className={classNames('query-group', {
        'p-4 border border-gray-200 rounded-md': isNested
      })}
    >
      {children}
      {item != null && (
        <>
          <select
            onChange={(event) => {
              setPath(
                `${pathPrefix}.conditions_logic`,
                event.currentTarget.value
              )
            }}
            defaultValue={conditionsLogin}
            className='pl-4 pr-8 py-2 font-bold focus:ring-0 focus:outline-none appearance-none bg-gray-50 border border-gray-200 rounded-md text-sm leading-4'
          >
            <option value='and'>{isNested ? 'Nested in ' : ''}AND</option>
            <option value='or'>{isNested ? 'Nested in ' : ''}OR</option>
          </select>
          <div className='border-l border-gray-200 ml-3 pt-3'>
            {item?.conditions?.map((condition, conditionIndex, arr) => {
              const isLast = conditionIndex === arr.length - 1
              return (
                <div
                  key={`${selectedRuleIndex}-${conditionIndex}`}
                  className='flex items-center mb-4 last:mb-0 relative'
                >
                  <Connector rounded={isLast} />
                  <div className='ml-4 w-full'>
                    <Condition
                      item={condition.nested ?? undefined}
                      isNested={condition.nested != null}
                      pathPrefix={`${pathPrefix}.conditions.${conditionIndex}.nested`}
                    >
                      <div
                        className={classNames({
                          'mb-4': condition.nested != null
                        })}
                      >
                        <ConditionItem
                          item={condition}
                          pathPrefix={`${pathPrefix}.conditions.${conditionIndex}`}
                        />
                      </div>
                    </Condition>
                  </div>
                </div>
              )
            })}

            {(item.conditions ?? []).length === 0 && (
              <div className='flex items-center mb-4 last:mb-0 relative'>
                <Connector rounded />
                <div className='ml-4 w-full'>
                  <Condition
                    item={undefined}
                    isNested={false}
                    pathPrefix={`${pathPrefix}.conditions.${0}.nested`}
                  >
                    <div>
                      <ConditionItem
                        item={null}
                        pathPrefix={`${pathPrefix}.conditions.${0}`}
                      />
                    </div>
                  </Condition>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function ConditionItem({
  item,
  pathPrefix
}: {
  item: SchemaConditionItem | null
  pathPrefix: string
}): React.JSX.Element {
  const { setPath } = useRuleEngine()

  return (
    <div className='bg-gray-50 rounded-md p-2'>
      <div className='flex items-center justify-between gap-2'>
        {/* Condition target */}
        <div className='flex-1'>
          {/* <InputSelect
            defaultValue={{
              label: 'Customer',
              value: 'Customer'
            }}
            initialValues={[
              { value: 'Customer', label: 'Customer' }
            ]}
            onSelect={() => { }}
          /> */}
          <Input
            type='text'
            defaultValue={item != null ? item.field : undefined}
            onChange={(event) => {
              setPath(`${pathPrefix}.field`, event.currentTarget.value)
            }}
            onBlur={(event) => {
              setPath(`${pathPrefix}.field`, event.currentTarget.value)
            }}
          />
        </div>

        {/* Condition matcher */}
        <div className='flex-14'>
          <ConditionMatcher item={item} pathPrefix={pathPrefix} />
        </div>
      </div>
      <div className='pt-2'>
        {/* Condition value */}
        <div className='flex-1'>
          <ConditionValue item={item} pathPrefix={pathPrefix} />
        </div>
      </div>
    </div>
  )
}

function Connector({
  rounded = false
}: {
  rounded?: boolean
}): React.JSX.Element {
  if (!rounded) {
    return (
      <div className='absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-px bg-gray-200' />
    )
  }

  return (
    <>
      <div className='absolute -left-[1px] top-1/2 w-px h-1/2 bg-white' />
      <div className='absolute -left-[1px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-l border-b rounded-es-sm bg-white border-gray-200' />
    </>
  )
}

type ItemWithValue = Exclude<
  SchemaConditionItem,
  { matcher: ConditionMatchersWithoutValue }
>

function ConditionMatcher({
  item,
  pathPrefix
}: {
  item: SchemaConditionItem | null
  pathPrefix: string
}): React.ReactNode {
  const { setPath } = useRuleEngine()
  const { infos } = useResourcePathInfos(item)

  if (item == null || infos == null) {
    return null
  }

  return (
    <InputSelect
      defaultValue={
        item != null && infos != null
          ? {
              label:
                matcherDictionary.find((dict) => {
                  return (
                    dict.matcher === item.matcher &&
                    ((infos?.field?.type != null &&
                      dict.fieldTypes.includes(infos.field.type)) ||
                      infos.field?.type == null)
                  )
                })?.label ?? item.matcher,
              value: item.matcher
            }
          : undefined
      }
      initialValues={matcherDictionary
        .filter(({ fieldTypes, visible }) => {
          return (
            infos?.field?.type != null &&
            fieldTypes.includes(infos.field.type) &&
            visible !== false
          )
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

function useResourcePathInfos(item: SchemaConditionItem | null): {
  infos: Awaited<ReturnType<typeof atPath>> | undefined
} {
  const [infos, setInfos] = useState<
    Awaited<ReturnType<typeof atPath>> | undefined
  >(undefined)

  useEffect(() => {
    if (item?.field != null) {
      atPath(item.field)
        .then((result) => {
          setInfos(result)
        })
        .catch((error) => {
          console.error('Error fetching field info:', error)
        })
    }
  }, [item?.field])

  return { infos }
}

/**
 * This function renders the value input for a condition item based on its matcher and its field.
 *
 * > // TODO: **NOTE** the kind of Component depends on the matcher used and the field used. For example, if the matcher is `eq` and the field is `email`, then it should be an email input. Or if the matcher is `gt` and the field is `created_at`, then it should be a date input.
 * > https://docs.commercelayer.io/rules-engine/matchers#value-required
 */
function ConditionValue({
  item,
  pathPrefix
}: {
  item: SchemaConditionItem | null
  pathPrefix: string
}): React.ReactNode {
  const { setPath } = useRuleEngine()
  const { infos } = useResourcePathInfos(item)
  const pathKey = `${pathPrefix}.value`

  if (item == null) {
    return null
  }

  if (
    conditionMatchersWithoutValue.includes(
      item.matcher as ConditionMatchersWithoutValue
    )
  ) {
    return null
  }

  const itemWithValue = item as ItemWithValue

  let componentType:
    | 'arrayMatch'
    | 'boolean'
    | 'date'
    | 'dateRange'
    | 'number'
    | 'numberRange'
    | 'tag'
    | 'text'
    | null = null

  switch (infos?.field?.type) {
    case 'datetime': {
      componentType = 'date'
      break
    }

    case 'boolean': {
      componentType = 'boolean'
      break
    }

    case 'string': {
      componentType = 'text'
      break
    }

    case 'integer':
    case 'float': {
      componentType = 'number'
      break
    }

    case 'array':
    case 'json':
    case 'object': {
      break
    }

    default: {
      componentType = 'text'
      break
    }
  }

  switch (itemWithValue.matcher) {
    case 'eq':
    case 'not_eq':
    case 'lt':
    case 'lteq':
    case 'gt':
    case 'gteq':
    case 'multiple':
    case 'start_with':
    case 'not_start_with':
    case 'end_with':
    case 'not_end_with': {
      // pass through to the default case
      break
    }

    case 'matches':
    case 'does_not_match': {
      // need to handle regex input
      break
    }

    case 'gt_lt':
    case 'gteq_lt':
    case 'gt_lteq':
    case 'gteq_lteq': {
      // these matchers expect an array of two values (only for date and number)
      if (componentType === 'number') {
        componentType = 'numberRange'
      }

      if (componentType === 'date') {
        componentType = 'dateRange'
      }

      break
    }

    case 'is_in':
    case 'is_not_in': {
      // these matchers expect an array of values
      componentType = 'tag'
      break
    }

    case 'array_match': {
      // this matcher expects an object with conditions
      componentType = 'arrayMatch'
      break
    }

    default: {
      expectNever(itemWithValue.matcher)
      break
    }
  }

  switch (componentType) {
    case 'date': {
      const date = parseISO(
        typeof itemWithValue.value === 'string' ? itemWithValue.value : ''
      )

      return (
        <InputDate
          value={isValid(date) ? date : undefined}
          showTimeSelect
          placeholder='Enter value'
          onChange={(date) => {
            setPath(pathKey, date?.toJSON())
          }}
        />
      )
    }

    case 'dateRange': {
      const value = Array.isArray(itemWithValue.value)
        ? (itemWithValue.value.map((v) => {
            const date = parseISO(typeof v === 'string' ? v : '')

            return isValid(date) ? date : null
          }) as [Date, Date])
        : ([null, null] as [null, null])

      return (
        <InputDateRange
          value={value}
          showTimeSelect
          onChange={(dates) => {
            setPath(
              `${pathPrefix}.value`,
              dates.map((date) => date?.toJSON() ?? null)
            )
          }}
        />
      )
    }

    case 'numberRange': {
      return (
        <NumberRange
          value={itemWithValue.value}
          onChange={(value) => {
            setPath(pathKey, value)
          }}
        />
      )
    }

    case 'arrayMatch': {
      return (
        <ArrayMatch
          value={itemWithValue.value}
          pathPrefix={`${pathPrefix}.value`}
          // onChange={(value) => {
          //   setPath(pathKey, value)
          // }}
        />
      )
    }

    case 'tag': {
      return (
        <InputSelect
          isMulti
          isClearable={false}
          isCreatable
          defaultValue={
            Array.isArray(itemWithValue.value)
              ? itemWithValue.value.map((v) => ({
                  label: v.toString(),
                  value: v
                }))
              : []
          }
          initialValues={[]}
          onSelect={(selected) => {
            if (isMultiValueSelected(selected)) {
              setPath(
                `${pathPrefix}.value`,
                selected
                  .map((s) => {
                    if (infos?.field?.type === 'integer') {
                      const intValue = parseInt(s.value.toString(), 10)
                      if (isNaN(intValue)) {
                        return null
                      }
                      return intValue
                    }

                    return s.value
                  })
                  .filter((s) => s != null)
              )
            }
          }}
        />
      )
    }

    case 'number': {
      return (
        <Input
          type='number'
          defaultValue={
            typeof itemWithValue.value === 'number' ? itemWithValue.value : ''
          }
          placeholder='Enter value'
          onChange={(event) => {
            setPath(
              `${pathPrefix}.value`,
              parseInt(event.currentTarget.value, 10)
            )
          }}
        />
      )
    }

    case 'boolean': {
      return (
        <InputSelect
          defaultValue={
            typeof itemWithValue.value === 'boolean'
              ? {
                  label: itemWithValue.value ? 'Yes' : 'No',
                  value: itemWithValue.value
                }
              : undefined
          }
          initialValues={[
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]}
          onSelect={(selected) => {
            if (isSingleValueSelected(selected)) {
              setPath(pathKey, selected.value)
            }
          }}
        />
      )
    }

    case 'text':
    case null: {
      return (
        <Input
          type='text'
          defaultValue={
            typeof itemWithValue.value === 'string'
              ? itemWithValue.value
              : JSON.stringify(itemWithValue.value)
          }
          placeholder='Enter value'
          onChange={(event) => {
            setPath(pathKey, event.currentTarget.value)
          }}
        />
      )
    }

    default: {
      return expectNever(componentType)
    }
  }
}

function NumberRange({
  value,
  onChange
}: {
  value: ItemWithValue['value']
  onChange: (value: [number | null, number | null]) => void
}): React.JSX.Element {
  const [min, setMin] = useState<number | null>(
    Array.isArray(value) && typeof value[0] === 'number' ? value[0] : null
  )
  const [max, setMax] = useState<number | null>(
    Array.isArray(value) && typeof value[1] === 'number' ? value[1] : null
  )

  return (
    <div className='flex items-center gap-4'>
      <div className='flex-grow'>
        <Input
          type='number'
          placeholder='Min'
          value={min ?? ''}
          onChange={(event) => {
            const newValue = parseInt(event.currentTarget.value, 10)
            setMin(isNaN(newValue) ? null : newValue)
            onChange([isNaN(newValue) ? null : newValue, max])
          }}
        />
      </div>
      <span className='text-gray-300'>to</span>
      <div className='flex-grow'>
        <Input
          type='number'
          placeholder='Max'
          value={max ?? ''}
          onChange={(event) => {
            const newValue = parseInt(event.currentTarget.value, 10)
            setMax(isNaN(newValue) ? null : newValue)
            onChange([min, isNaN(newValue) ? null : newValue])
          }}
        />
      </div>
    </div>
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
    label: 'less than',
    fieldTypes: ['integer', 'datetime']
  },
  {
    /** Matches if field value is less than or equal to provided value
     * @field Integer, Datetime
     * @value Integer, Datetime
     */
    matcher: 'lteq',
    label: 'less than or equal to',
    fieldTypes: ['integer', 'datetime']
  },
  {
    /** Matches if field value is greater than provided value
     * @field Integer, Datetime
     * @value Integer, Datetime
     */
    matcher: 'gt',
    label: 'greater than',
    fieldTypes: ['integer', 'datetime']
  },
  {
    /** Matches if field value is greater than or equal to provided value
     * @field Integer, Datetime
     * @value Integer, Datetime
     */
    matcher: 'gteq',
    label: 'greater than or equal to',
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
    label: 'does not match regex',
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
    label: 'does not start with',
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
    label: 'does not end with',
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
    label: 'in time range',
    visible: false,
    fieldTypes: ['datetime']
  },
  {
    /** Matches if field value is between two values (inclusive start, exclusive end)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: 'gteq_lt',
    label: 'in time range',
    visible: false,
    fieldTypes: ['datetime']
  },
  {
    /** Matches if field value is greater than first and less than or equal to second
     * @field Integer, Datetime
     * @value Array
     */
    matcher: 'gt_lteq',
    label: 'in time range',
    visible: false,
    fieldTypes: ['datetime']
  },
  {
    /** Matches if field value is between two values (inclusive)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: 'gteq_lteq',
    label: 'in time range',
    visible: true,
    fieldTypes: ['datetime']
  },
  {
    /** Matches if field value is in provided array
     * @field Integer, String, Datetime
     * @value Array
     */
    matcher: 'is_in',
    label: 'included in',
    fieldTypes: ['integer', 'string', 'datetime']
  },
  {
    /** Matches if field value is not in provided array
     * @field Integer, String, Datetime
     * @value Array
     */
    matcher: 'is_not_in',
    label: 'not included in',
    fieldTypes: ['integer', 'string', 'datetime']
  },
  {
    /** Matches objects within arrays that meet specified requirements
     * @field Array
     * @value Object
     */
    matcher: 'array_match',
    label: 'array matches',
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

type ArrayMatcherDictionary = Record<
  keyof Extract<ItemWithValue['value'], Record<string, unknown>>,
  {
    label: string
  }
>

const arrayMatcherDictionary: ArrayMatcherDictionary = {
  in_and: {
    label: 'and'
  },
  in_or: {
    label: 'or'
  },
  not_in_and: {
    label: 'not and'
  },
  not_in_or: {
    label: 'not or'
  }
}

function ArrayMatch({
  value,
  pathPrefix
}: {
  value: ItemWithValue['value']
  pathPrefix: string
}): React.JSX.Element {
  if (typeof value !== 'object' || Array.isArray(value) || value === null) {
    value = {
      in_and: []
    }
  }

  return (
    <div>
      {Object.entries(value).map(([operation, operationValue], index) => {
        return (
          <ArrayMatchItem
            pathPrefix={pathPrefix}
            defaultValue={operationValue}
            initialMatcher={operation as keyof ArrayMatcherDictionary}
            key={`${pathPrefix}.${index}`}
          />
        )
      })}
    </div>
  )
}

function ArrayMatchItem({
  initialMatcher,
  defaultValue,
  pathPrefix
}: {
  initialMatcher: keyof ArrayMatcherDictionary
  defaultValue: Extract<ItemWithValue['value'], any[]>
  pathPrefix: string
}): React.JSX.Element {
  const [prevMatcher, setPrevMatcher] =
    useState<keyof ArrayMatcherDictionary>(initialMatcher)
  const [matcher, setMatcher] =
    useState<keyof ArrayMatcherDictionary>(initialMatcher)
  const [value, setValue] =
    useState<Extract<ItemWithValue['value'], any[]>>(defaultValue)
  const { setPath } = useRuleEngine()

  useEffect(() => {
    if (prevMatcher !== matcher) {
      setPath(`${pathPrefix}.${prevMatcher}`, null)
      setPrevMatcher(matcher)
    }

    setPath(`${pathPrefix}.${matcher}`, value)
  }, [matcher, value, setPath])

  return (
    <div className='flex gap-2 last-of-type:mt-2'>
      <div className='flex-shrink-0'>
        <InputSelect
          defaultValue={[
            { value: matcher, label: arrayMatcherDictionary[matcher].label }
          ]}
          initialValues={Object.entries(arrayMatcherDictionary).map(
            ([value, { label }]) => ({
              value,
              label
            })
          )}
          onSelect={(selected) => {
            if (isSingleValueSelected(selected)) {
              setMatcher(selected.value as keyof ArrayMatcherDictionary)
            }
          }}
        />
      </div>
      <div className='flex-grow'>
        <InputSelect
          isMulti
          isCreatable
          defaultValue={(Array.isArray(value) ? value : []).map((v) => ({
            value: v,
            label: v.toString()
          }))}
          initialValues={[]}
          onSelect={(selected) => {
            if (isMultiValueSelected(selected)) {
              setValue(
                selected.map((s) =>
                  typeof s.value === 'boolean' ? s.value.toString() : s.value
                )
              )
            }
          }}
        />
      </div>
    </div>
  )
}
