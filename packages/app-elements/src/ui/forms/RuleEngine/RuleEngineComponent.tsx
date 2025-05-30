import { Icon, type IconProps } from '#ui/atoms/Icon'
import { CodeEditor, type CodeEditorProps } from '#ui/forms/CodeEditor'
import { Input } from '#ui/forms/Input'
import { InputSelect, isSingleValueSelected } from '#ui/forms/InputSelect'
import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { asUniqueArray } from '#utils/array'
import { type OnMount } from '@monaco-editor/react'
import classNames from 'classnames'
import { isEqual, set, unset } from 'lodash-es'
import React, { useEffect, useRef, useState } from 'react'
import type { SetOptional, SetRequired } from 'type-fest'
import { type RulesForOrderContext } from './schema.order_rules'

type Schema = SetRequired<RulesForOrderContext, 'rules'>

type ConditionMatchersWithoutValue = Exclude<
  SchemaConditionItem,
  { value: any }
>['matcher']

const conditionMatchersWithoutValue = asUniqueArray([
  'blank',
  'present',
  'null',
  'not_null'
]) satisfies ConditionMatchersWithoutValue[]

export interface RuleEngineProps
  extends Omit<InputWrapperBaseProps, 'label' | 'inline'>,
    SetOptional<Pick<HTMLInputElement, 'id' | 'name'>, 'id' | 'name'>,
    Pick<CodeEditorProps, 'defaultValue' | 'value'> {}

const emptyRule: Schema = {
  rules: []
}

const parseValue = (value: string | undefined): Schema => {
  try {
    return JSON.parse(value ?? JSON.stringify(emptyRule)) as Schema
  } catch (error) {
    return emptyRule
  }
}

const isParsable = (value: string | undefined): boolean => {
  try {
    JSON.parse(value ?? '{}')
    return true
  } catch (error) {
    return false
  }
}

interface SetPath {
  (path: string): SetPath
  (path: string, pathValue: unknown, shouldForceUpdate?: boolean): Schema
}

export function RuleEngine(props: RuleEngineProps): React.JSX.Element {
  const [value, setValue] = useState<Schema>(
    parseValue(props.value ?? props.defaultValue)
  )
  const [editorVisible, setEditorVisible] = useState(false)
  const [selectedRuleIndex, setSelectedRuleIndex] = useState<number>(0)
  const selectedRule = value.rules[selectedRuleIndex]
  const codeEditorRef = useRef<Parameters<OnMount>[0] | null>(null)

  console.log('re-render')

  useEffect(
    function updateValue() {
      if (value.rules.length === 0) {
        setValue(parseValue(props.value))
      }
    },
    [props.value]
  )

  function setPath(path: string): SetPath
  function setPath(
    path: string,
    pathValue: unknown,
    shouldForceUpdate?: boolean
  ): Schema

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function setPath(
    path: string,
    pathValue?: unknown,
    shouldForceUpdate: boolean = false
  ) {
    const pathPrefix = path
    if (pathValue === undefined) {
      return (
        path: string,
        pathValue?: unknown,
        shouldForceUpdate: boolean = false
      ) => setPath(`${pathPrefix}.${path}`, pathValue, shouldForceUpdate)
    }

    const newValue = shouldForceUpdate ? { ...value } : value

    if (pathValue == null) {
      unset(newValue, path)
      console.log('unset', path, pathValue, shouldForceUpdate, newValue)
    } else {
      set(newValue, path, pathValue)
    }

    setValue(newValue)
    codeEditorRef.current?.setValue(JSON.stringify(newValue, null, 2))

    return newValue
  }

  return (
    <InputWrapper
      hint={props.hint}
      feedback={props.feedback}
      className='h-full [&>div:first-of-type]:h-full'
    >
      <section className='flex h-full'>
        <div
          className={`shrink-0 basis-1/2 overflow-x-auto relative flex flex-col ${editorVisible ? '' : 'grow'}`}
        >
          <header className='w-full bg-white border-b border-gray-200 py-3 px-8 flex text-[13px] gap-4 text-gray-400 font-semibold items-center'>
            {value.rules.map((rule, ruleIndex) => {
              const label = `Rule #${(ruleIndex + 1).toString().padStart(2, '0')}`
              return (
                <button
                  key={rule.id}
                  className={classNames('font-bold', {
                    'text-black': selectedRuleIndex === ruleIndex
                  })}
                  onClick={() => {
                    setSelectedRuleIndex(ruleIndex)
                  }}
                >
                  {label}
                </button>
              )
            })}

            <div className='flex-grow flex justify-end'>
              <button
                className='text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                onClick={() => {
                  setEditorVisible(!editorVisible)
                }}
              >
                <Icon name='sidebarSimple' size={16} color='#101111' />
              </button>
            </div>
          </header>

          <Canvas>
            <div className='mb-8 flex items-center gap-2'>
              <div
                contentEditable='plaintext-only'
                suppressContentEditableWarning
                onInput={(event) => {
                  const target = event.currentTarget
                  const value = target.innerText.replace(/[\n\s]+/g, ' ').trim()
                  const id = `${window.crypto.randomUUID()}--${value.replace(/\s+/g, '-').toLowerCase()}`
                  setPath(`rules.${selectedRuleIndex}.name`, value)
                  setPath(`rules.${selectedRuleIndex}.id`, id)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    event.currentTarget.blur()
                  }
                }}
                onBlur={(event) => {
                  const target = event.currentTarget
                  target.innerText = target.innerText
                    .replace(/[\n\s]+/g, ' ')
                    .trim()
                }}
              >
                {selectedRule?.name}
              </div>
              <Icon name='pencilSimple' size={16} className='shrink-0' />
            </div>
            <Card title='Apply' icon='lightning'>
              {selectedRule?.actions?.map((action, actionIndex) => (
                <ActionItem
                  key={JSON.stringify(action)}
                  item={action}
                  setPath={setPath(
                    `rules.${selectedRuleIndex}.actions.${actionIndex}`
                  )}
                />
              ))}
            </Card>

            <CardConnector>when</CardConnector>

            <Card title='Conditions' icon='treeView'>
              <Condition
                item={selectedRule}
                setPath={setPath(`rules.${selectedRuleIndex}`)}
              />
            </Card>
          </Canvas>
        </div>
        {editorVisible && (
          <div className='shrink-0 basis-1/2'>
            <CodeEditor
              ref={codeEditorRef}
              name={props.id ?? props.name}
              height='100%'
              language='json'
              jsonSchema='order-rules'
              defaultValue={JSON.stringify(value, null, 2)}
              noRounding
              onChange={(newValueAsString) => {
                setValue((value) => {
                  const newValue = parseValue(newValueAsString)

                  if (
                    isParsable(newValueAsString) &&
                    !isEqual(newValue, value)
                  ) {
                    return newValue
                  }

                  return value
                })
              }}
            />
          </div>
        )}
      </section>
    </InputWrapper>
  )
}

