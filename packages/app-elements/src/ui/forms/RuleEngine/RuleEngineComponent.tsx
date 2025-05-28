import { Icon, IconProps } from '#ui/atoms/Icon'
import { CodeEditor, CodeEditorProps } from '#ui/forms/CodeEditor'
import { Input } from '#ui/forms/Input'
import { InputSelect } from '#ui/forms/InputSelect'
import { InputWrapper, InputWrapperBaseProps } from '#ui/internals/InputWrapper'
import classNames from 'classnames'
import React, { useState } from 'react'
import { SetOptional } from 'type-fest'
import { RulesForOrderContext } from './schema.order_rules'

export interface RuleEngineProps
  extends Omit<InputWrapperBaseProps, 'label' | 'inline'>,
  SetOptional<Pick<HTMLInputElement, 'id' | 'name'>, 'id' | 'name'>,
  Pick<CodeEditorProps, 'defaultValue' | 'value'> {
    
}

export function RuleEngine(props: RuleEngineProps): React.JSX.Element {
  const [editorVisible, setEditorVisible] = useState(false);
  const { rules } = (JSON.parse(props.defaultValue ?? JSON.stringify({ rules: [] })) as unknown as RulesForOrderContext ) ?? { rules: [] };
  const firstRule = rules?.[0]


  return (
    <InputWrapper hint={props.hint} feedback={props.feedback}>
      <section className='flex h-full'>
        <div className={`shrink-0 basis-1/2 overflow-x-auto relative ${editorVisible ? '' : 'grow'}`}>
          <header className='absolute w-full top-0 z-10 bg-white border-b border-gray-200 py-3 px-8 flex text-[13px] gap-4 text-gray-400 font-semibold items-center'>
            <span className='font-bold text-black'>#01</span>
            <span>#02</span>

            <div className='flex-grow flex justify-end'>
              <button onClick={() => {
                setEditorVisible(!editorVisible);
              }} className='text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                <Icon name="sidebarSimple" size={16} color='#101111' />
              </button>
            </div>
          </header>

          <Canvas>
            <div className='mt-12 mb-8'>10% off on all products that are “new” in US</div>
            <Card title='Actions' icon='lightning'>
              <Item />
            </Card>

            <CardConnector>when</CardConnector>

            <Card title='Conditions' icon='treeView'>
              <Condition item={firstRule} />
            </Card>

          </Canvas>
        </div>
        { editorVisible && (
          <div className='shrink-0 basis-1/2'>
            <CodeEditor
              name={props.id ?? props.name}
              height={'100%'}
              language='json'
              jsonSchema='order-rules'
              defaultValue={props.defaultValue}
              value={props.value}
              noRounding
            />
          </div>
        )}
      </section>
    </InputWrapper>
  );
}

type SchemaRule = NonNullable<RulesForOrderContext['rules']>[number]
type SchemaCondition = NonNullable<SchemaRule['conditions'][number]['nested']>

function Condition({ item, children, isNested = false }: { item?: SchemaCondition, isNested?: boolean, children?: React.JSX.Element }): React.JSX.Element {
  const conditionsLogin = item?.conditions_logic?.toLowerCase() ?? 'and';

  return (
    <div className={classNames('query-group', {
      'p-4 border border-gray-200 rounded-md': isNested,
    })}>
      {children}
      {
        item && (
          <>
            <select className="pl-4 pr-8 py-2 font-bold focus:ring-0 focus:outline-none appearance-none bg-gray-50 border border-gray-200 rounded-md text-sm leading-4">
              <option value='and' selected={conditionsLogin === 'and'}>AND</option>
              <option value='or' selected={conditionsLogin === 'or'}>OR</option>
            </select>
            <div className="border-l border-gray-200 ml-3 pt-3">
              {
                item?.conditions?.map((condition, index, arr) => {
                  const isLast = index === arr.length - 1
                  return (
                    <div key={index} className="flex items-center mb-4 last:mb-0 relative">
                      <Connector rounded={isLast} />
                      <div className="ml-4 w-full">
                        <Condition item={condition.nested ?? undefined} isNested>
                          <div className={classNames({ 'mb-4': condition.nested != null})}>
                            <Item />
                          </div>
                        </Condition>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </>
        )
      }
    </div>
  )
}

function Connector({ rounded = false }: { rounded?: boolean }): React.JSX.Element {
  if (!rounded) {
    return <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-px bg-gray-200"></div>
  }

  return (
    <>
      <div className="absolute -left-[1px] top-1/2 w-px h-1/2 bg-white"></div>
      <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-l border-b rounded-es-sm bg-white border-gray-200"></div>
    </>
  )
}

function CardConnector({ children }: { children: string }): React.JSX.Element {
  return (
    <div className="text-gray-500 flex items-center justify-center flex-col">
      <div className="h-6 w-[2px] bg-gray-200"></div>
      <span className="font-bold my-1 bg-gray-200 px-3 relative uppercase rounded h-[25px] items-center flex text-sm">{children}</span>
      <div className="h-6 w-[2px] bg-gray-200"></div>
    </div>
  )
}

function Item(): React.JSX.Element {
  return (
    <div className="bg-gray-50 rounded-md p-2 flex items-center justify-between gap-4">
      <div className="flex-1">
        <InputSelect
          defaultValue={{ label: 'Percentage discount', value: 'Percentage discount' }}
          initialValues={[{ value: 'Percentage discount', label: 'Percentage discount' }]}
          onSelect={() => { }} />
      </div>

      <div className="w-24">
        <Input type='number' value="3" />
      </div>

      <div className="text-black font-bold text-sm">ON</div>

      <div className="flex-1">
        <InputSelect
          defaultValue={{ label: 'Line items', value: 'Line items' }}
          initialValues={[{ value: 'Line items', label: 'Line items' }]}
          onSelect={() => { }} />
      </div>
    </div>
  )
}

function Card({ children, title, icon }: { title: string; icon: IconProps['name']; children?: React.ReactNode }): React.JSX.Element {
  return (
    <div className="rounded-md bg-white drop-shadow-sm">
      <div className="flex items-center space-x-2 py-4 border-b border-gray-100">
        <div className="w-8 h-8 -ml-4 bg-white rounded-full border border-gray-200 flex items-center justify-center drop-shadow-sm shadow-primary-200">
          <Icon name={icon} />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

function Canvas({ children }: { children?: React.ReactNode }): React.JSX.Element {
  return (
    <div className='h-full w-full bg-gray-50 p-8 [background-image:radial-gradient(#d6d6d6_1px,transparent_1px)] [background-size:16px_16px] overflow-auto'>
      <div className='max-w-[900px] mx-auto'>{children}</div>
    </div>
  );
}
