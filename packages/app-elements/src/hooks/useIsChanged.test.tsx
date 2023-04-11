import { renderHook, act } from '@testing-library/react'
import { useIsChanged } from './useIsChanged'

describe('useIsChanged', () => {
  test('Should detect changes of value', () => {
    let value: Record<string, string> = { foo: 'bar' }
    const { result, rerender } = renderHook(() =>
      useIsChanged({
        value
      })
    )

    // changing value
    act(() => {
      value = { foo: 'baz' }
      rerender()
    })
    expect(result.current).toBe(true)

    // re-rendering with the same value
    act(() => {
      value = { foo: 'baz' }
      rerender()
    })
    expect(result.current).toBe(false)
  })

  test('Should trigger onChange callback every time value is changed', () => {
    const mockedConsoleLog = vi.spyOn(console, 'log')
    let value: Record<string, string> = { foo: 'bar' }

    const { result, rerender } = renderHook(() =>
      useIsChanged({
        value,
        onChange: () => {
          console.log('value is changed')
        }
      })
    )

    // changing value
    act(() => {
      value = { foo: 'baz' }
      rerender()
    })
    expect(result.current).toBe(true)
    expect(mockedConsoleLog).toBeCalledTimes(1)

    // re-rendering with the same value
    act(() => {
      value = { foo: 'baz' }
      rerender()
    })
    expect(result.current).toBe(false)
    expect(mockedConsoleLog).toBeCalledTimes(1)

    // changing value again
    act(() => {
      value = { foo: 'baz', bar: 'foo' }
      rerender()
    })
    expect(result.current).toBe(true)
    expect(mockedConsoleLog).toBeCalledTimes(2)
  })
})
