import { Icon, type IconProps } from '#ui/atoms/Icon'
import { CodeEditor, type CodeEditorProps } from '#ui/forms/CodeEditor'
import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { type OnMount } from '@monaco-editor/react'
import classNames from 'classnames'
import { isEqual, set, unset } from 'lodash-es'
import React, { useEffect, useRef, useState } from 'react'
import type { SetOptional, SetRequired } from 'type-fest'
import { Action } from './Action'
import { Condition } from './Condition'
import { type RulesForOrderContext } from './schema.order_rules'
import { type SetPath } from './utils'

type Schema = SetRequired<RulesForOrderContext, 'rules'>

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
              <Action
                actions={selectedRule?.actions}
                selectedRuleIndex={selectedRuleIndex}
                setPath={setPath}
              />
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
