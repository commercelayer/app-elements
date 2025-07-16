import { render } from "@testing-library/react"
import { ListDetails } from "./ListDetails"

describe("ListDetails", () => {
  it("Should render", () => {
    const { container } = render(<ListDetails />)
    expect(container.children.length).toEqual(1)
    expect(container.children[0]?.tagName).toEqual("DIV")
    expect(container.children[0]).toBeVisible()
  })

  it("Should render a title", () => {
    const title = "This is a title"
    const { container, getByText } = render(<ListDetails title={title} />)

    expect(container.children.length).toEqual(1)
    expect(container.children[0]?.tagName).toEqual("SECTION")
    expect(container.children[0]).toBeVisible()

    expect(getByText(title)).toBeInTheDocument()
    expect(getByText(title).tagName).toBe("H2")
  })

  it("Should display `isLoading` state with the specified number of `loadingLines`", () => {
    const title = "This is a title"
    const { getByTestId, queryByTestId, queryByText } = render(
      <ListDetails title={title} isLoading loadingLines={10} />,
    )

    expect(getByTestId("details-list-loading-rows").childNodes.length).toBe(10)
    expect(queryByText(title)).not.toBeInTheDocument()
    expect(queryByTestId("details-list-rows")).not.toBeInTheDocument()
  })
})