type SchemaRule = Schema['rules'][number]
type SchemaCondition = NonNullable<SchemaRule['conditions'][number]['nested']>
type SchemaActionItem = NonNullable<SchemaRule['actions']>[number]
type SchemaConditionItem = NonNullable<SchemaCondition['conditions']>[number]

function Condition({
  item,
  children,
  isNested = false,
  setPath
}: {
  item?: SchemaCondition
  isNested?: boolean
  children?: React.JSX.Element
  setPath: SetPath
}): React.JSX.Element {
  const conditionsLogin = item?.conditions_logic?.toLowerCase() ?? 'and'

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
              setPath('conditions_logic', event.currentTarget.value)
            }}
            defaultValue={conditionsLogin}
            className='pl-4 pr-8 py-2 font-bold focus:ring-0 focus:outline-none appearance-none bg-gray-50 border border-gray-200 rounded-md text-sm leading-4'
          >
            <option value='and'>AND</option>
            <option value='or'>OR</option>
          </select>
          <div className='border-l border-gray-200 ml-3 pt-3'>
            {item?.conditions?.map((condition, conditionIndex, arr) => {
              const isLast = conditionIndex === arr.length - 1
              return (
                <div
                  key={JSON.stringify(condition)}
                  className='flex items-center mb-4 last:mb-0 relative'
                >
                  <Connector rounded={isLast} />
                  <div className='ml-4 w-full'>
                    <Condition
                      item={condition.nested ?? undefined}
                      isNested={condition.nested != null}
                      setPath={setPath(`conditions.${conditionIndex}.nested`)}
                    >
                      <div
                        className={classNames({
                          'mb-4': condition.nested != null
                        })}
                      >
                        <ConditionItem
                          item={condition}
                          setPath={setPath(`conditions.${conditionIndex}`)}
                        />
                      </div>
                    </Condition>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
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

function CardConnector({ children }: { children: string }): React.JSX.Element {
  return (
    <div className='text-gray-500 flex items-center justify-center flex-col'>
      <div className='h-6 w-[2px] bg-gray-200' />
      <span className='font-bold my-1 bg-gray-200 px-3 relative uppercase rounded h-[25px] items-center flex text-sm'>
        {children}
      </span>
      <div className='h-6 w-[2px] bg-gray-200' />
    </div>
  )
}

/**
 * This function is used to ensure that a value of type `never` is never reached.
 * @param _value - The value that is expected to be of type `never`.
 */
function expectNever(_value: never): null {
  return null
}

function ActionValue({
  item,
  setPath
}: {
  item: SchemaActionItem
  setPath: SetPath
}): React.ReactNode {
  switch (item.type) {
    case 'buy_x_pay_y':
      return (
        <div className='w-36'>
          <Input type='number' defaultValue={JSON.stringify(item.value)} />
        </div>
      )
    case 'every_x_discount_y':
      return (
        <div className='w-36'>
          <Input type='number' defaultValue={JSON.stringify(item.value)} />
        </div>
      )
    case 'fixed_amount':
    case 'fixed_price':
      return (
        <div className='w-36'>
          <Input
            type='number'
            defaultValue={item.value}
            min={0}
            suffix='cents'
            onChange={(event) => {
              setPath('value', parseInt(event.currentTarget.value, 10))
            }}
          />
        </div>
      )
    case 'percentage':
      return (
        <div className='w-20'>
          <Input
            type='number'
            defaultValue={item.value}
            min={0}
            max={100}
            suffix='%'
            onChange={(event) => {
              setPath('value', parseInt(event.currentTarget.value, 10))
            }}
          />
        </div>
      )
    default:
      return expectNever(item)
  }
}

/**
 * This function renders the value input for a condition item based on its matcher and its field.
 *
 * > // TODO: **NOTE** the kind of Component depends on the matcher used and the field used. For example, if the matcher is `eq` and the field is `email`, then it should be an email input. Or if the matcher is `gt` and the field is `created_at`, then it should be a date input.
 * > https://docs.commercelayer.io/rules-engine/matchers#value-required
 */
function ConditionValue({
  item,
  setPath
}: {
  item: SchemaConditionItem
  setPath: SetPath
}): React.ReactNode {
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

  switch (itemWithValue.matcher) {
    case 'gt':
    case 'lt':
    case 'gteq':
    case 'lteq':
    case 'gt_lt':
    case 'gteq_lt':
    case 'gt_lteq':
    case 'gteq_lteq':
      return (
        <Input
          type='number'
          defaultValue={
            typeof itemWithValue.value === 'number' ? itemWithValue.value : ''
          }
          placeholder='Enter value'
          onChange={(event) => {
            setPath('value', parseInt(event.currentTarget.value, 10))
          }}
        />
      )

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

function ActionItem({
  item,
  setPath
}: {
  item: SchemaActionItem
  setPath: SetPath
}): React.ReactNode {
  const typeDictionary: Record<typeof item.type, string> = {
    buy_x_pay_y: 'Buy X, Pay Y',
    every_x_discount_y: 'Every X, Discount Y',
    fixed_amount: 'Fixed amount',
    fixed_price: 'Fixed price',
    percentage: 'Percentage discount'
  }

  return (
    <div className='mb-6 last:mb-0'>
      <div className='bg-gray-50 rounded-md p-2 flex items-center justify-between gap-4'>
        {/* Action type */}
        <div className='flex-1'>
          <InputSelect
            defaultValue={{
              label: typeDictionary[item.type],
              value: item.type
            }}
            initialValues={Object.entries(typeDictionary).map(
              ([value, label]) => ({ value, label })
            )}
            onSelect={(selected) => {
              if (isSingleValueSelected(selected)) {
                setPath('type', selected.value, true)
              }
            }}
          />
        </div>

        {/* Action value */}
        <ActionValue item={item} setPath={setPath} />

        {/* ON */}
        <div className='text-black font-bold text-sm'>ON</div>

        {/* Action target */}
        <div className='flex-1'>
          {/* <InputSelect
            defaultValue={{ label: 'Line items', value: 'Line items' }}
            initialValues={[{ value: 'Line items', label: 'Line items' }]}
            onSelect={() => { }}
          /> */}
          <Input
            type='text'
            defaultValue={item.selector}
            onChange={(event) => {
              setPath('selector', event.currentTarget.value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

function ConditionItem({
  item,
  setPath
}: {
  item: SchemaConditionItem
  setPath: SetPath
}): React.JSX.Element {
  const matcherDictionary: Record<typeof item.matcher, string> = {
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
          defaultValue={item.field}
          onChange={(event) => {
            setPath('field', event.currentTarget.value)
          }}
        />
      </div>

      {/* Condition matcher */}
      <div className='flex-14'>
        <InputSelect
          defaultValue={{
            label: matcherDictionary[item.matcher],
            value: item.matcher
          }}
          initialValues={Object.entries(matcherDictionary).map(
            ([value, label]) => ({ value, label })
          )}
          onSelect={(selected) => {
            if (isSingleValueSelected(selected)) {
              setPath('matcher', selected.value, true)

              if (
                conditionMatchersWithoutValue.includes(
                  selected.value as ConditionMatchersWithoutValue
                )
              ) {
                setPath('value', null, true)
              }
            }
          }}
        />
      </div>

      {/* Condition value */}
      <div className='flex-1'>
        <ConditionValue item={item} setPath={setPath} />
      </div>
    </div>
  )
}

function Card({
  children,
  title,
  icon
}: {
  title: string
  icon: IconProps['name']
  children?: React.ReactNode
}): React.JSX.Element {
  return (
    <div className='rounded-md bg-white shadow-sm'>
      <div className='flex items-center space-x-4 py-4 border-b border-gray-100'>
        <div className='w-8 h-8 -ml-4 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm shadow-primary-200'>
          <Icon name={icon} />
        </div>
        <h2 className='text-lg font-semibold'>{title}</h2>
      </div>

      <div className='p-6'>{children}</div>
    </div>
  )
}

function Canvas({
  children
}: {
  children?: React.ReactNode
}): React.JSX.Element {
  return (
    <div className='h-full w-full bg-gray-50 p-8 [background-image:radial-gradient(#d6d6d6_1px,transparent_1px)] [background-size:16px_16px] overflow-auto'>
      <div className='max-w-[900px] mx-auto'>{children}</div>
    </div>
  )
}
