import { act, fireEvent, render } from "@testing-library/react"
import { InputSpinner } from "./InputSpinner"

describe("InputSpinner", () => {
  test("Should be rendered", () => {
    const { container } = render(
      <InputSpinner defaultValue={0} onChange={() => {}} />,
    )
    expect(container).toBeInTheDocument()
  })

  test("Should be rendered with a default value", () => {
    const { getByTestId } = render(
      <InputSpinner defaultValue={5} onChange={() => {}} />,
    )
    const inputEl = getByTestId("InputSpinner-input") as HTMLInputElement
    expect(inputEl.value).toBe("5")
  })
})

describe("InputSpinner manually updated", () => {
  test("Should update value manually", () => {
    const mockedOnChange = vi.fn()
    const { getByTestId } = render(
      <InputSpinner defaultValue={0} onChange={mockedOnChange} />,
    )
    const inputEl = getByTestId("InputSpinner-input") as HTMLInputElement
    act(() => {
      fireEvent.change(inputEl, { target: { value: 5 } })
    })
    expect(mockedOnChange).toHaveBeenNthCalledWith(1, 5)
  })

  test("Should NOT update manually for value more than max", () => {
    const mockedOnChange = vi.fn()
    const { getByTestId } = render(
      <InputSpinner max={11} defaultValue={10} onChange={mockedOnChange} />,
    )
    const inputEl = getByTestId("InputSpinner-input") as HTMLInputElement
    act(() => {
      fireEvent.change(inputEl, { target: { value: 12 } })
    })
    expect(mockedOnChange).not.toBeCalled()
  })
})

describe("InputSpinner buttons", () => {
  test("Should increment by button", () => {
    const mockedOnChange = vi.fn()
    const { getByTestId } = render(
      <InputSpinner defaultValue={0} onChange={mockedOnChange} />,
    )
    const incrementBtn = getByTestId("InputSpinner-increment")
    act(() => {
      fireEvent.click(incrementBtn)
    })
    expect(mockedOnChange).toHaveBeenNthCalledWith(1, 1)
  })

  test("Should NOT increment for value more than max", () => {
    const mockedOnChange = vi.fn()
    const { getByTestId } = render(
      <InputSpinner max={11} defaultValue={10} onChange={mockedOnChange} />,
    )
    const incrementBtn = getByTestId("InputSpinner-increment")
    act(() => {
      fireEvent.click(incrementBtn)
    })
    // goes to 11
    expect(mockedOnChange).toHaveBeenNthCalledWith(1, 11)

    act(() => {
      fireEvent.click(incrementBtn)
    })
    // should not have been called again since we are at max already
    expect(mockedOnChange).toHaveBeenNthCalledWith(1, 11)
    const inputEl = getByTestId("InputSpinner-input") as HTMLInputElement
    expect(inputEl.value).toBe("11")
  })

  test("Should decrement by button", () => {
    const mockedOnChange = vi.fn()
    const { getByTestId } = render(
      <InputSpinner defaultValue={5} onChange={mockedOnChange} />,
    )
    const decrementBtn = getByTestId("InputSpinner-decrement")
    act(() => {
      fireEvent.click(decrementBtn)
    })
    expect(mockedOnChange).toHaveBeenNthCalledWith(1, 4)
  })

  test("Should NOT decrement for value less than min", () => {
    const mockedOnChange = vi.fn()
    const { getByTestId } = render(
      <InputSpinner min={0} defaultValue={1} onChange={mockedOnChange} />,
    )
    const decrementBtn = getByTestId("InputSpinner-decrement")
    act(() => {
      fireEvent.click(decrementBtn)
    })
    // goes to 0
    expect(mockedOnChange).toHaveBeenNthCalledWith(1, 0)

    act(() => {
      fireEvent.click(decrementBtn)
    })
    // should not have been called again since we are at min already
    expect(mockedOnChange).toHaveBeenNthCalledWith(1, 0)
    const inputEl = getByTestId("InputSpinner-input") as HTMLInputElement
    expect(inputEl.value).toBe("0")
  })

  test("Should go negative when no min is set", () => {
    const mockedOnChange = vi.fn()
    const { getByTestId } = render(
      <InputSpinner defaultValue={1} onChange={mockedOnChange} />,
    )
    const incrementBtn = getByTestId("InputSpinner-decrement")
    act(() => {
      fireEvent.click(incrementBtn)
    })
    // goes to 0
    expect(mockedOnChange).toHaveBeenNthCalledWith(1, 0)

    act(() => {
      fireEvent.click(incrementBtn)
    })
    // goes to -1
    expect(mockedOnChange).toHaveBeenNthCalledWith(2, -1)
  })
})
