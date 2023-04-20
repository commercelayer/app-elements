import { fireEvent, render, act } from '@testing-library/react'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should render', () => {
    const { container } = render(<SearchBar onSearch={() => {}} />)
    expect(container).toBeVisible()
  })

  it('should render with initial value', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        onSearch={() => {}}
        placeholder='search'
        initialValue='commerce layer'
      />
    )
    const input = getByPlaceholderText('search') as HTMLInputElement
    expect(input.value).toBe('commerce layer')
  })

  it('should update input value', () => {
    const { getByTestId } = render(
      <SearchBar
        onSearch={() => {}}
        placeholder='search'
        initialValue='commerce layer'
      />
    )
    const input = getByTestId('SearchBar-input') as HTMLInputElement
    expect(input.value).toBe('commerce layer')
    fireEvent.change(input, { target: { value: 'foobar' } })

    expect(input.value).toBe('foobar')
  })

  it('should trigger debounced onSearch callback', () => {
    const mockedConsoleLog = vi.spyOn(console, 'log')
    const { getByTestId } = render(
      <SearchBar
        onSearch={(hint) => {
          console.log(hint)
        }}
        debounceMs={100}
      />
    )
    const input = getByTestId('SearchBar-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'he' } })
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.change(input, { target: { value: 'hello wo' } })
    fireEvent.change(input, { target: { value: 'hello world' } })
    expect(mockedConsoleLog).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(110)
    expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, 'hello world')
  })

  it('should trigger onClear', () => {
    const mockedConsoleLog = vi.spyOn(console, 'log')
    const { getByTestId, queryByTestId } = render(
      <SearchBar
        onSearch={() => {}}
        onClear={() => {
          console.log('cleared')
        }}
      />
    )
    expect(queryByTestId('SearchBar-clear')).not.toBeInTheDocument()

    // typing something
    const input = getByTestId('SearchBar-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'foobar' } })
    expect(queryByTestId('SearchBar-clear')).toBeVisible()

    act(() => {
      fireEvent.click(getByTestId('SearchBar-clear'))
    })
    expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, 'cleared')
    expect(input.value).toBe('')
  })
})
