import { fireEvent, type RenderResult, render } from "@testing-library/react"
import type { InputProps } from "./Input"
import { Input } from "./Input"

interface SetupProps extends InputProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id, type }: SetupProps): SetupResult => {
  const utils = render(<Input data-testid={id} type={type} />)
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils,
  }
}

describe("Input", () => {
  test("Should be rendered", () => {
    const { element } = setup({
      id: "my-input",
      type: "text",
    })
    expect(element).toBeInTheDocument()
  })
  test("Should update value", () => {
    const { element } = setup({
      id: "my-input",
      type: "text",
    })
    expect(element.value).toBe("")
    fireEvent.change(element, { target: { value: "I love Commerce Layer" } })
    expect(element.value).toBe("I love Commerce Layer")
  })
  test("Should look not editable when read-only", () => {
    const { getByTestId } = render(
      <Input
        data-testid="my-input"
        defaultValue="buyer@example.com"
        readOnly
      />,
    )
    const element = getByTestId("my-input") as HTMLInputElement
    expect(element).toHaveAttribute("readonly")
    expect(element).toHaveClass(
      "read-only:bg-gray-50",
      "read-only:text-gray-500",
    )
  })
})
