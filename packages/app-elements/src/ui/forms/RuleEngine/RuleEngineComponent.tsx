import type { OnMount } from "@monaco-editor/react"
import classNames from "classnames"
import { isEqual } from "lodash-es"
import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { SetOptional } from "type-fest"
import { useTokenProvider } from "#providers/TokenProvider/TokenProvider"
import { Button } from "#ui/atoms/Button"
import { Icon, type IconProps } from "#ui/atoms/Icon"
import { Dropdown, DropdownDivider, DropdownItem } from "#ui/composite/Dropdown"
import { CodeEditor, type CodeEditorProps } from "#ui/forms/CodeEditor"
import {
  InputWrapper,
  type InputWrapperBaseProps,
} from "#ui/internals/InputWrapper"
import { Action } from "./Action"
import { Condition } from "./Condition"
import { type OptionsConfig, parseOptionsFromSchema } from "./optionsConfig"
import { RuleEngineProvider, useRuleEngine } from "./RuleEngineContext"
import { RuleName } from "./RuleName"
import { fetchJsonSchema, type RulesObject } from "./utils"

export interface RuleEngineProps
  extends Omit<InputWrapperBaseProps, "label" | "inline">,
    SetOptional<Pick<HTMLInputElement, "id" | "name">, "id" | "name">,
    Pick<CodeEditorProps, "defaultValue" | "value"> {
  /**
   * Default value for the CodeEditor visibility.
   * If not provided, the CodeEditor will be hidden by default.
   * @default false
   */
  defaultCodeEditorVisible?: boolean

  /**
   * Schema type to be used when building the rule.
   */
  schemaType: Extract<
    NonNullable<CodeEditorProps["jsonSchema"]>,
    "order-rules" | "price-rules"
  >

  /**
   * Triggered when the editor value changes.
   * @param value The new editor value.
   * @returns
   */
  onChange?: (value: RulesObject) => void
}

const emptyRule: RulesObject = {
  rules: [],
}

const parseValue = (value: string | undefined): RulesObject => {
  try {
    return JSON.parse(value ?? JSON.stringify(emptyRule)) as RulesObject
  } catch (_error) {
    return emptyRule
  }
}

const isParsable = (value: string | undefined): boolean => {
  try {
    JSON.parse(value ?? "{}")
    return true
  } catch (_error) {
    return false
  }
}

export function RuleEngine(props: RuleEngineProps): React.JSX.Element {
  const {
    settings: { domain },
  } = useTokenProvider()

  const [optionsConfig, setOptionsConfig] = useState<OptionsConfig>({
    actions: {} as any,
    conditions: [],
  })

  const [value, setValue] = useState<RulesObject>(
    parseValue(props.value ?? props.defaultValue),
  )

  useEffect(
    function updateValue() {
      if (value.rules?.length === 0) {
        setValue(parseValue(props.value))
      }
    },
    [props.value],
  )

  useEffect(
    function parseSchema() {
      fetchJsonSchema(props.schemaType, domain).then((jsonSchema) => {
        const parsedOptionsConfig = parseOptionsFromSchema(
          jsonSchema as any,
          props.schemaType,
        )
        setOptionsConfig(parsedOptionsConfig)
      })
    },
    [domain],
  )

  return (
    <RuleEngineProvider
      initialValue={{
        value: { rules: value.rules },
        schemaType: props.schemaType,
        optionsConfig,
      }}
    >
      <RuleEditorComponent {...props} />
    </RuleEngineProvider>
  )
}

