import { render } from "@testing-library/react"
import { A } from "./A"
import { Avatar } from "./Avatar"
import { Badge } from "./Badge"
import { Button } from "./Button"
import { Icon } from "./Icon"
import { RadialProgress } from "./RadialProgress"
import { SkeletonTemplate } from "./SkeletonTemplate"
import { StatusIcon } from "./StatusIcon"
import { Text } from "./Text"

describe("SkeletonTemplate", () => {
  test("Should render", () => {
    const { container } = render(
      <SkeletonTemplate isLoading>
        <div>Element #1</div>
        <div>Element #2</div>
        <div>Element #3</div>
      </SkeletonTemplate>,
    )

    expect(container).toBeVisible()
  })

  test('Should render text elements as "loading items"', () => {
    const { getByText, getByTestId } = render(
      <SkeletonTemplate isLoading>
        <div>Element #1</div>
        <A href="https://commercelayer.io">Element #2</A>
        <a href="https://commercelayer.io">Element #3</a>
        <Text>Element #4</Text>
        <Button data-testid="button">Element #5</Button>
      </SkeletonTemplate>,
    )

    expect(getByText("Element #1")).toHaveClass("animate-pulse", "bg-gray-50!")
    expect(getByText("Element #1").nodeName).toEqual("SPAN")

    expect(getByText("Element #2")).toHaveClass("animate-pulse", "bg-gray-50!")
    expect(getByText("Element #2").nodeName).toEqual("SPAN")

    expect(getByText("Element #3")).toHaveClass("animate-pulse", "bg-gray-50!")
    expect(getByText("Element #3").nodeName).toEqual("SPAN")

    expect(getByText("Element #4")).toHaveClass("animate-pulse", "bg-gray-50!")
    expect(getByText("Element #4").nodeName).toEqual("SPAN")

    expect(getByText("Element #5")).toHaveClass("animate-pulse", "bg-gray-50!")
    expect(getByText("Element #5").nodeName).toEqual("SPAN")

    expect(getByTestId("button")).toHaveClass("animate-pulse", "bg-gray-50!")
  })

  test('Should render <Avatar> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate isLoading>
        <Avatar
          data-testid="element"
          src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
          alt="transparent 1px image"
        />
      </SkeletonTemplate>,
    )

    expect(getByTestId("element")).toHaveClass("animate-pulse", "bg-gray-50!")
  })

  test('Should render <Badge> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate isLoading>
        <Badge data-testid="element" variant="danger">
          APPROVED
        </Badge>
      </SkeletonTemplate>,
    )

    expect(getByTestId("element")).toHaveClass("animate-pulse", "bg-gray-50!")
  })

  test('Should render <Icon> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate isLoading>
        <Icon data-testid="element" name="arrowLeft" />
      </SkeletonTemplate>,
    )

    expect(getByTestId("element")).toHaveClass("animate-pulse", "bg-gray-50!")
  })

  test('Should render <StatusIcon> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate isLoading>
        <StatusIcon data-testid="element" name="arrowLeft" />
      </SkeletonTemplate>,
    )

    expect(getByTestId("element")).toHaveClass("animate-pulse", "bg-gray-50!")
  })

  test('Should render RadialProgress as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate isLoading>
        <RadialProgress />
      </SkeletonTemplate>,
    )

    expect(getByTestId("radial-progress")).toHaveClass(
      "animate-pulse",
      "bg-gray-50!",
    )
  })

  test('Should render <RadialProgress percentage> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate isLoading>
        <RadialProgress percentage={42} />
      </SkeletonTemplate>,
    )

    expect(getByTestId("radial-progress")).toHaveClass(
      "animate-pulse",
      "bg-gray-50!",
    )
  })
})
