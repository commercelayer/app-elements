import { atPath } from '#ui/forms/CodeEditor/fetchCoreResourcesSuggestions'
import { Input } from '#ui/forms/Input'
import { InputDate } from '#ui/forms/InputDate'
import { InputSelect, isSingleValueSelected } from '#ui/forms/InputSelect'
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
  type Item = NonNullable<typeof item>
  const { setPath } = useRuleEngine()
  const matcherDictionary: Record<Item['matcher'], string> = {
    array_match: 'is one of',
    blank: 'is blank',
    does_not_match: 'does not match',
    end_with: 'ends with',
    eq: 'is',
    gt_lt: 'is greater than or less than',
    gt_lteq: 'is greater than or less than or equal',
    gt: 'is greater than',
    gteq_lt: 'is greater than or equal or less than',
    gteq_lteq: 'is greater than or equal or less than or equal',
    gteq: 'is greater than or equal',
    is_in: 'is in',
    is_not_in: 'is not in',
    lt: 'is less than',
    lteq: 'is less than or equal',
    matches: 'matches',
    multiple: 'is one of',
    not_end_with: 'does not end with',
    not_eq: 'is not',
    not_null: 'is not null',
    not_start_with: 'does not start with',
    null: 'is null',
    present: 'is present',
    start_with: 'starts with'
  }

  return (
    <div className='bg-gray-50 rounded-md p-2 flex items-center justify-between gap-4'>
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
        <InputSelect
          defaultValue={
            item != null
              ? {
                  label: matcherDictionary[item.matcher],
                  value: item.matcher
                }
              : undefined
          }
          initialValues={Object.entries(matcherDictionary).map(
            ([value, label]) => ({ value, label })
          )}
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
      </div>

      {/* Condition value */}
      <div className='flex-1'>
        <ConditionValue item={item} pathPrefix={pathPrefix} />
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
  const [fieldInfos, setFieldInfos] =
    useState<Awaited<ReturnType<typeof atPath>>['field']>(undefined)

  if (item == null) {
    return null
  }

  useEffect(() => {
    atPath(item.field)
      .then((result) => {
        setFieldInfos(result.field)
        console.log('result', result)
      })
      .catch((error) => {
        console.error('Error fetching field info:', error)
      })
  }, [item.field])

  if (
    conditionMatchersWithoutValue.includes(
      item.matcher as ConditionMatchersWithoutValue
    )
  ) {
    return null
  }

  const itemWithValue = item as Exclude<
    SchemaConditionItem,
    { matcher: ConditionMatchersWithoutValue }
  >

  if (fieldInfos?.type === 'datetime') {
    const date = parseISO(
      typeof itemWithValue.value === 'string' ? itemWithValue.value : ''
    )
    return (
      <InputDate
        value={isValid(date) ? date : undefined}
        placeholder='Enter value'
        onChange={(date) => {
          setPath(`${pathPrefix}.value`, date?.toJSON())
        }}
      />
    )
  }

  switch (itemWithValue.matcher) {
    case 'gt':
    case 'lt':
    case 'gteq':
    case 'lteq':
    case 'gt_lt':
    case 'gteq_lt':
    case 'gt_lteq':
    case 'gteq_lteq': {
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

    case 'eq':
    case 'end_with':
    case 'not_end_with':
    case 'not_eq':
    case 'start_with':
    case 'not_start_with':
      return (
        <Input
          type='text'
          defaultValue={
            typeof itemWithValue.value === 'string' ? itemWithValue.value : ''
          }
          placeholder='Enter value'
          onChange={(event) => {
            setPath('value', event.currentTarget.value)
          }}
        />
      )

    case 'array_match':
    case 'does_not_match':
    case 'is_in':
    case 'is_not_in':
    case 'matches':
    case 'multiple':
      return (
        <Input
          type='text'
          defaultValue={JSON.stringify(itemWithValue.value)}
          placeholder='Enter value'
          onChange={(event) => {
            setPath('value', event.currentTarget.value)
          }}
        />
      )

    default:
      return expectNever(itemWithValue.matcher)
  }
}
