import { fireEvent, type RenderResult, render } from "@testing-library/react"
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
      container.querySelector("nav")?.children ?? [],
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
