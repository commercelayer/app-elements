import { act, renderHook } from "@testing-library/react"
import { computeLabelWithSelected, useToggleCheckboxValues } from "./utils"

describe("useToggleCheckboxValues", () => {
  test("should toggle values", () => {
    const values = ["foo", "bar", "commerce", "layer"]
    const { rerender, result } = renderHook(() =>
      useToggleCheckboxValues(values),
    )

    expect(result.current.values).toStrictEqual([
      "foo",
      "bar",
      "commerce",
      "layer",
    ])

    act(() => {
      result.current.toggleValue("foo")
      rerender()
    })
    expect(result.current.values).toStrictEqual(["bar", "commerce", "layer"])

    act(() => {
      result.current.toggleValue("foo")
      rerender()
    })
    expect(result.current.values).toStrictEqual([
      "bar",
      "commerce",
      "layer",
      "foo",
    ])
  })

  test("should set new values, overwriting existing", () => {
    const values = ["foo", "bar"]
    const { rerender, result } = renderHook(() =>
      useToggleCheckboxValues(values),
    )

    expect(result.current.values).toStrictEqual(["foo", "bar"])
    act(() => {
      result.current.setValues(["commerce", "layer"])
      rerender()
    })
    expect(result.current.values).toStrictEqual(["commerce", "layer"])
  })
})

describe("computeLabelWithSelected", () => {
  test("should return valid computed label", () => {
    expect(
      computeLabelWithSelected({
        label: "Markets",
        selectedCount: 0,
        totalCount: 4,
      }),
    ).toBe("Markets · 4")
  })

  test("should return selected count in computed label", () => {
    expect(
      computeLabelWithSelected({
        label: "Payment status",
        selectedCount: 2,
        totalCount: 6,
      }),
    ).toBe("Payment status · 2 of 6")
  })
})
