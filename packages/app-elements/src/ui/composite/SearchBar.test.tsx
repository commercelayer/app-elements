import { act, fireEvent, render } from "@testing-library/react"
import { SearchBar } from "./SearchBar"

describe("SearchBar", () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it("should render", () => {
    const { container } = render(<SearchBar onSearch={() => {}} />)
    expect(container).toBeVisible()
  })

  it("should render with initial value", () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        onSearch={() => {}}
        placeholder="search"
        initialValue="commerce layer"
      />,
    )
    const input = getByPlaceholderText("search") as HTMLInputElement
    expect(input.value).toBe("commerce layer")
  })

  it("should update input value", () => {
    const { getByTestId } = render(
      <SearchBar
        onSearch={() => {}}
        placeholder="search"
        initialValue="commerce layer"
      />,
    )
    const input = getByTestId("SearchBar-input") as HTMLInputElement
    expect(input.value).toBe("commerce layer")
    fireEvent.change(input, { target: { value: "foobar" } })

    expect(input.value).toBe("foobar")
  })

  it("should trigger debounced onSearch callback", () => {
    const mockedConsoleLog = vi
      .spyOn(console, "log")
      .mockImplementation(() => {})
    const { getByTestId } = render(
      <SearchBar
        onSearch={(hint) => {
          console.log(hint)
        }}
        debounceMs={100}
      />,
    )
    const input = getByTestId("SearchBar-input") as HTMLInputElement
    fireEvent.change(input, { target: { value: "he" } })
    fireEvent.change(input, { target: { value: "hello" } })
    fireEvent.change(input, { target: { value: "hello wo" } })
    fireEvent.change(input, { target: { value: "hello world" } })
    expect(mockedConsoleLog).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(110)
    expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, "hello world")
  })

  it("should trigger onClear", () => {
    const handleClear = vi.fn()
    const { getByTestId, queryByTestId } = render(
      <SearchBar
        onSearch={() => {}}
        onClear={() => {
          handleClear("cleared")
        }}
      />,
    )
    expect(queryByTestId("SearchBar-clear")).not.toBeInTheDocument()

    // typing something
    const input = getByTestId("SearchBar-input") as HTMLInputElement
    fireEvent.change(input, { target: { value: "foobar" } })
    expect(queryByTestId("SearchBar-clear")).toBeVisible()

    act(() => {
      fireEvent.click(getByTestId("SearchBar-clear"))
    })

    expect(handleClear).toHaveBeenNthCalledWith(1, "cleared")
    expect(input.value).toBe("")
  })
  describe("minSearchLength", () => {
    const renderWithThreshold = (): {
      input: HTMLInputElement
      onSearch: ReturnType<typeof vi.fn>
      type: (value: string) => void
    } => {
      const onSearch = vi.fn()
      const { getByTestId } = render(
        <SearchBar onSearch={onSearch} debounceMs={100} minSearchLength={3} />,
      )
      const input = getByTestId("SearchBar-input") as HTMLInputElement

      return {
        input,
        onSearch,
        type: (value) => {
          fireEvent.change(input, { target: { value } })
          act(() => {
            vi.advanceTimersByTime(110)
          })
        },
      }
    }

    it("should not search below the threshold", () => {
      const { onSearch, type } = renderWithThreshold()
      type("fo")
      expect(onSearch).not.toHaveBeenCalled()
    })

    it("should search once the threshold is reached", () => {
      const { onSearch, type } = renderWithThreshold()
      type("foo")
      expect(onSearch).toHaveBeenNthCalledWith(1, "foo")
    })

    it("should not count wildcards at either end", () => {
      const { onSearch, type } = renderWithThreshold()
      // "fo*" is two characters the user actually typed, so it must wait
      type("fo*")
      expect(onSearch).not.toHaveBeenCalled()

      type("foo*")
      expect(onSearch).toHaveBeenNthCalledWith(1, "foo*")
    })

    it("should count a wildcard that is not at either end", () => {
      const { onSearch, type } = renderWithThreshold()
      type("f*o")
      expect(onSearch).toHaveBeenNthCalledWith(1, "f*o")
    })

    it("should clear the search once, when the term falls below the threshold", () => {
      const { onSearch, type } = renderWithThreshold()
      type("foo")
      expect(onSearch).toHaveBeenNthCalledWith(1, "foo")

      // dropping below the threshold means "no search", so the list must not
      // keep showing results for a term the input no longer holds
      type("fo")
      expect(onSearch).toHaveBeenNthCalledWith(2, "")

      // and staying below it must not ask for the same unfiltered list again
      type("f")
      expect(onSearch).toHaveBeenCalledTimes(2)
    })

    it("should default to two characters", () => {
      const onSearch = vi.fn()
      const { getByTestId } = render(
        <SearchBar onSearch={onSearch} debounceMs={100} />,
      )
      const input = getByTestId("SearchBar-input")
      const type = (value: string): void => {
        fireEvent.change(input, { target: { value } })
        act(() => {
          vi.advanceTimersByTime(110)
        })
      }

      // a single character matches most of any collection, so it is not worth a request
      type("f")
      expect(onSearch).not.toHaveBeenCalled()

      type("fo")
      expect(onSearch).toHaveBeenNthCalledWith(1, "fo")
    })

    it("should search on every keystroke when the threshold is disabled", () => {
      const onSearch = vi.fn()
      const { getByTestId } = render(
        <SearchBar onSearch={onSearch} debounceMs={100} minSearchLength={0} />,
      )
      fireEvent.change(getByTestId("SearchBar-input"), {
        target: { value: "f" },
      })
      act(() => {
        vi.advanceTimersByTime(110)
      })
      expect(onSearch).toHaveBeenNthCalledWith(1, "f")
    })
  })
})