function RuleEditorComponent(props: RuleEngineProps): React.JSX.Element {
  const {
    state: { value, selectedRuleIndex },
    setSelectedRuleIndex,
    setValue,
    setPath,
  } = useRuleEngine()

  const [editorOnFocus, setEditorOnFocus] = useState(false)

  const [editorVisible, setEditorVisible] = useState(
    props.defaultCodeEditorVisible ?? false,
  )
  const selectedRule = value.rules?.[selectedRuleIndex]
  const codeEditorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const [forcedRender, setForcedRender] = useState(0)

  useEffect(
    function updateCodeEditor() {
      if (
        !editorOnFocus &&
        !isEqual(parseValue(codeEditorRef.current?.getValue()), value)
      ) {
        codeEditorRef.current?.setValue(JSON.stringify(value, null, 2))
        props.onChange?.(value)
      }
    },
    [value],
  )

  const handleCodeEditorChange = useCallback(
    (newValueAsString: string) => {
      const newValue = parseValue(newValueAsString)

      if (
        editorOnFocus &&
        isParsable(newValueAsString) &&
        !isEqual(newValue, value)
      ) {
        setValue(newValue)
        setForcedRender((prev) => prev + 1)
        props.onChange?.(newValue)
      }
    },
    [value, editorOnFocus],
  )

  return (
    <InputWrapper
      hint={props.hint}
      feedback={props.feedback}
      className="h-full [&>div:first-of-type]:h-full"
    >
      <section className="flex h-full">
        <div
          key={forcedRender}
          className={`shrink-0 basis-3/5 overflow-x-auto relative flex flex-col ${editorVisible ? "" : "grow"}`}
        >
          <header className="w-full bg-white border-b border-gray-200 px-4 flex text-[13px] gap-4 text-gray-400 font-semibold items-center">
            <div className="flex items-center flex-wrap basis-full">
              {value.rules?.map((rule, ruleIndex, rules) => {
                const label = `#${(ruleIndex + 1).toString().padStart(2, "0")}`
                return (
                  <div
                    key={`${ruleIndex}-${rule.id}`}
                    className="flex items-center py-3 pl-4 pr-2 border-r basis-[88px] justify-center"
                  >
                    <button
                      type="button"
                      className={classNames("font-bold mr-2", {
                        "text-black": selectedRuleIndex === ruleIndex,
                      })}
                      onClick={() => {
                        setSelectedRuleIndex(ruleIndex)
                      }}
                    >
                      {label}
                    </button>

                    <Dropdown
                      menuPosition={
                        ruleIndex === 0 ? "bottom-left" : "bottom-right"
                      }
                      dropdownLabel={
                        <Button variant="circle">
                          <Icon name="dotsThreeVertical" size={16} />
                        </Button>
                      }
                      dropdownItems={
                        <>
                          <DropdownItem
                            onClick={() => {
                              const ruleIndex = value.rules?.length ?? 0
                              setPath(`rules.${ruleIndex}`, {
                                ...rule,
                                id: undefined,
                                name: `${rule.name} (copy)`,
                              })
                              setSelectedRuleIndex(ruleIndex)
                            }}
                            label="Duplicate"
                          />
                          <DropdownDivider />
                          <DropdownItem
                            disabled={rules.length === 1}
                            onClick={() => {
                              setPath(`rules.${ruleIndex}`, null)
                              if (selectedRuleIndex >= ruleIndex) {
                                setSelectedRuleIndex(selectedRuleIndex - 1)
                              }
                            }}
                            label="Delete"
                          />
                        </>
                      }
                    />
                  </div>
                )
              })}
              <div className="min-h-[49px] flex items-center">
                <Button
                  variant="circle"
                  className="mx-4"
                  onClick={() => {
                    setPath(`rules.${value.rules?.length ?? 0}`, {
                      name: "Rule name",
                      actions: [null],
                      conditions: [null],
                    })
                    setSelectedRuleIndex(value.rules?.length ?? 0)
                  }}
                >
                  <Icon name="plus" size={16} className="shrink-0" />
                </Button>
              </div>
            </div>

            <div className="grow flex justify-end">
              <Button
                variant="circle"
                onClick={() => {
                  setEditorVisible(!editorVisible)
                }}
              >
                <Icon name="sidebarSimple" size={16} />
              </Button>
            </div>
          </header>

          <Canvas>
            {selectedRule && (
              <>
                <div className="mb-8 flex items-center gap-2">
                  <RuleName />
                  <Icon name="pencilSimple" size={16} className="shrink-0" />
                </div>

                <Card
                  title={
                    <div>
                      When{" "}
                      <select
                        onChange={(event) => {
                          setPath(
                            `rules.${selectedRuleIndex}.conditions_logic`,
                            event.currentTarget.value,
                          )
                        }}
                        value={selectedRule?.conditions_logic ?? "all"}
                        className={classNames(
                          "pl-4 pr-8 py-2 font-bold focus:ring-0 focus:outline-hidden appearance-none bg-gray-50 border border-gray-200 rounded-md text-sm leading-4",
                          "ml-1 mr-1.5",
                        )}
                      >
                        <option value="and">All</option>
                        <option value="or">Any</option>
                      </select>
                      conditions occur
                    </div>
                  }
                  icon="treeView"
                >
                  <Condition
                    item={selectedRule}
                    pathPrefix={`rules.${selectedRuleIndex}`}
                  />
                  <div className="mt-6">
                    <Button
                      size="small"
                      variant="secondary"
                      alignItems="center"
                      onClick={() => {
                        setPath(
                          `rules.${selectedRuleIndex}.conditions.${selectedRule?.conditions?.length ?? 0}`,
                          undefined,
                        )
                      }}
                    >
                      <Icon name="plusCircle" /> Add condition
                    </Button>
                  </div>
                </Card>

                <CardConnector>do</CardConnector>

                <Card title="Actions" icon="lightning">
                  <Action actions={selectedRule?.actions} />
                </Card>
              </>
            )}
          </Canvas>
        </div>
        {editorVisible && (
          <div className="shrink-0 basis-2/5">
            <CodeEditor
              ref={codeEditorRef}
              name={props.id ?? props.name}
              height="100%"
              language="json"
              jsonSchema={props.schemaType}
              defaultValue={JSON.stringify(value, null, 2)}
              noRounding
              onFocus={() => {
                setEditorOnFocus(true)
              }}
              onBlur={() => {
                setEditorOnFocus(false)
              }}
              onChange={handleCodeEditorChange}
            />
          </div>
        )}
      </section>
    </InputWrapper>
  )
}

function CardConnector({ children }: { children: string }): React.JSX.Element {
  return (
    <div className="text-gray-500 flex items-center justify-center flex-col">
      <div className="h-6 w-[2px] bg-gray-200" />
      <span className="font-bold my-1 bg-gray-200 px-3 relative uppercase rounded h-[25px] items-center flex text-sm">
        {children}
      </span>
      <div className="h-6 w-[2px] bg-gray-200" />
    </div>
  )
}

function Card({
  children,
  title,
  icon,
}: {
  title: React.ReactNode
  icon: IconProps["name"]
  children?: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="rounded-md bg-white shadow-xs">
      <div className="flex items-center space-x-4 py-4 border-b border-gray-100">
        <div className="w-8 h-8 -ml-4 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-xs shadow-primary-200">
          <Icon name={icon} />
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>

      <div className="p-6">{children}</div>
    </div>
  )
}

function Canvas({
  children,
}: {
  children?: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="h-full w-full bg-gray-50 p-8 bg-[radial-gradient(#d6d6d6_1px,transparent_1px)] bg-size-[16px_16px] overflow-auto">
      <div className="max-w-[900px] mx-auto">{children}</div>
    </div>
  )
}
