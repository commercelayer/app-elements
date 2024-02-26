import cn from 'classnames'
import React, {
  Children,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import invariant from 'ts-invariant'

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
   * Optional tab index to activate a particular tab at component mount. First tab has index 0.
   */
  defaultTab?: number
}

function Tabs({
  id = 'tab',
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
      Children.map(children, (tab) => tab != null)?.findIndex(
        (c) => c === true
      ),
    [children]
  )
  const [activeIndex, setActiveIndex] = useState(firstActiveIndex ?? 0)

  useEffect(
    function validateChildren() {
      Children.map(children, (tab, index) => {
        if (tab === null) {
          return
        }
        invariant(
          tab.type.name,
          `Only "<Tab>" components can be used as children. Invalid at index #${index}`
        )

        invariant(
          tab.props.name,
          `Missing prop "name" in <Tab> component at index #${index}`
        )
        invariant(
          typeof tab.props.name === 'string',
          `Prop "name" must be a string. Invalid at index #${index}`
        )
      })
    },
    [children]
  )

  useEffect(() => {
    if (onTabSwitch != null) {
      onTabSwitch(activeIndex)
    }
  }, [activeIndex, onTabSwitch])

  useEffect(() => {
    if (defaultTab != null && defaultTab !== firstActiveIndex) {
      setActiveIndex(defaultTab)
    }
  }, [defaultTab, setActiveIndex])

  return (
    <div id={id} role='tablist' className={className} {...rest}>
      {/* Navs */}
      <nav className='flex gap-8 border-b-gray-100 border-b'>
        {Children.map(
          children,
          (tab, index) =>
            tab != null && (
              <TabNav
                key={index}
                isActive={index === activeIndex}
                label={tab.props.name}
                onClick={() => {
                  setActiveIndex(index)
                }}
                id={`tab-nav-${id}-${index}`}
                data-testid={`tab-nav-${index}`}
              />
            )
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
   * Tab Panel content
   */
  children: ReactNode
}

function Tab({ children }: TabProps): React.ReactElement {
  return <>{children}</>
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
    <div
      id={id}
      className={cn(
        'text-center pb-4 leading-6 cursor-pointer font-medium transition-all duration-300 -mb-[2px]',
        {
          'border-b-black border-b-2 text-black': isActive,
          'border-b-transparent border-b-2 text-gray-500': !isActive
        }
      )}
      onClick={onClick}
      role='tab'
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
    <div
      className='pt-4'
      role='tabpanel'
      aria-labelledby=''
      {...rest}
      hidden={!isActive}
    >
      {children}
    </div>
  )
}

Tabs.displayName = 'Tabs'
Tab.displayName = 'Tab'
export { Tab, Tabs }
