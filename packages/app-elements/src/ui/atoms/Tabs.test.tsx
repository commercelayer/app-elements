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
