import { render } from "@testing-library/react"
import { expect } from "vitest"
import { RadialProgress } from "./RadialProgress"

function getFilledPercentage(circle: HTMLElement): number {
  const circumference = circle.getAttribute("stroke-dasharray")
  const filledPart = circle.getAttribute("stroke-dashoffset")
  return 100 - Math.round((Number(filledPart) * 100) / Number(circumference))
}

describe("RadialProgress", () => {
  test("Should be rendered as pending", () => {
    const { queryByTestId } = render(<RadialProgress percentage={undefined} />)
    expect(queryByTestId("radial-progress-pending")).toBeInTheDocument()
    expect(queryByTestId("radial-progress-percentage")).not.toBeInTheDocument()
  })

  test("Should render an icon", () => {
    const { queryByTestId } = render(
      <RadialProgress percentage={undefined} icon="shoppingBag" />,
    )
    expect(queryByTestId("radial-progress-icon")).toBeInTheDocument()
  })

  test("Should be rendered in progress 0%", () => {
    const { getByTestId, queryByTestId } = render(
      <RadialProgress percentage={0} />,
    )
    const circle = getByTestId("radial-progress-percentage")
    expect(queryByTestId("radial-progress-pending")).not.toBeInTheDocument()
    expect(getFilledPercentage(circle)).toBe(0)
  })

  test("Should be rendered in progress 30%", () => {
    const { getByTestId } = render(<RadialProgress percentage={30} />)
    const circle = getByTestId("radial-progress-percentage")
    expect(getFilledPercentage(circle)).toBe(30)
  })

  test("Should be rendered in progress 50%", () => {
    const { getByTestId } = render(<RadialProgress percentage={50} />)
    const circle = getByTestId("radial-progress-percentage")
    expect(getFilledPercentage(circle)).toBe(50)
  })

  test("Should be rendered in progress 100%", () => {
    const { getByTestId } = render(<RadialProgress percentage={100} />)
    const circle = getByTestId("radial-progress-percentage")
    expect(getFilledPercentage(circle)).toBe(100)
  })

  test("Should parse out of range percentage as 100%", () => {
    const { getByTestId } = render(<RadialProgress percentage={110} />)
    const circle = getByTestId("radial-progress-percentage")
    expect(getFilledPercentage(circle)).toBe(100)
  })

  test("Should parse negative value as 0%", () => {
    const { getByTestId } = render(<RadialProgress percentage={-30} />)
    const circle = getByTestId("radial-progress-percentage")
    expect(getFilledPercentage(circle)).toBe(0)
  })

  test("Should ignore NaN values", () => {
    const { getByTestId } = render(<RadialProgress percentage={NaN} />)
    const circle = getByTestId("radial-progress-percentage")
    expect(getFilledPercentage(circle)).toBe(0)
  })

  test("Should ignore string values", () => {
    // @ts-expect-error I want to test with a wrong value.
    const { getByTestId } = render(<RadialProgress percentage="asd" />)
    const circle = getByTestId("radial-progress-percentage")
    expect(getFilledPercentage(circle)).toBe(0)
  })
})

describe("RadialProgress > svg fillings", () => {
  test("Should have transparent filling when is pending without icon", () => {
    const { getByTestId } = render(<RadialProgress />)
    expect(getByTestId("radial-progress-pending")).toHaveAttribute(
      "fill",
      "transparent",
    )
  })

  test("Should have white filling when is pending with icon", () => {
    const { getByTestId } = render(<RadialProgress icon="cloudArrowUp" />)
    expect(getByTestId("radial-progress-pending")).toHaveAttribute(
      "fill",
      "white",
    )
  })

  test("Should have transparent fillings when is progress without icon", () => {
    const { getByTestId } = render(<RadialProgress percentage={30} />)
    expect(getByTestId("radial-progress-base")).toHaveAttribute(
      "fill",
      "transparent",
    )
    expect(getByTestId("radial-progress-percentage")).toHaveAttribute(
      "fill",
      "transparent",
    )
  })
  test("Should have white fillings, only on base circle, when is progress without icon", () => {
    const { getByTestId } = render(
      <RadialProgress percentage={30} icon="cloudArrowUp" />,
    )
    expect(getByTestId("radial-progress-base")).toHaveAttribute("fill", "white")
    expect(getByTestId("radial-progress-percentage")).toHaveAttribute(
      "fill",
      "transparent",
    )
  })
})
