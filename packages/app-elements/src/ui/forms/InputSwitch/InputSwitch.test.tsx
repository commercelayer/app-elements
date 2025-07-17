import { fireEvent, type RenderResult, render } from "@testing-library/react"
import { type JSX, useState } from "react"
import { InputSwitch } from "./InputSwitch"

interface SetupProps {
  id: string
  label: string
  description?: React.ReactNode
  isChecked?: boolean
  className?: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

function ToggleImplementation({
  id,
  label,
  isChecked = false,
}: SetupProps): JSX.Element {
  const [state, setState] = useState(isChecked)
  return (
    <InputSwitch
      id={id}
      data-testid={id}
      label={label}
      checked={state}
      onChange={(e) => {
        setState(e.target.checked)
      }}
    />
  )
}

const setup = (props: SetupProps): SetupResult => {
  const utils = render(<ToggleImplementation {...props} />)
  const element = utils.getByTestId(props.id) as HTMLInputElement
  return {
    element,
    ...utils,
  }
}

describe("InputSwitch", () => {
  test("Should be rendered", () => {
    const { element, getByLabelText } = setup({
      id: "my-toggle",
      label: "Cleanup records?",
    })
    expect(element).toBeInTheDocument()
    expect(element.checked).toBe(false)
    expect(getByLabelText("Cleanup records?")).toBeInTheDocument()
  })

  test("Should be rendered with a pre-set checked value", () => {
    const { element } = setup({
      id: "my-toggle",
      label: "Cleanup records?",
      isChecked: true,
    })
    expect(element).toBeInTheDocument()
    expect(element.checked).toBe(true)
  })

  test("Should be able to switch between true and false", () => {
    const { element } = setup({
      id: "my-toggle",
      label: "Cleanup records?",
      isChecked: false,
    })
    expect(element).toBeInTheDocument()
    expect(element.checked).toBe(false)
    fireEvent.click(element)
    expect(element.checked).toBe(true)
    fireEvent.click(element)
    expect(element.checked).toBe(false)
    fireEvent.click(element)
    fireEvent.click(element)
    expect(element.checked).toBe(false)
  })
})
