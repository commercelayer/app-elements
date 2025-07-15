import { type RenderResult, render } from "@testing-library/react"
import { Hint, type HintProps } from "./Hint"

interface SetupProps extends Omit<HintProps, "children"> {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(
    <Hint data-testid={id} {...rest}>
      This is an helper text.
    </Hint>,
  )
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils,
  }
}

describe("Hint", () => {
  test("Should be rendered", () => {
    const { element } = setup({ id: "my-helper-text" })
    expect(element).toBeInTheDocument()
  })

  test("Should show an icon", () => {
    const { element } = setup({
      id: "my-helper-text-with-bulb",
      icon: "lightbulbFilament",
    })
    expect(element).toBeInTheDocument()
    expect(element.querySelector("svg")).toBeInTheDocument()
  })
})
