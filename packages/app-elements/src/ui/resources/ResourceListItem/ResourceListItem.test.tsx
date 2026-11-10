import { render } from "@testing-library/react"
import { MockTokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { ResourceListItem, type ResourceListItemProps } from "./index"
import { presetResourceListItem } from "./ResourceListItem.mocks"

const setup = (props: Omit<ResourceListItemProps, "resource">) =>
  render(
    <MockTokenProvider kind="integration" appSlug="orders" devMode>
      <ResourceListItem
        resource={presetResourceListItem.orderAwaitingApproval}
        {...props}
      />
    </MockTokenProvider>,
  )

describe("ResourceListItem", () => {
  test("should not show the caret of a clickable row without `showCaret`", async () => {
    const { findByTestId, queryByTestId } = setup({ href: "#" })
    expect(await findByTestId("ResourceListItem")).toBeInTheDocument()
    expect(queryByTestId("ResourceListItem-caret")).toBeNull()
  })

  test("should show the caret after the right content with `showCaret`", async () => {
    const { findByTestId } = setup({ href: "#", showCaret: true })
    const caret = await findByTestId("ResourceListItem-caret")
    // the order total is the right content, and the caret follows it
    expect(caret.previousElementSibling?.textContent).not.toBe("")
  })

  test("should show the caret with `showCaret` and a `rightContentOverride`", async () => {
    const { findByTestId } = setup({
      showCaret: true,
      rightContentOverride: <span>override</span>,
    })
    const caret = await findByTestId("ResourceListItem-caret")
    expect(caret.previousElementSibling?.textContent).toBe("override")
  })
})
