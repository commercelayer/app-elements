import { fireEvent, render } from "@testing-library/react"
import { DropdownSearch } from "./DropdownSearch"

describe("DropdownSearch", () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it("should render", () => {
    const { container, getByPlaceholderText } = render(
      <DropdownSearch onSearch={() => {}} placeholder="type to search" />,
    )
    expect(container).toBeVisible()
    expect(getByPlaceholderText("type to search")).toBeVisible()
  })

  it("should update input value", () => {
    const { getByPlaceholderText } = render(
      <DropdownSearch onSearch={() => {}} placeholder="search" />,
    )
    const input = getByPlaceholderText("search") as HTMLInputElement
    expect(input.value).toBe("")
    fireEvent.change(input, { target: { value: "foobar" } })

    expect(input.value).toBe("foobar")
  })

  it("should trigger debounced onSearch callback", () => {
    const mockedConsoleLog = vi
      .spyOn(console, "log")
      .mockImplementation(() => {})
    const { getByPlaceholderText } = render(
      <DropdownSearch
        onSearch={(hint) => {
          console.log(hint)
        }}
        debounceMs={100}
        placeholder="search"
      />,
    )
    const input = getByPlaceholderText("search") as HTMLInputElement
    fireEvent.change(input, { target: { value: "he" } })
    fireEvent.change(input, { target: { value: "hello" } })
    fireEvent.change(input, { target: { value: "hello wo" } })
    fireEvent.change(input, { target: { value: "hello world" } })
    expect(mockedConsoleLog).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(110)
    expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, "hello world")
  })
})
