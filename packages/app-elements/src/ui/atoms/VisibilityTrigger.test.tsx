import { render } from "@testing-library/react"
import { VisibilityTrigger } from "./VisibilityTrigger"

describe("VisibilityTrigger", () => {
  test("Should render", async () => {
    const onCallback = vi.fn()
    const { getByTestId } = render(
      <VisibilityTrigger enabled callback={onCallback} />,
    )
    expect(getByTestId("visibility-trigger")).toBeVisible()
    window.dispatchEvent(new Event("triggerIntersection"))
    expect(onCallback).toHaveBeenCalled()
  })

  test("Should have a height, so it is not flush against the scroll boundary", async () => {
    const { getByTestId } = render(
      <VisibilityTrigger enabled callback={vi.fn()} />,
    )

    expect(getByTestId("visibility-trigger")).toHaveClass("h-px")
  })

  test("Should keep a caller's className alongside its own", async () => {
    const { getByTestId } = render(
      <VisibilityTrigger enabled callback={vi.fn()} className="mt-4" />,
    )

    const trigger = getByTestId("visibility-trigger")
    expect(trigger).toHaveClass("h-px")
    expect(trigger).toHaveClass("mt-4")
  })
})
