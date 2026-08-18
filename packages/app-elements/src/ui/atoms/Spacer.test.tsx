import { type RenderResult, render } from "@testing-library/react"
import { Spacer, type SpacerProps } from "./Spacer"

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ top, bottom }: Omit<SpacerProps, "children">): SetupResult => {
  const utils = render(
    <Spacer data-testid="my-spacer" top={top} bottom={bottom}>
      <div>inner content</div>
    </Spacer>,
  )
  const element = utils.getByTestId("my-spacer")
  return {
    element,
    ...utils,
  }
}

describe("Spacer", () => {
  test("Should be rendered", () => {
    const { element, getByText } = setup({})
    expect(element).toBeVisible()
    expect(getByText("inner content")).toBeInTheDocument()
  })

  test("Should render spacing 4", () => {
    const { element } = setup({ top: "4", bottom: "4" })
    expect(element).toHaveClass("mt-4")
    expect(element).toHaveClass("mb-4")
  })
  test("Should render spacing 6", () => {
    const { element } = setup({ top: "6", bottom: "6" })
    expect(element).toHaveClass("mt-6")
    expect(element).toHaveClass("mb-6")
  })
  test("Should render spacing 8", () => {
    const { element } = setup({ top: "8", bottom: "8" })
    expect(element).toHaveClass("mt-8")
    expect(element).toHaveClass("mb-8")
  })
  test("Should render spacing 12", () => {
    const { element } = setup({ top: "12", bottom: "12" })
    expect(element).toHaveClass("mt-12")
    expect(element).toHaveClass("mb-12")
  })
  test("Should render spacing 14", () => {
    const { element } = setup({ top: "14", bottom: "14" })
    expect(element).toHaveClass("mt-14")
    expect(element).toHaveClass("mb-14")
  })

  test("Should ignore invalid values", () => {
    // @ts-expect-error I want to test with a wrong value.
    const { element } = setup({ top: 400, bottom: "abc" })
    expect(element.className).toBe("empty:hidden")
  })

  test("Should collapse when its content renders nothing", () => {
    const RendersNothing = (): null => null
    const { getByTestId } = render(
      <Spacer data-testid="my-spacer" top="14">
        <RendersNothing />
      </Spacer>,
    )
    // the div is still in the DOM, but empty — `empty:hidden` is what keeps a
    // section with no data from leaving a block of blank space behind
    const element = getByTestId("my-spacer")
    expect(element).toBeEmptyDOMElement()
    expect(element).toHaveClass("empty:hidden")
  })
})
