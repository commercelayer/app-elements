import type { OnMount } from "@monaco-editor/react"
import classNames from "classnames"
import { isEqual } from "lodash-es"
import type React from "react"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import type { SetOptional } from "type-fest"
import { useTokenProvider } from "#providers/TokenProvider/TokenProvider"
import { Button } from "#ui/atoms/Button"
import { Icon, type IconProps } from "#ui/atoms/Icon"
import { Tooltip } from "#ui/atoms/Tooltip"
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
      let cancelled = false

      void fetchJsonSchema(props.schemaType, domain).then((jsonSchema) => {
        if (cancelled) {
          return
        }

        const parsedOptionsConfig = parseOptionsFromSchema(
          jsonSchema as any,
          props.schemaType,
        )
        setOptionsConfig(parsedOptionsConfig)
      })

      return () => {
        cancelled = true
      }
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

// Same shape as the drag handle of the columns menu: a small rounded rectangle,
// narrower than the circle button so the tabs bar keeps more room for the tabs.
const headerButtonClassName =
  "flex items-center justify-center shrink-0 w-6 h-7 rounded text-black outline-hidden hover:bg-gray-100 focus-visible:bg-gray-100"

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
  const tabRefs = useRef<Array<HTMLDivElement | null>>([])
  const tabsScrollerRef = useRef<HTMLDivElement>(null)

  /**
   * Store, on each tab, where its menu trigger sits within the menu's containing block,
   * which is outside of the tabs scroller. The static position of the menu would not
   * account for the scroller being scrolled.
   */
  const positionTabMenus = useCallback(() => {
    for (const tab of tabRefs.current) {
      const trigger = tab?.querySelector("[aria-haspopup]")
      const containingBlock = tab?.offsetParent
      if (tab == null || trigger == null || containingBlock == null) {
        continue
      }

      const triggerRect = trigger.getBoundingClientRect()
      const origin =
        containingBlock.getBoundingClientRect().left +
        containingBlock.clientLeft -
        containingBlock.scrollLeft
      tab.style.setProperty(
        "--tab-menu-start",
        `${triggerRect.left - origin}px`,
      )
      tab.style.setProperty("--tab-menu-end", `${triggerRect.right - origin}px`)
    }
  }, [])

  const [hasHiddenTabsOnRight, setHasHiddenTabsOnRight] = useState(false)

  const updateTabsFade = useCallback(() => {
    const scroller = tabsScrollerRef.current
    if (scroller != null) {
      setHasHiddenTabsOnRight(
        scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1,
      )
    }
  }, [])

  useEffect(
    function observeTabsOverflow() {
      updateTabsFade()

      const scroller = tabsScrollerRef.current
      if (scroller == null || typeof ResizeObserver === "undefined") {
        return
      }

      const observer = new ResizeObserver(updateTabsFade)
      observer.observe(scroller)
      return () => {
        observer.disconnect()
      }
    },
    [value.rules],
  )

  useEffect(
    function scrollSelectedTabIntoView() {
      tabRefs.current[selectedRuleIndex]?.scrollIntoView?.({
        block: "nearest",
        inline: "nearest",
      })
    },
    [selectedRuleIndex, value.rules?.length],
  )

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
            <div className="flex items-center min-w-0 grow">
              <div
                ref={tabsScrollerRef}
                className="flex items-center min-w-0 overflow-x-auto [scrollbar-width:thin]"
                // Measured before a menu opens, and again on scroll so an open menu follows its tab
                onPointerDownCapture={positionTabMenus}
                onKeyDownCapture={positionTabMenus}
                onScroll={() => {
                  positionTabMenus()
                  updateTabsFade()
                }}
              >
                {value.rules?.map((rule, ruleIndex, rules) => {
                  const label =
                    rule.name?.trim() ||
                    `#${(ruleIndex + 1).toString().padStart(2, "0")}`
                  return (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: The index is used as part of a more complex key.
                      key={`${ruleIndex}-${rule.id}`}
                      ref={(element) => {
                        tabRefs.current[ruleIndex] = element
                      }}
                      className="flex items-center shrink-0 py-3 pl-4 pr-2 border-r"
                    >
                      <RuleTabLabel
                        label={label}
                        selected={selectedRuleIndex === ruleIndex}
                        onClick={() => {
                          setSelectedRuleIndex(ruleIndex)
                        }}
                      />

                      <Dropdown
                        // The tabs live in a horizontal scroller, which also clips vertically.
                        // The menu is positioned against an ancestor outside of it, so it is not
                        // cut off: below the trigger, at the offsets `positionTabMenus` measures.
                        // Past the first tab it ends at the trigger's right edge.
                        className={classNames(
                          "static! [&>div:last-child]:top-auto! [&>div:last-child]:right-auto!",
                          ruleIndex === 0
                            ? "[&>div:last-child]:left-(--tab-menu-start)!"
                            : "[&>div:last-child]:left-(--tab-menu-end)! [&>div:last-child]:-translate-x-full",
                        )}
                        menuPosition={
                          ruleIndex === 0 ? "bottom-left" : "bottom-right"
                        }
                        dropdownLabel={
                          <button
                            type="button"
                            className={headerButtonClassName}
                          >
                            <Icon
                              name="dotsThreeVertical"
                              size={16}
                              weight="bold"
                            />
                          </button>
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
              </div>
              {/* Hints at the tabs hidden on the right. Not positioned: as a later flex item it paints over the tabs, and below tooltips and menus. */}
              <div
                aria-hidden
                className={classNames(
                  "shrink-0 self-stretch w-8 -ml-8 pointer-events-none bg-linear-to-l from-white to-transparent transition-opacity",
                  { "opacity-0": !hasHiddenTabsOnRight },
                )}
              />
              <div className="min-h-[49px] flex items-center shrink-0">
                <button
                  type="button"
                  className={classNames(headerButtonClassName, "mx-4")}
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
                </button>
              </div>
            </div>

            <div className="shrink-0 flex justify-end">
              <button
                type="button"
                className={headerButtonClassName}
                onClick={() => {
                  setEditorVisible(!editorVisible)
                }}
              >
                <Icon name="sidebarSimple" size={16} />
              </button>
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

/**
 * The rule name shown on its tab, truncated when too long.
 * Only a truncated name gets a tooltip with the full name.
 */
function RuleTabLabel({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}): React.JSX.Element {
  const labelRef = useRef<HTMLButtonElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useLayoutEffect(
    function detectTruncation() {
      const element = labelRef.current
      if (element != null) {
        setIsTruncated(element.scrollWidth > element.clientWidth)
      }
    },
    [label],
  )

  const button = (
    <button
      ref={labelRef}
      type="button"
      className={classNames("font-bold mr-2 max-w-[160px] truncate", {
        "text-black": selected,
      })}
      onClick={onClick}
    >
      {label}
    </button>
  )

  return isTruncated ? (
    <Tooltip label={button} content={label} direction="bottom-start" />
  ) : (
    button
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
