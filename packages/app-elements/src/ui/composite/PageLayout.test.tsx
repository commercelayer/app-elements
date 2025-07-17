import { type RenderResult, render } from "@testing-library/react"
import { PageLayout, type PageLayoutProps } from "./PageLayout"

interface SetupProps extends Omit<PageLayoutProps, "children"> {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(
    <PageLayout data-testid={id} {...rest}>
      <div>Content...</div>
    </PageLayout>,
  )
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils,
  }
}

describe("PageLayout", () => {
  test("Should be rendered", () => {
    const { element } = setup({
      title: "Page title",
      id: "my-page",
    })
    expect(element).toBeInTheDocument()
    expect(element).toMatchSnapshot()
  })

  test("Should render test mode badge", () => {
    const { getByText } = setup({
      title: "Page title",
      id: "my-page",
      mode: "test",
    })
    expect(getByText("TEST DATA")).toBeInTheDocument()
  })
})
