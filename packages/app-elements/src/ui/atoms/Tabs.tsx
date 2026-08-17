import cn from "classnames"
import React, {
  Children,
  type JSX,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import invariant from "ts-invariant"

/** How wide the hint at each end of a scrolling tab row is. */
const FADE_WIDTH = "24px"

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

  /**
   * Which edges of the scrolling tab row have tabs beyond them, so the row can fade
   * out on those sides and hint that it scrolls.
   *
   * Needs the real scroll position, so it cannot be done in CSS alone. It also needs
   * no breakpoint: above `md` the row does not scroll, both edges read false, and no
   * mask is applied.
   */
  const scroller = useRef<HTMLDivElement>(null)
  const [overflowing, setOverflowing] = useState({ start: false, end: false })

  useEffect(() => {
    const element = scroller.current
    if (element == null) {
      return
    }
    const update = (): void => {
      const max = element.scrollWidth - element.clientWidth
      // a pixel of tolerance: fractional scroll positions never land on 0 or `max`
      const start = element.scrollLeft > 1
      const end = element.scrollLeft < max - 1
      setOverflowing((previous) =>
        previous.start === start && previous.end === end
          ? previous
          : { start, end },
      )
    }
    update()
    element.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => {
      element.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [children])

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

  const maskImage = useMemo(() => {
    if (!overflowing.start && !overflowing.end) {
      return undefined
    }
    const from = overflowing.start
      ? `transparent 0, black ${FADE_WIDTH}`
      : "black 0"
    const to = overflowing.end
      ? `black calc(100% - ${FADE_WIDTH}), transparent 100%`
      : "black 100%"
    return `linear-gradient(to right, ${from}, ${to})`
  }, [overflowing])

  return (
    <div id={id} role="tablist" className={className} {...rest}>
      {/* Navs. On a phone the row is wider than the screen, so it scrolls sideways
          instead of wrapping onto a second line. `w-full min-w-max` keeps the
          underline spanning the whole row when the tabs fit and lets the row grow
          past it when they do not, and the 2px bottom padding on the scroller
          absorbs the active tab's negative margin — otherwise that overhang counts
          as scrollable overflow and earns the row a vertical scrollbar. */}
      <div
        ref={scroller}
        className="overflow-x-auto pb-[2px] md:overflow-x-visible md:pb-0"
        // masked rather than covered by a gradient, so the fade works on whatever
        // the page background happens to be
        style={{ maskImage, WebkitMaskImage: maskImage }}
        data-testid="tab-nav-scroller"
      >
        <nav className="flex gap-8 border-b-gray-100 border-b w-full min-w-max">
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
      </div>
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
        // never break a two-word label ("In progress") onto a second line, and never
        // let the row squeeze it: the row scrolls instead
        "whitespace-nowrap shrink-0",
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
