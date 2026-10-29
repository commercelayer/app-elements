import { type RenderResult, render } from "@testing-library/react"
import { EmptyState, type EmptyStateProps } from "./EmptyState"

interface SetupProps {
  id: string
  title: string
  description?: string
  icon?: EmptyStateProps["icon"]
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<EmptyState data-testid={id} {...rest} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils,
  }
}

describe("EmptyState", () => {
  test("Should be rendered", () => {
    const { element, getByText } = setup({
      id: "my-element",
      title: "Your list is empty",
    })
    expect(element).toBeInTheDocument()
    expect(getByText("Your list is empty")).toBeInTheDocument()
  })

  test("Should render optional description ", () => {
    const { element, getByText } = setup({
      id: "my-element",
      title: "Your list is empty",
      description: "Lorem impsum",
    })
    expect(element).toBeInTheDocument()
    expect(getByText("Your list is empty")).toBeInTheDocument()
    expect(getByText("Lorem impsum")).toBeInTheDocument()
  })

  test("Should render the icon above the title", () => {
    const { element, getByText } = setup({
      id: "my-element",
      title: "No custom apps yet",
      description: "Build tailored views",
      icon: "cardsThree",
    })
    expect(element).toBeInTheDocument()
    expect(getByText("No custom apps yet")).toBeInTheDocument()
    expect(getByText("Build tailored views")).toBeInTheDocument()
    expect(element.querySelector("svg + h4")).toHaveTextContent(
      "No custom apps yet",
    )
  })
})
