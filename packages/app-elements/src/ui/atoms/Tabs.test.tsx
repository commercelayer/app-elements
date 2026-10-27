import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react"
import { Tab, Tabs } from "./Tabs"

interface SetupProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id }: SetupProps): SetupResult => {
  const utils = render(
    <Tabs data-testid={id} onTabSwitch={() => undefined}>
      <Tab name="Colors">Red, Blue, Pink</Tab>
      <Tab name="Animals">Lion, Tiger, Cat</Tab>
      <Tab name="Languages">
        <ul>
          <li>English</li>
          <li>Italian</li>
          <li>JavaScript</li>
        </ul>
      </Tab>
    </Tabs>,
  )
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils,
  }
}

describe("Tabs", () => {
  test("Should be rendered", () => {
    const { element } = setup({ id: "mytabs" })
    expect(element).toBeInTheDocument()
  })

  test("Should see first tab as active by default", () => {
    const { getByTestId } = setup({ id: "mytabs" })
    expect(getByTestId("tab-panel-0")).toBeInTheDocument()
  })

  test("Should able to switch tab", () => {
    const { element, getByTestId } = setup({ id: "mytabs" })
    // default state
    expect(getByTestId("tab-panel-0")).toBeInTheDocument()

    // click on third nav
    fireEvent(
      getByTestId("tab-nav-2"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    )

    // active tab is now the second
    expect(
      element.querySelector('[data-testid="tab-panel-0"]'),
    ).not.toBeInTheDocument()
    expect(getByTestId("tab-nav-2")).toBeInTheDocument()
  })
})

describe("Tabs accessibility", () => {
  const renderTabs = (): RenderResult =>
    render(
      <Tabs>
        <Tab name="Colors">Red, Blue, Pink</Tab>
        <Tab name="Animals">Lion, Tiger, Cat</Tab>
        <Tab name="Languages">English, Italian</Tab>
      </Tabs>,
    )

  it("exposes the tabs inside a tablist, with the active one selected", () => {
    const { getByRole, getAllByRole } = renderTabs()

    const tabs = getAllByRole("tab")
    expect(getByRole("tablist")).toContainElement(tabs[0] ?? null)
    expect(tabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual([
      "true",
      "false",
      "false",
    ])
  })

  it("ties the active tab and its panel to each other", () => {
    const { getByRole } = renderTabs()

    const tab = getByRole("tab", { name: "Colors" })
    const panel = getByRole("tabpanel", { name: "Colors" })
    expect(tab).toHaveAttribute("aria-controls", panel.id)
    expect(panel).toHaveAttribute("aria-labelledby", tab.id)
  })

  it("keeps the panels out of the tablist", () => {
    const { getByRole } = renderTabs()

    expect(getByRole("tablist")).not.toContainElement(getByRole("tabpanel"))
  })

  it("makes only the active tab a stop in the tab order", () => {
    const { getAllByRole } = renderTabs()

    expect(
      getAllByRole("tab").map((tab) => tab.getAttribute("tabindex")),
    ).toEqual(["0", "-1", "-1"])
  })

  it("moves focus with the arrow keys, wrapping at both ends, and with Home and End", () => {
    const { getAllByRole, getByRole } = renderTabs()
    const [colors, animals, languages] = getAllByRole("tab")
    const tablist = getByRole("tablist")

    act(() => {
      colors?.focus()
    })
    fireEvent.keyDown(tablist, { key: "ArrowRight" })
    expect(animals).toHaveFocus()
    fireEvent.keyDown(tablist, { key: "ArrowLeft" })
    fireEvent.keyDown(tablist, { key: "ArrowLeft" })
    expect(languages).toHaveFocus()
    fireEvent.keyDown(tablist, { key: "ArrowRight" })
    expect(colors).toHaveFocus()
    fireEvent.keyDown(tablist, { key: "End" })
    expect(languages).toHaveFocus()
    fireEvent.keyDown(tablist, { key: "Home" })
    expect(colors).toHaveFocus()
  })

  it("does not switch tab on focus alone, only on activation", () => {
    const onTabSwitch = vi.fn()
    const { getAllByRole, getByRole } = render(
      <Tabs onTabSwitch={onTabSwitch}>
        <Tab name="Colors">Red</Tab>
        <Tab name="Animals">Lion</Tab>
      </Tabs>,
    )
    const [colors, animals] = getAllByRole("tab")

    act(() => {
      colors?.focus()
    })
    fireEvent.keyDown(getByRole("tablist"), { key: "ArrowRight" })
    expect(onTabSwitch).not.toHaveBeenCalled()
    expect(getByRole("tabpanel")).toHaveTextContent("Red")

    fireEvent.click(animals as HTMLElement)
    expect(onTabSwitch).toHaveBeenCalledWith(1)
    expect(getByRole("tabpanel")).toHaveTextContent("Lion")
    expect(animals).toHaveAttribute("aria-selected", "true")
  })

  it("gives two tab sets on the same page distinct ids", () => {
    const { getAllByRole } = render(
      <>
        <Tabs>
          <Tab name="One">a</Tab>
          <Tab name="Two">b</Tab>
        </Tabs>
        <Tabs>
          <Tab name="Three">c</Tab>
          <Tab name="Four">d</Tab>
        </Tabs>
      </>,
    )

    const [first, , second] = getAllByRole("tab")
    expect(first?.id).not.toBe(second?.id)
    expect(first?.getAttribute("aria-controls")).not.toBe(
      second?.getAttribute("aria-controls"),
    )
  })
})

describe("Tabs separator", () => {
  it("draws a rule before the tab that asks for one, right after the previous tab", () => {
    const { container, queryAllByTestId } = render(
      <Tabs>
        <Tab name="Placed">a</Tab>
        <Tab name="Fulfilled">b</Tab>
        <Tab name="Carts" separatorBefore>
          c
        </Tab>
        <Tab name="Archived">d</Tab>
      </Tabs>,
    )

    expect(queryAllByTestId("tab-nav-separator")).toHaveLength(1)

    const navChildren = Array.from(
      container.querySelector('[role="tablist"]')?.children ?? [],
    )
    const separatorIndex = navChildren.findIndex(
      (child) => child.getAttribute("data-testid") === "tab-nav-separator",
    )
    expect(navChildren[separatorIndex - 1]).toHaveTextContent("Fulfilled")
    expect(navChildren[separatorIndex + 1]).toHaveTextContent("Carts")
  })

  it("draws none when no tab asks, and none before the first tab", () => {
    const { queryAllByTestId } = render(
      <Tabs>
        <Tab name="Placed" separatorBefore>
          a
        </Tab>
        <Tab name="Fulfilled">b</Tab>
      </Tabs>,
    )

    expect(queryAllByTestId("tab-nav-separator")).toHaveLength(0)
  })
})

describe("Tabs scroll fade", () => {
  /** jsdom lays nothing out, so the row's geometry has to be stated. */
  const setGeometry = (
    element: HTMLElement,
    {
      scrollWidth,
      clientWidth,
      scrollLeft,
    }: { scrollWidth: number; clientWidth: number; scrollLeft: number },
  ): void => {
    Object.defineProperty(element, "scrollWidth", {
      value: scrollWidth,
      configurable: true,
    })
    Object.defineProperty(element, "clientWidth", {
      value: clientWidth,
      configurable: true,
    })
    element.scrollLeft = scrollLeft
    fireEvent.scroll(element)
  }

  const renderTabs = (): HTMLElement => {
    const { getByTestId } = render(
      <Tabs>
        <Tab name="All">a</Tab>
        <Tab name="In progress">b</Tab>
        <Tab name="Archived">c</Tab>
      </Tabs>,
    )
    return getByTestId("tab-nav-scroller")
  }

  it("fades neither edge when the tabs fit", () => {
    const scroller = renderTabs()
    setGeometry(scroller, { scrollWidth: 390, clientWidth: 390, scrollLeft: 0 })

    expect(scroller.style.maskImage).toBe("")
  })

  it("fades the end only, at the start of the row", () => {
    const scroller = renderTabs()
    setGeometry(scroller, { scrollWidth: 600, clientWidth: 390, scrollLeft: 0 })

    expect(scroller.style.maskImage).toContain("transparent 100%")
    expect(scroller.style.maskImage).not.toContain("transparent 0")
  })

  it("fades both edges midway", () => {
    const scroller = renderTabs()
    setGeometry(scroller, {
      scrollWidth: 600,
      clientWidth: 390,
      scrollLeft: 90,
    })

    expect(scroller.style.maskImage).toContain("transparent 0")
    expect(scroller.style.maskImage).toContain("transparent 100%")
  })

  it("fades the start only, at the end of the row", () => {
    const scroller = renderTabs()
    setGeometry(scroller, {
      scrollWidth: 600,
      clientWidth: 390,
      scrollLeft: 210,
    })

    expect(scroller.style.maskImage).toContain("transparent 0")
    expect(scroller.style.maskImage).not.toContain("transparent 100%")
  })
})
