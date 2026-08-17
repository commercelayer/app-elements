import cn from "classnames"
import React, {
  Children,
  type JSX,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"
import invariant from "ts-invariant"

export interface TabsProps {
  /**
   * Used for accessability
   */
  id?: string
  /*
   * css class
   */
  className?: string
  /**
   * Event that fires every time a tab is activated. Note that this also fires on first render.
   */
  onTabSwitch?: (tabIndex: number) => void
  /**
   * Children can only be <Tab> components
   * Example:
   * ```
   * <Tabs>
   *   <Tab name="First tab">My content<Tab>
   *   <Tab name="Second tab">Another content<Tab>
   * </Tabs>
   * ```
   */
  children: Array<React.ReactElement<TabProps, typeof Tab> | null>
  /**
   * This controls whether the content of inactive tabs should be un-mounted or kept mounted but hidden.
   */
  keepAlive?: boolean
  /**
   * Optional prop to define which tab needs to be activated at component mount by providing its numerical index. First tab has index 0.
   */
  defaultTab?: number
}

function Tabs({
  id = "tab",
  children,
  onTabSwitch,
  className,
  keepAlive,
  defaultTab,
  ...rest
}: TabsProps): JSX.Element {
  // since we allow `null` child (conditional rendering of <Tab>), we need to understand the first not null child to set as initial active
  const firstActiveIndex = useMemo(
    () =>
      // biome-ignore lint/complexity/useIndexOf: safe to use
      Children.map(children, (tab) => tab != null)?.findIndex(
        (c) => c === true,
      ),
    [children],
  )
  const [activeIndex, setActiveIndex] = useState(
    defaultTab ?? firstActiveIndex ?? 0,
  )

  useEffect(
    function validateChildren() {
      Children.map(children, (tab, index) => {
        if (tab === null) {
          return
        }
        invariant(
          tab.type.name,
          `Only "<Tab>" components can be used as children. Invalid at index #${index}`,
        )

        invariant(
          tab.props.name,
          `Missing prop "name" in <Tab> component at index #${index}`,
        )
        invariant(
          typeof tab.props.name === "string",
          `Prop "name" must be a string. Invalid at index #${index}`,
        )
      })
    },
    [children],
  )

  return (
    <div id={id} role="tablist" className={className} {...rest}>
      {/* Navs */}
      <nav className="flex gap-8 border-b-gray-100 border-b">
        {Children.map(
          children,
          (tab, index) =>
            tab != null && (
              // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
              <React.Fragment key={index}>
                {/* nothing to separate before the first rendered tab */}
                {tab.props.separatorBefore === true &&
                  index > (firstActiveIndex ?? 0) && <TabNavSeparator />}
                <TabNav
                  isActive={index === activeIndex}
                  label={tab.props.name}
                  onClick={() => {
                    setActiveIndex(index)
                    onTabSwitch?.(index)
                  }}
                  id={`tab-nav-${id}-${index}`}
                  data-testid={`tab-nav-${index}`}
                />
              </React.Fragment>
            ),
        )}
      </nav>
      {/* Tab Panels */}
      {Children.map(children, (tab, index) => {
        if (tab === null) {
          return
        }
        return (
          <TabPanel
            isActive={index === activeIndex}
            data-testid={`tab-panel-${index}`}
            aria-labelledby={`tab-nav-${id}-${index}`}
            keepAlive={Boolean(keepAlive)}
          >
            {tab.props.children}
          </TabPanel>
        )
      })}
    </div>
  )
}

export interface TabProps {
  /**
   * This is the tab name used to render the Tab Navigation on top
   */
  name: string
  /**
   * Draws a vertical rule before this tab in the navigation, to set the tabs that
   * follow apart from the ones before — e.g. to separate the states an order moves
   * through from the shelves it can be put on (carts, archive).
   *
   * Ignored on the first rendered tab, where there is nothing to separate.
   */
  separatorBefore?: boolean
  /**
   * Tab Panel content
   */
  children: ReactNode
}

function Tab({ children }: TabProps): React.ReactElement {
  return <>{children}</>
}

/**
 * The rule between two groups of tabs. A flex item like the tabs themselves, so it
 * picks up the same `gap` on either side, and padded like them so its line centres
 * on the labels rather than on the whole row.
 */
function TabNavSeparator(): JSX.Element {
  return (
    <div
      aria-hidden
      className="flex items-center pb-4 -mb-[2px]"
      data-testid="tab-nav-separator"
    >
      <span className="block w-px h-4 bg-gray-200" />
    </div>
  )
}

function TabNav({
  isActive,
  label,
  onClick,
  id,
  ...rest
}: {
  id: string
  isActive: boolean
  onClick: () => void
  label: string
}): JSX.Element {
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: Using div as a tab element
    // biome-ignore lint/a11y/useKeyWithClickEvents: Using click handler to switch tabs
    <div
      id={id}
      className={cn(
        "text-center pb-4 leading-6 cursor-pointer transition-all duration-300 -mb-[2px]",
        {
          "border-b-black border-b-2 text-black font-semibold": isActive,
          "border-b-transparent border-b-2 text-gray-500": !isActive,
        },
      )}
      onClick={onClick}
      role="tab"
      {...rest}
    >
      {label}
    </div>
  )
}

function TabPanel({
  children,
  isActive,
  keepAlive,
  ...rest
}: {
  isActive: boolean
  children: ReactNode
  keepAlive: boolean
}): JSX.Element | null {
  if (!isActive && !keepAlive) {
    return null
  }

  return (
    <div className="pt-4" role="tabpanel" {...rest} hidden={!isActive}>
      {children}
    </div>
  )
}

Tabs.displayName = "Tabs"
Tab.displayName = "Tab"

export { Tab, Tabs }
